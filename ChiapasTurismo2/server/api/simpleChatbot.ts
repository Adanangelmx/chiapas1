import OpenAI from "openai";
import { Request, Response } from "express";
import { z } from "zod";

// Definición del esquema de validación para la solicitud
export const simpleChatbotSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  history: z
    .array(
      z.object({
        content: z.string(),
        role: z.enum(["user", "assistant"])
      })
    )
    .optional(),
});

export type SimpleChatbotRequest = z.infer<typeof simpleChatbotSchema>;

// Cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Extrae información de ubicaciones del contenido
 */
function extractLocationInfo(content: string) {
  // Lista de destinos principales en Chiapas
  const places = [
    { name: "San Cristóbal de las Casas", lat: 16.7370, lng: -92.6376 },
    { name: "Palenque", lat: 17.4848, lng: -92.0461 },
    { name: "Tuxtla Gutiérrez", lat: 16.7530, lng: -93.1152 },
    { name: "Comitán", lat: 16.2511, lng: -92.1344 },
    { name: "Chiapa de Corzo", lat: 16.7068, lng: -93.0148 },
    { name: "Cascadas de Agua Azul", lat: 17.2515, lng: -92.1178 },
    { name: "Lagunas de Montebello", lat: 16.1113, lng: -91.6769 },
    { name: "Cañón del Sumidero", lat: 16.8139, lng: -93.0778 },
    { name: "Zinacantán", lat: 16.7761, lng: -92.6866 },
    { name: "San Juan Chamula", lat: 16.7825, lng: -92.6867 }
  ];

  const attractions = places
    .filter(place => content.toLowerCase().includes(place.name.toLowerCase()))
    .map(place => ({
      name: place.name,
      description: `Destino turístico en Chiapas`,
      location: "Chiapas, México",
      coordinates: {
        lat: place.lat,
        lng: place.lng
      }
    }));

  return attractions;
}

/**
 * Manejador de la solicitud de chatbot que utiliza OpenAI
 */
export async function handleSimpleChatbot(req: Request, res: Response) {
  try {
    const { message, history } = simpleChatbotSchema.parse(req.body);

    // Construimos el historial para la conversación con OpenAI
    const messages = [
      {
        role: "system",
        content: `Eres un asistente turístico especializado en Chiapas, México. 
        Proporciona información precisa y útil sobre destinos, alojamiento, transporte, gastronomía, 
        clima, artesanías y cultura de Chiapas.
        
        Tu personalidad:
        - Amable y servicial, como un guía local
        - Informativo pero conciso (respuestas de 3-5 párrafos máximo)
        - Entusiasta sobre la cultura y atractivos de Chiapas
        
        Pautas:
        - Proporciona información real y actualizada sobre Chiapas
        - Si no sabes algo, admítelo honestamente en lugar de inventar
        - Incluye consejos prácticos cuando sea relevante
        - Responde en el mismo idioma en que te preguntan (español o inglés)
        - Cuando menciones lugares específicos, incluye detalles como ubicación, cómo llegar y horarios si los conoces
        - Si se trata de una pregunta común, da una respuesta completa
        - Evita respuestas extremadamente largas
        
        Información de referencia:
        - Principales destinos: San Cristóbal de las Casas, Palenque, Tuxtla Gutiérrez, Comitán, Chiapa de Corzo
        - Atracciones naturales: Cañón del Sumidero, Cascadas de Agua Azul, Lagunas de Montebello, Selva Lacandona
        - Atracciones culturales: Zonas arqueológicas mayas de Palenque, Yaxchilán y Bonampak
        - Pueblos indígenas: Tzotziles, Tzeltales, Lacandones, Choles
        - Artesanías: Ámbar, textiles, alfarería, laca`
      }
    ];

    // Añadimos el historial de conversación si existe
    if (history && history.length > 0) {
      history.forEach(entry => {
        messages.push({
          role: entry.role as any,
          content: entry.content
        });
      });
    }

    // Añadimos el mensaje actual del usuario
    messages.push({
      role: "user",
      content: message
    });

    // Realizamos la llamada a la API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usamos GPT-4 Mini para reducir costos
      messages: messages as any,
      temperature: 0.7, // Ligera creatividad
      max_tokens: 1000 // Limitamos longitud de respuesta
    });

    // Extraemos la respuesta
    const botResponse = response.choices[0].message.content || 
      "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";

    // Extraemos información de ubicaciones para enriquecer la respuesta
    const attractions = extractLocationInfo(botResponse);

    // Devolvemos la respuesta
    return res.status(200).json({
      response: botResponse,
      attractions
    });
  } catch (error) {
    console.error("Error en SimpleChatbot:", error);
    
    // Manejo de errores específicos
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Datos de entrada inválidos", details: error.errors });
    }
    
    return res.status(500).json({ 
      error: "Error al procesar la solicitud", 
      message: error instanceof Error ? error.message : "Error desconocido" 
    });
  }
}