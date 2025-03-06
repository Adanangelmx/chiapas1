import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Interfaces para tipar los datos
interface Attraction {
  name: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attractions?: Attraction[];
}

interface NewChatbotProps {
  initialQuery?: string;
}

export function NewChatbot({ initialQuery = '' }: NewChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Inicializar con un mensaje de bienvenida
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      content: '¡Hola! Soy tu guía virtual de Chiapas. Puedo ayudarte con información sobre destinos turísticos, gastronomía, cultura, alojamiento y más. ¿Qué te gustaría saber?',
      sender: 'bot',
      timestamp: new Date(),
      attractions: []
    };
    setMessages([welcomeMessage]);
  }, []);

  // Si hay una consulta inicial, enviarla automáticamente
  useEffect(() => {
    if (initialQuery) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para generar IDs únicos
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Scroll al final de la conversación
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatear la hora del mensaje
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Función para manejar el envío de mensajes
  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Mensaje del usuario
    const userMessage: Message = {
      id: generateId(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Obtener historial de mensajes para contexto (limitado a últimos 10)
      const history = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .slice(-10)
        .map(msg => ({
          content: msg.content,
          role: msg.sender === 'user' ? 'user' : 'assistant'
        }));
      
      // Llamada a la API
      const response = await apiRequest<{response: string; attractions: Attraction[]}>('/api/simple-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history
        })
      });
      
      // Mensaje del bot
      const botMessage: Message = {
        id: generateId(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date(),
        attractions: response.attractions
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mensaje de error
      const errorMessage: Message = {
        id: generateId(),
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'No se pudo procesar tu mensaje. Intenta nuevamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Sugerencias rápidas para el usuario
  const quickSuggestions = [
    "¿Qué lugares visitar en San Cristóbal?",
    "¿Cómo llegar a las Cascadas de Agua Azul?",
    "¿Qué comer en Chiapas?",
    "¿Cuándo es mejor visitar Palenque?",
    "Mejores hoteles en Tuxtla"
  ];
  
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md overflow-hidden border">
      {/* Encabezado del chat */}
      <div className="p-4 bg-green-700 text-white flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-white">
          <span className="text-green-700 text-xl font-bold">C</span>
        </Avatar>
        <div>
          <h3 className="font-medium">Guía Virtual de Chiapas</h3>
          <p className="text-xs opacity-90">Información turística confiable y actualizada</p>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-green-100 text-green-900' 
                  : 'bg-white border shadow-sm'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2 bg-green-700">
                    <span className="text-white text-xs">C</span>
                  </Avatar>
                  <span className="text-xs font-medium">Guía Chiapas</span>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
                </div>
              )}
              
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
              
              {/* Si hay atracciones, mostrar un mapa */}
              {message.attractions && message.attractions.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-green-700" />
                    <span className="text-sm font-medium">Ubicaciones mencionadas:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {message.attractions.map((attraction, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50">
                        {attraction.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="h-48 rounded-md overflow-hidden mt-2 border">
                    <GoogleMap 
                      lat={message.attractions[0].coordinates.lat}
                      lng={message.attractions[0].coordinates.lng}
                      zoom={11}
                      height="100%"
                      showMultipleLocations
                      locations={message.attractions.map((attraction, index) => ({
                        id: index.toString(),
                        name: attraction.name,
                        lat: attraction.coordinates.lat,
                        lng: attraction.coordinates.lng,
                        description: attraction.description,
                        category: 'cultural'
                      }))}
                    />
                  </div>
                </div>
              )}
              
              {message.sender === 'user' && (
                <div className="text-xs text-gray-500 text-right mt-1">
                  {formatTime(message.timestamp)}
                </div>
              )}
              
              {/* Feedback buttons (solo para mensajes del bot) */}
              {message.sender === 'bot' && (
                <div className="flex justify-end mt-2 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full"
                    title="Respuesta útil"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full"
                    title="Respuesta no útil"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border rounded-lg p-4 max-w-[80%] flex items-center shadow-sm">
              <Loader2 className="h-5 w-5 text-green-700 animate-spin mr-2" />
              <span className="text-sm">Consultando información...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias rápidas (solo mostrar si no hay mensajes del usuario) */}
      {messages.filter(m => m.sender === 'user').length === 0 && (
        <div className="p-3 bg-white border-t">
          <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => {
                  setInput(suggestion);
                  handleSubmit();
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Área de entrada de texto */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre Chiapas..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            size="icon"
            className="bg-green-700 hover:bg-green-800"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}