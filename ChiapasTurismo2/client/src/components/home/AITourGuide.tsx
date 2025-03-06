import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot } from 'lucide-react';
import { DirectChatbot } from '@/components/chat/DirectChatbot';

// Preguntas de ejemplo para mostrar al usuario
const sampleQuestions = [
  "¿Cuáles son los mejores lugares para visitar en San Cristóbal?",
  "¿Cómo llegar a San Cristóbal desde Oaxaca?",
  "¿Dónde experimentar la cultura indígena?",
  "¿Qué transportes hay de CDMX a San Cristóbal?"
];

export function AITourGuide() {
  const [initialQuery, setInitialQuery] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Manejar la selección de una pregunta predefinida
  const handleSampleQuestionSelection = (question: string) => {
    setInitialQuery(question);
    setShowChat(true);
    
    // Dar un poco de tiempo para que se monte el chat y luego hacer scroll
    setTimeout(() => {
      document.getElementById('chiapasbot-chat')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <section 
      id="chiapasbot" 
      className="relative z-10 py-10 px-4 md:px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl shadow-2xl border border-emerald-900/50"
      itemScope 
      itemType="https://schema.org/WebApplication"
      aria-label="MayaGuía - Asistente virtual de turismo para Chiapas"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="bg-emerald-700 h-10 w-10 rounded-full flex items-center justify-center border-2 border-amber-500/50">
              <span className="text-amber-400 text-xl font-bold">M</span>
            </div>
            <h2 
              className="text-3xl font-display font-bold text-amber-300"
              itemProp="name"
            >
              MayaGuía
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 to-emerald-500/80 mx-auto mb-3"></div>
          <p className="text-sm text-emerald-300 max-w-xl mx-auto">
            Tu asistente virtual para descubrir la magia de Chiapas
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-emerald-800/50">
          {/* Header decorativo */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-500/70"></div>
          
          {/* Metadatos SEO ocultos */}
          <meta itemProp="description" content="MayaGuía - Descubre la tierra maya con nuestro asistente virtual para Chiapas. Información sobre destinos ancestrales, gastronomía tradicional, cultura indígena y más." />
          <meta itemProp="applicationCategory" content="TravelGuide" />
          <meta itemProp="operatingSystem" content="Web" />
          <meta itemProp="keywords" content="Chiapas, maya, turismo, viajes, San Cristóbal, Palenque, guía virtual, asistente IA, GPT-4o, tierra maya" />
          
          <div className="p-4">
            {/* Área principal */}
            <div className="flex flex-col items-center">
              {!showChat ? (
                <div className="space-y-5 w-full">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center border border-emerald-600">
                      <Bot className="h-6 w-6 text-amber-300" />
                    </div>
                    <p className="text-base font-medium text-gray-200">¿Qué deseas descubrir sobre Chiapas?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sampleQuestions.map((q, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleSampleQuestionSelection(q)}
                        className="text-sm p-3 bg-gray-800 hover:bg-emerald-900/30
                        border border-gray-700 hover:border-amber-500/30 text-gray-300 rounded-lg
                        transition-all duration-200 font-medium shadow-md hover:shadow-amber-500/5 text-left flex items-start gap-2"
                      >
                        <MessageSquare className="h-4 w-4 mt-0.5 text-amber-400 flex-shrink-0" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => {
                        setShowChat(true);
                        // Dar un poco de tiempo para que se monte el chat y luego hacer scroll
                        setTimeout(() => {
                          document.getElementById('chiapasbot-chat')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }, 100);
                      }} 
                      variant="default" 
                      size="lg" 
                      className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Hacer mi propia pregunta
                    </Button>
                  </div>
                  
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      Usando GPT-4o-mini • Información actualizada sobre Chiapas
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div id="chiapasbot-chat" className="relative z-10">
                    <DirectChatbot initialQuery={initialQuery} />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => {
                        setShowChat(false);
                        setInitialQuery('');
                        // Scrollear al inicio de la sección después de volver
                        document.getElementById('chiapasbot')?.scrollIntoView({ behavior: 'smooth' });
                      }} 
                      variant="outline" 
                      size="sm"
                      className="text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:bg-emerald-900/30 bg-gray-800"
                    >
                      Volver a sugerencias
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}