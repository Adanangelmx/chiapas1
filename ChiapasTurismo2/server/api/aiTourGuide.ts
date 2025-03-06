import { Request, Response } from 'express';
import { z } from 'zod';
import OpenAI from "openai";

// Inicializar el cliente de OpenAI con la clave API
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// Validación del esquema de solicitud
export const aiTourGuideSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía"),
  context: z.string().nullable().optional(),
  previousMessages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).optional()
});

export type AITourGuideRequest = z.infer<typeof aiTourGuideSchema>;

// Función para extraer información para Google Maps
function extractLocationInfo(content: string) {
  // Extraer lugares mencionados en la respuesta para el mapa
  const attractions = [];
  
  // Patrones comunes en Chiapas con triggers ampliados
  const chiapasLocations = [
    { name: "San Cristóbal de las Casas", lat: 16.737, lng: -92.6376, 
      description: "Ciudad colonial en los altos de Chiapas", 
      trigger: ["san cristóbal", "sancris", "san cristobal", "san cristóbal de las casas", "altos de chiapas"] },
    { name: "Palenque", lat: 17.4838, lng: -92.0436, 
      description: "Zona arqueológica maya en la selva", 
      trigger: ["palenque", "ruinas", "maya", "zona arqueológica", "templo de las inscripciones"] },
    { name: "Tuxtla Gutiérrez", lat: 16.7521, lng: -93.1152, 
      description: "Capital de Chiapas", 
      trigger: ["tuxtla", "capital", "tuxtla gutiérrez", "tuxtla gutierrez"] },
    { name: "Cañón del Sumidero", lat: 16.8513, lng: -93.0777, 
      description: "Impresionante cañón con paredes de hasta 1000 metros", 
      trigger: ["sumidero", "cañón", "canon", "mirador", "lancha", "cañón del sumidero", "paseo en lancha"] },
    { name: "Cascadas de Agua Azul", lat: 17.2514, lng: -92.1133, 
      description: "Cascadas turquesas cerca de Palenque", 
      trigger: ["agua azul", "cascada", "cataratas", "cascadas", "agua clara", "cascadas de agua azul", "aguas turquesas"] },
    { name: "Chiapa de Corzo", lat: 16.7068, lng: -93.0150, 
      description: "Pueblo Mágico junto al Grijalva", 
      trigger: ["chiapa de corzo", "chiapa", "pueblo mágico", "fiesta grande", "grijalva", "embarcadero"] },
    { name: "San Juan Chamula", lat: 16.7900, lng: -92.6882, 
      description: "Comunidad indígena con tradiciones únicas", 
      trigger: ["chamula", "tzotzil", "san juan chamula", "comunidad indígena", "iglesia de chamula", "rituales"] },
    { name: "Lagos de Montebello", lat: 16.1119, lng: -91.6767, 
      description: "Lagos multicolores en la frontera con Guatemala", 
      trigger: ["montebello", "lagos", "lagos de montebello", "lagos de colores", "lagunas", "parque nacional"] },
    { name: "Comitán de Domínguez", lat: 16.2548, lng: -92.1336, 
      description: "Ciudad colonial cerca de la frontera", 
      trigger: ["comitán", "comitan", "comitán de domínguez", "comitan de dominguez", "frontera", "belisario"] },
    { name: "Selva Lacandona", lat: 16.8821, lng: -91.1196, 
      description: "Una de las selvas tropicales más importantes de México", 
      trigger: ["lacandona", "selva", "selva lacandona", "comunidad lacandona", "montes azules", "reserva de la biosfera"] },
    { name: "Cascadas El Chiflón", lat: 16.0049, lng: -92.2633, 
      description: "Impresionantes cascadas con aguas color turquesa", 
      trigger: ["chiflón", "chiflon", "cascadas el chiflón", "cascadas el chiflon", "velo de novia"] },
    { name: "Zinacantán", lat: 16.7676, lng: -92.7085, 
      description: "Pueblo indígena famoso por sus textiles", 
      trigger: ["zinacantán", "zinacantan", "textiles", "tzotziles", "flores", "telar"] },
    { name: "Bonampak", lat: 16.7042, lng: -91.0648, 
      description: "Sitio arqueológico con murales mayas", 
      trigger: ["bonampak", "murales", "murales mayas", "pinturas", "sitio arqueológico"] },
    { name: "Yaxchilán", lat: 16.8967, lng: -90.9639, 
      description: "Antigua ciudad maya en la selva junto al río Usumacinta", 
      trigger: ["yaxchilán", "yaxchilan", "usumacinta", "río usumacinta", "frontera guatemala"] },
    { name: "Tapachula", lat: 14.9108, lng: -92.2571, 
      description: "Ciudad fronteriza con Guatemala y puerta al Soconusco", 
      trigger: ["tapachula", "soconusco", "frontera sur", "café", "plantaciones"] }
  ];
  
  // Normalizar el texto para buscar coincidencias
  const normalizedContent = content.toLowerCase();
  
  // Identificar lugares mencionados
  chiapasLocations.forEach(location => {
    const triggers = location.trigger;
    for (const trigger of triggers) {
      if (normalizedContent.includes(trigger)) {
        attractions.push({
          name: location.name,
          description: location.description,
          location: "Chiapas, México",
          coordinates: {
            lat: location.lat,
            lng: location.lng
          }
        });
        break; // Una vez encontrada una coincidencia, no seguir buscando para este lugar
      }
    }
  });
  
  // Si no hay atracciones identificadas, agregar por defecto San Cristóbal
  if (attractions.length === 0) {
    attractions.push({
      name: "San Cristóbal de las Casas",
      description: "Ciudad colonial en los altos de Chiapas",
      location: "Chiapas, México",
      coordinates: {
        lat: 16.737,
        lng: -92.6376
      }
    });
  }
  
  // Limitar a máximo 3 atracciones para evitar sobrecarga visual en el mapa
  // y solo mantener las más relevantes
  if (attractions.length > 3) {
    // Priorizamos destinos únicos (eliminamos duplicados)
    const uniqueAttractions = attractions.filter((attraction, index, self) =>
      index === self.findIndex((a) => a.name === attraction.name)
    );
    
    return uniqueAttractions.slice(0, 3);
  }
  
  return attractions;
}

