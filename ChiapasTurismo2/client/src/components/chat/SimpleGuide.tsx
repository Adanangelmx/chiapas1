import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attraction {
  name: string;
  description: string;
  location?: string;
}

interface SimpleGuideProps {
  initialQuery?: string;
}

export function SimpleGuide({ initialQuery = '' }: SimpleGuideProps) {
  const [question, setQuestion] = useState(initialQuery);
  const [response, setResponse] = useState<{
    text: string;
    attractions: Attraction[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const suggestions = [
    '¿Cuáles son los mejores lugares para visitar en San Cristóbal de las Casas?',
    '¿Qué actividades puedo hacer en la Selva Lacandona?',
    '¿Dónde puedo experimentar la cultura indígena en Chiapas?',
    '¿Cuál es la mejor época para visitar las cascadas de Agua Azul?'
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tour-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question: question,
          intent: 'question'
        })
      });
      
      if (!response.ok) {
        throw new Error('Error en la consulta');
      }
      
      const data = await response.json();
      
      setResponse({
        text: data.response,
        attractions: data.attractions || []
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No pudimos procesar tu consulta. Por favor intenta de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {/* Panel izquierdo - Preguntas */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-2">Pregunta lo que quieras saber</h2>
        <p className="text-xs text-gray-600 mb-3">
          Escribe tu pregunta sobre destinos, cultura, gastronomía o cualquier aspecto de tu viaje a Chiapas.
        </p>
        
        <Textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ejemplo: ¿Qué lugares puedo visitar en 3 días en Chiapas?"
          className="min-h-[100px] mb-3 border-gray-300 text-sm"
        />
        
        <Button 
          onClick={handleAskQuestion}
          disabled={isLoading || !question.trim()}
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 mb-3 flex items-center justify-center gap-2 py-2 h-auto"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Preguntar al guía</span>
        </Button>
        
        <div className="mt-3">
          <h3 className="text-xs font-medium mb-2">Sugerencias de preguntas:</h3>
          <ul className="space-y-1.5">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs">
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-blue-600 hover:text-blue-800 hover:underline w-full truncate"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Panel derecho - Respuestas */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-3" />
            <p className="text-gray-600 text-sm">Consultando información...</p>
          </div>
        ) : response ? (
          <div>
            <h2 className="text-lg font-bold text-amber-700 mb-3">Recomendaciones personalizadas</h2>
            
            <div className="prose prose-sm max-w-none mb-5 text-sm">
              <div dangerouslySetInnerHTML={{ __html: response.text.replace(/\n/g, '<br/>') }} />
            </div>
            
            {response.attractions && response.attractions.length > 0 && (
              <>
                <h3 className="text-md font-bold text-amber-700 mb-2">Atracciones recomendadas</h3>
                <div className="space-y-3">
                  {response.attractions.map((attraction, index) => (
                    <div key={index} className="border-l-2 border-amber-500 pl-3 py-1">
                      <h4 className="font-medium text-sm">{attraction.name}</h4>
                      <p className="text-xs text-gray-600">{attraction.description}</p>
                      {attraction.location && (
                        <p className="text-xs text-gray-500 mt-0.5">📍 {attraction.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-md font-medium mb-2">Tu asistente virtual está listo</h3>
            <p className="text-center text-gray-600 text-sm mb-3">
              Haz una pregunta sobre tu viaje a Chiapas y nuestro guía con IA te dará recomendaciones personalizadas basadas en tus intereses.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {['Atracciones turísticas', 'Gastronomía local', 'Transporte', 'Cultura', 'Hospedaje'].map((cat, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}