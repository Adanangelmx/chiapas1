import { Request, Response } from 'express';
import { z } from 'zod';

// Validación del esquema de solicitud
export const openRouterSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía"),
  previousMessages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).optional().default([])
});

export type OpenRouterRequest = z.infer<typeof openRouterSchema>;

/**
 * Handler que utiliza OpenRouter como backend
 */
export async function handleOpenRouter(req: Request, res: Response) {
  try {
    // Validar la solicitud
    const { question, previousMessages = [] } = openRouterSchema.parse(req.body);
    
    // Crear el sistema prompt
    const systemMessage = {
      role: "system",
      content: `Eres un experto guía turístico especializado en Chiapas, México, llamado "ChiapasGuide". 
Tu trabajo es proporcionar información detallada, útil y precisa sobre destinos, atracciones, cultura, 
gastronomía, clima, transportes, temporadas y consejos prácticos para viajeros que visitan Chiapas.

DIRECTRICES PARA RESPUESTAS:
1. Usa un tono AMIGABLE y PERSONAL, como un local entusiasta compartiendo sus secretos
2. Estructura tus respuestas con VIÑETAS Y EMOJIS para mejorar la legibilidad
3. Incluye DATOS PRECISOS Y ESPECÍFICOS: nombres reales, precios, ubicaciones
4. Menciona siempre RANGOS DE PRECIOS en pesos mexicanos ($ = económico, $$ = medio, $$$ = alto)
5. Incluye ADVERTENCIAS DE SEGURIDAD cuando sea relevante
6. Adapta tu respuesta a la TEMPORADA ACTUAL (primavera 2024)
7. Personaliza cada respuesta según el tipo de viajero (mochilero, familia, pareja, etc.)
8. NO inventes información, lugares o precios`
    };
    
    // Crear array de mensajes
    let apiMessages = [systemMessage];
    
    // Añadir mensajes previos para mantener el contexto de la conversación
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach(message => {
        apiMessages.push({
          role: message.role,
          content: message.content
        });
      });
    }
    
    // Añadir la pregunta actual
    apiMessages.push({
      role: "user",
      content: question
    });
    
    // Usar OpenAI en lugar de OpenRouter debido a problemas de autenticación
    console.log('Enviando solicitud a OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      console.error('Error de OpenRouter API:', await response.text());
      return res.status(500).json({ 
        error: 'Error al comunicarse con OpenRouter API', 
        message: 'No se pudo obtener una respuesta del servicio.'
      });
    }
    
    // Procesar la respuesta de OpenRouter
    const data = await response.json();
    const responseContent = data.choices[0]?.message?.content || 
                             "Lo siento, no pude procesar tu pregunta. Por favor, intenta de nuevo.";
    
    // Extraer información de lugares para el mapa (reutilizando la función existente)
    const attractions = extractLocationInfo(responseContent);
    
    // Devolver respuesta estructurada
    return res.json({
      response: responseContent,
      attractions: attractions
    });
    
  } catch (error) {
    console.error('Error procesando la consulta con OpenRouter:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: 'Ocurrió un problema al procesar tu solicitud.'
    });
  }
}

// Función para extraer información para Google Maps
function extractLocationInfo(content: string) {
  // Extraer lugares mencionados en la respuesta para el mapa
  const attractions = [];
  
  // Patrones comunes en Chiapas
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
  if (attractions.length > 3) {
    const uniqueAttractions = attractions.filter((attraction, index, self) =>
      index === self.findIndex((a) => a.name === attraction.name)
    );
    
    return uniqueAttractions.slice(0, 3);
  }
  
  return attractions;
}