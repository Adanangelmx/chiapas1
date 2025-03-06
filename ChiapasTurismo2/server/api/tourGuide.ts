import { OpenAI } from 'openai';
import { z } from 'zod';
import { Request, Response } from 'express';

const tourGuideSchema = z.object({
  question: z.string().min(1),
  intent: z.enum(['itinerary', 'question', 'followup']).optional(),
  context: z.string().nullable().optional()
});

export type TourGuideRequest = z.infer<typeof tourGuideSchema>;

export async function handleTourGuideRequest(req: Request, res: Response) {
  try {
    const parsedBody = tourGuideSchema.safeParse(req.body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        error: 'Solicitud inválida',
        details: parsedBody.error.format() 
      });
    }
    
    const { question } = parsedBody.data;
    
    // Verificar si hay una clave de API válida
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY no está configurada');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor',
        details: 'La clave de API no está configurada' 
      });
    }
    
    // Crear cliente de OpenAI
    const openai = new OpenAI({ apiKey });
    
    // Crear el sistema prompt para especializar el asistente en turismo de Chiapas
    const systemPrompt = `Eres un experto guía turístico especializado en Chiapas, México. 
Tu trabajo es proporcionar información detallada, útil y precisa sobre destinos, atracciones, cultura, 
gastronomía, clima, transportes, temporadas y consejos prácticos para viajeros que visitan Chiapas.

IMPORTANTE: Solo proporciona información sobre Chiapas, México. Si te preguntan sobre otro destino o tema no relacionado con Chiapas, 
explica amablemente que eres un guía especializado únicamente en Chiapas y sus alrededores.

ESPECIALIZACIÓN EN RESPUESTAS ESPECÍFICAS:
- Si preguntan sobre transporte público (como "¿Cómo llegar desde San Cristóbal a Palenque en transporte público?"), proporciona:
  * Opciones disponibles (autobuses, colectivos, taxis compartidos)
  * Compañías de transporte específicas (ADO, OCC, Colectivos locales, etc.)
  * Horarios aproximados (especificando si son actualizados frecuentemente)
  * Tarifas promedio en pesos mexicanos (claramente marcadas como aproximadas)
  * Duración estimada del viaje
  
- Si preguntan sobre horarios de atracciones o servicios (como "¿Cuándo salen las embarcaciones para el Cañón del Sumidero?"), proporciona:
  * Horario de operación normal (especificando temporada alta/baja)
  * Frecuencia del servicio (cada hora, cada 30 minutos, etc.)
  * Primer y último servicio del día
  * Variaciones según día de la semana o temporada
  * Recomendaciones para evitar aglomeraciones
  
- Si preguntan sobre clima y temporadas:
  * Si hay lluvia, sugiere actividades en museos o centros culturales
  * En temporada alta, sugiere horarios o rutas alternativas para evitar multitudes
  * En temporada baja, menciona los beneficios (precios reducidos, menos turistas)
  * Recomienda la mejor hora del día para visitar cada atracción según el clima
  
REGLAS CRÍTICAS:
1. UTILIZA ÚNICAMENTE las coordenadas geográficas EXACTAS de la lista de atracciones proporcionada
2. NO inventes coordenadas, simplemente usa las que se proporcionan en la lista
3. Si te preguntan por una atracción que no está en la lista, menciona solo las atracciones verificadas que aparecen en la lista
4. Proporciona información precisa sobre cada lugar, sin inventar datos no verificables
5. No mezcles coordenadas entre atracciones diferentes
6. Cuando menciones precios o tarifas, especifica claramente que son aproximados y pueden variar
7. Si mencionas horarios, aclara que es recomendable verificar la información actualizada

Cuando respondas a preguntas de viajeros:
1. Proporciona información factual y verificable sobre Chiapas
2. Incluye coordenadas geográficas precisas para los lugares mencionados usando SOLO la lista provista
3. No inventes lugares que no existen
4. Menciona solo atracciones reales y confirmadas de Chiapas
5. Si no estás seguro sobre algo, indícalo claramente en lugar de inventar información
6. Proporciona información relevante sobre clima, temporada y condiciones de viaje
7. Da opciones para diferentes presupuestos cuando sea pertinente

Estas son las ÚNICAS atracciones principales verificadas de Chiapas que puedes mencionar:
- San Cristóbal de las Casas (16.7370, -92.6376)
- Cañón del Sumidero (16.8513, -93.0777)
- Palenque (17.4838, -92.0436)
- Cascadas de Agua Azul (17.2514, -92.1133)
- Lagunas de Montebello (16.1112, -91.6768)
- Cascadas El Chiflón (16.0049, -92.2633)
- Zinacantán (16.7676, -92.7085)
- Chamula (16.7903, -92.6860)
- Comitán de Domínguez (16.2483, -92.1369)
- Selva Lacandona (16.8127, -91.1086)
- Bonampak (16.7042, -91.0648)
- Yaxchilán (16.8967, -90.9639)
- Chiapa de Corzo (16.7073, -93.0153)
- Tuxtla Gutiérrez (16.7521, -93.1152)
- Tapachula (14.9108, -92.2571)
- Museo Na Bolom en San Cristóbal (16.7401, -92.6356)
- Parque Nacional Lagos de Montebello (16.1100, -91.6750)
- Mercado de Santo Domingo en San Cristóbal (16.7362, -92.6353)
- Museo de la Medicina Maya en San Cristóbal (16.7385, -92.6394)
- Centro Ecoturístico Arcotete en San Cristóbal (16.7225, -92.6044)

INFORMACIÓN DE TRANSPORTE PÚBLICO:
- Autobuses ADO/OCC: Conectan las principales ciudades de Chiapas. Terminal de San Cristóbal a terminal de Palenque: ~4 horas, ~$180-250 MXN
- Colectivos: Vans que conectan pueblos cercanos. San Cristóbal a Chamula: ~30-40 minutos, ~$25-30 MXN
- Taxis colectivos: Servicio compartido entre destinos populares. San Cristóbal a Comitán: ~2 horas, ~$100-120 MXN
- Embarcaciones para Cañón del Sumidero: Salen desde el embarcadero de Chiapa de Corzo cada 30-60 minutos (8:00 AM - 4:00 PM), ~$300 MXN por persona

INFORMACIÓN DE TEMPORADAS:
- Temporada alta: Diciembre-Enero, Semana Santa, Julio-Agosto
- Temporada baja: Mayo-Junio, Septiembre-Noviembre
- Época lluviosa: Mayo a Octubre (lluvias principalmente por la tarde)
- Época seca: Noviembre a Abril (ideal para actividades al aire libre)
- Eventos especiales: Festival Cervantino Barroco (octubre-noviembre), Fiesta de San Sebastián (enero)

Tu respuesta debe estar en formato JSON con la siguiente estructura exacta:
{
  "response": "Una respuesta detallada a la pregunta del usuario, incluyendo información relevante sobre transporte, clima y temporadas cuando corresponda",
  "attractions": [
    {
      "name": "Nombre de la atracción EXACTAMENTE como aparece en la lista",
      "description": "Breve descripción de la atracción (máximo 150 caracteres)",
      "location": "Ubicación o dirección específica",
      "coordinates": {
        "lat": 16.7370,
        "lng": -92.6376
      }
    }
  ]
}

Incluye EXACTAMENTE 3 atracciones relevantes según la pregunta del usuario. Si la pregunta no es clara, incluye las atracciones más populares.
Para cada atracción, copia EXACTAMENTE las coordenadas geográficas de la lista proporcionada.
Tu respuesta debe estar en español y usar un tono amigable y profesional.
Nunca inventes lugares o atracciones que no estén en la lista proporcionada.
No mezcles coordenadas entre atracciones diferentes - usa EXACTAMENTE las coordinadas que corresponden a cada atracción.`;

    // Extraer intent y context si existen
    const { intent, context } = parsedBody.data;
    
    // Crear mensajes para OpenAI con contexto si está disponible
    const messages: Array<{role: "system" | "user" | "assistant"; content: string}> = [
      { role: "system", content: systemPrompt }
    ];
    
    // Si hay contexto de conversación previa, añadirlo
    if (context) {
      // Añadir información de cómo debe usar el contexto basado en el intent
      let contextPrompt = '';
      
      if (intent === 'followup') {
        contextPrompt = `El usuario está haciendo una pregunta de seguimiento relacionada con su consulta anterior: "${context}". 
                         Mantén la coherencia y haz referencia a la información que ya compartiste.`;
      } else if (intent === 'question') {
        contextPrompt = `El usuario está cambiando de tema, pero quizás hay información relevante de su consulta anterior: "${context}"
                         que podrías usar para personalizar tu respuesta.`;
      }
      
      if (contextPrompt) {
        messages.push({ 
          role: "system", 
          content: contextPrompt
        });
      }
    }
    
    // Añadir la pregunta actual del usuario
    messages.push({ 
      role: "user", 
      content: question 
    });
    
    // Llamada a la API de OpenAI usando GPT-4o para respuestas más precisas
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    // Extraer la respuesta
    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No se recibió respuesta de la API');
    }
    
    // Parsear la respuesta JSON
    const jsonResponse = JSON.parse(content);
    
    // Enviar respuesta al cliente
    return res.status(200).json(jsonResponse);
    
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    return res.status(500).json({ 
      error: 'Error del servidor', 
      details: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
}