/**
 * Esta implementación usa OpenAI para generar respuestas adaptativas
 * que se ajustan al contexto de la conversación.
 */
export async function handleAITourGuide(req: Request, res: Response) {
  try {
    // Validar la solicitud
    const { question, context, previousMessages = [] } = aiTourGuideSchema.parse(req.body);
    
    // Construir mensajes para el contexto de la conversación con tipado correcto
    const systemMessage = {
      role: "system" as const,
      content: `Eres un experto guía turístico especializado en Chiapas, México, llamado "ChiapasGuide". 
Tu trabajo es proporcionar información detallada, útil y precisa sobre destinos, atracciones, cultura, 
gastronomía, clima, transportes, temporadas y consejos prácticos para viajeros que visitan Chiapas.

Contexto actual: ${context || "Consulta general sobre turismo en Chiapas"}

ESPECIALIZACIÓN EN RESPUESTAS ESPECÍFICAS:
- Si preguntan sobre transporte público (por ejemplo: "¿Cómo llegar desde San Cristóbal a Palenque en transporte público?"), proporciona:
  * Opciones disponibles (autobuses, colectivos, taxis compartidos)
  * Compañías de transporte específicas (ADO, OCC, Colectivos locales, etc.)
  * Horarios aproximados (siendo claro que pueden cambiar)
  * Tarifas promedio en pesos mexicanos (MXN) actualizado a 2025
  * Duración estimada del viaje
  * Consejos prácticos para el viaje

- Si preguntan sobre alojamiento o comida, proporciona:
  * Nombres reales de al menos 3 establecimientos con distintos rangos de precios
  * Tarifas aproximadas en pesos mexicanos (MXN) actualizado a 2025
  * Ubicaciones precisas o referencias claras
  * Especialidades culinarias cuando corresponda
  * Opiniones honestas sobre calidad/precio

- Si preguntan sobre clima y temporadas:
  * Información precisa y estacional para la fecha actual (${new Date().toLocaleDateString('es-MX')})
  * Sugerencias de ropa y equipo adecuado
  * Actividades recomendadas según el clima
  * Eventos o festivales especiales de la temporada

DIRECTRICES GENERALES:
1. Usa un tono AMIGABLE y PERSONAL, como un local entusiasta compartiendo sus secretos
2. Estructura tus respuestas con VIÑETAS Y EMOJIS para mejorar la legibilidad
3. Incluye DATOS PRECISOS Y ESPECÍFICOS: nombres reales, precios actualizados, ubicaciones exactas
4. Menciona siempre RANGOS DE PRECIOS en pesos mexicanos ($ = económico, $$ = medio, $$$ = alto)
5. Incluye ADVERTENCIAS DE SEGURIDAD cuando sea relevante
6. Adapta tu respuesta a la TEMPORADA ACTUAL
7. Si no sabes algo específico, SÉ HONESTO y sugiere alternativas o fuentes confiables
8. Personaliza cada respuesta según el tipo de viajero (mochilero, familia, pareja, etc.)
9. NO inventes información, lugares o precios
10. Limita tu respuesta a un máximo de 2000 caracteres para mantenerla concisa`
    };
    
    // Crear array de mensajes con typing correcto para OpenAI API
    let apiMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [systemMessage];
    
    // Añadir mensajes previos para mantener el contexto de la conversación
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach(message => {
        apiMessages.push({
          role: message.role === 'user' ? 'user' : 'assistant',
          content: message.content
        });
      });
    }
    
    // Añadir la pregunta actual
    apiMessages.push({
      role: "user",
      content: question
    });
    
    // Realizar la llamada a la API con configuración optimizada para respuestas de guía turístico
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usamos GPT-4 Mini para reducir costos
      messages: apiMessages,
      temperature: 0.8, // Un poco más de creatividad para respuestas turísticas interesantes
      max_tokens: 1200, // Ampliamos para respuestas más completas
      top_p: 0.9, // Mantener diversidad en vocabulario y estilo
      presence_penalty: 0.4, // Evitar repeticiones
      frequency_penalty: 0.3 // Fomentar diversidad léxica
    });
    
    // Extraer contenido de la respuesta
    const responseContent = response.choices[0].message.content || "Lo siento, no pude procesar tu pregunta. Por favor, intenta de nuevo.";
    
    // Extraer información de lugares para el mapa
    const attractions = extractLocationInfo(responseContent);
    
    // Devolver respuesta estructurada
    return res.json({
      response: responseContent,
      attractions: attractions
    });
    
  } catch (error) {
    console.error('Error procesando la consulta del asistente de viajes:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: 'Ocurrió un problema al procesar tu solicitud.'
    });
  }
}