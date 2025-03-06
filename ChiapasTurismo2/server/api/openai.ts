import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_development" 
});

export async function generateItinerary(
  experienceType: string, 
  duration: string, 
  destinations: string = "", 
  budget: string
): Promise<any> {
  try {
    const prompt = `
      Eres un experto en turismo en Chiapas, México. Genera un itinerario personalizado para un viaje con las siguientes características:
      
      - Tipo de experiencia: ${experienceType}
      - Duración: ${duration} días
      - Destinos específicos solicitados: ${destinations || "No especificados, sugiere los mejores"}
      - Presupuesto: ${budget}
      
      Por favor, estructura tu respuesta en formato JSON con la siguiente estructura:
      {
        "itinerary": {
          "title": "Título del itinerario",
          "seasonInfo": {
            "bestTime": "Mejor época para visitar",
            "currentSeason": "Información sobre la temporada actual",
            "weatherTips": "Consejos considerando el clima actual"
          },
          "days": [
            {
              "day": 1,
              "title": "Título del día 1",
              "description": "Descripción detallada de las actividades del día 1",
              "accommodation": {
                "name": "Nombre del alojamiento",
                "priceRange": "Rango de precios (MXN)",
                "type": "Tipo de alojamiento"
              },
              "meals": [
                {
                  "type": "Desayuno/Comida/Cena",
                  "recommendation": "Nombre del lugar recomendado",
                  "dish": "Platillo típico recomendado",
                  "priceRange": "Rango de precios (MXN)"
                }
              ],
              "transportation": {
                "type": "Tipo de transporte",
                "duration": "Duración aproximada",
                "cost": "Costo aproximado (MXN)"
              }
            }
            // Más días según la duración...
          ],
          "recommendations": [
            "Recomendación 1",
            "Recomendación 2",
            // Más recomendaciones...
          ],
          "hiddenGems": [
            "Lugar poco conocido 1 y por qué visitarlo",
            "Lugar poco conocido 2 y por qué visitarlo"
          ],
          "totalBudgetEstimate": {
            "accommodation": "Estimado total en alojamiento (MXN)",
            "food": "Estimado total en comida (MXN)",
            "transportation": "Estimado total en transporte (MXN)",
            "activities": "Estimado total en actividades (MXN)",
            "total": "Presupuesto total estimado (MXN)"
          }
        }
      }
      
      Incluye información real y precisa sobre los destinos de Chiapas, incorporando detalles sobre:
      - Duración recomendada para cada lugar (horas o días)
      - Costos aproximados de transporte y hospedaje en MXN
      - Lugares menos conocidos pero valiosos para visitar
      - Opciones de gastronomía local con precios orientativos
      - Mejor época para visitar cada destino
      - Consideraciones de clima y temporada para cada actividad
      - Si es temporada alta o baja, y cómo afecta a precios y experiencia
      - Si llueve o hay mal clima, incluir alternativas de actividades bajo techo
      
      El itinerario debe ser realista en términos de tiempos de desplazamiento y actividades posibles.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto en turismo en Chiapas, México, con amplio conocimiento sobre sus destinos, cultura, gastronomía y opciones de viaje."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No se pudo generar el itinerario");
    }

    return JSON.parse(content).itinerary;
  } catch (error) {
    console.error("Error en la llamada a OpenAI:", error);
    
    // Fallback para desarrollo o en caso de error
    return {
      title: "Aventura en Chiapas: 5 días inolvidables",
      days: [
        {
          day: 1,
          title: "Día 1: San Cristóbal de las Casas",
          description: "Llegada a Tuxtla Gutiérrez y traslado a San Cristóbal. Explora el centro histórico, visita el mercado de artesanías y disfruta de la gastronomía local en el restaurante El Fogón de Jovel. Alojamiento en Hotel Bo o Posada del Abuelito (opción económica)."
        },
        {
          day: 2,
          title: "Día 2: Cañón del Sumidero",
          description: "Excursión al impresionante Cañón del Sumidero. Paseo en lancha para admirar las formaciones rocosas y la fauna local. Visita a Chiapa de Corzo para almorzar y conocer su plaza central con la fuente mudéjar. Regreso a San Cristóbal."
        },
        {
          day: 3,
          title: "Día 3: Comunidades indígenas",
          description: "Visita a las comunidades indígenas de San Juan Chamula y Zinacantán. Conoce sus templos, tradiciones y artesanías textiles. Por la tarde, taller de chocolate artesanal en San Cristóbal."
        },
        {
          day: 4,
          title: "Día 4: Cascadas de Agua Azul y Misol-Ha",
          description: "Salida temprano hacia las cascadas de Agua Azul. Tiempo para nadar y disfrutar del entorno natural. Continuación a la cascada de Misol-Ha. Traslado a Palenque para pernoctar."
        },
        {
          day: 5,
          title: "Día 5: Zona Arqueológica de Palenque",
          description: "Exploración completa de la zona arqueológica de Palenque, uno de los sitios mayas más impresionantes. Visita al museo de sitio. Regreso a Tuxtla Gutiérrez para vuelo de salida o continuación del viaje."
        }
      ],
      recommendations: [
        "Lleva ropa ligera pero incluye un suéter para las noches frescas en San Cristóbal",
        "No olvides repelente de insectos y protector solar",
        "Contrata guías locales para una experiencia más enriquecedora",
        "Reserva con anticipación en temporada alta (diciembre-enero y Semana Santa)"
      ]
    };
  }
}
