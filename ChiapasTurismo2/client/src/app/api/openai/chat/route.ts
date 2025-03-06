import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `Eres un asistente virtual especializado en turismo de Chiapas, México. 
Tu objetivo es proporcionar información precisa, útil y relevante sobre:

- Destinos turísticos y atracciones
- Gastronomía local y restaurantes
- Alojamiento y opciones de hospedaje
- Transporte y cómo moverse
- Cultura, tradiciones y artesanías
- Consejos prácticos para viajeros

Responde de manera amigable y conversacional, pero mantén un tono profesional.
Incluye detalles específicos, precios aproximados cuando sea relevante, y recomendaciones basadas en diferentes presupuestos.
Si no estás seguro de algún detalle específico, indícalo claramente.
Usa emojis ocasionalmente para hacer las respuestas más atractivas visualmente.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg: any) => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Error procesando tu pregunta' },
      { status: 500 }
    );
  }
} 