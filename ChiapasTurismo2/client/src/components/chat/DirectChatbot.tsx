import React, { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User, MapPin, Send, RefreshCcw, X } from 'lucide-react';

// Tipos de datos
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

interface DirectChatbotProps {
  initialQuery?: string;
}

export function DirectChatbot({ initialQuery = '' }: DirectChatbotProps) {
  // Estado para los mensajes y la entrada
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referencia para scrollear al último mensaje
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Toast para notificaciones
  const { toast } = useToast();

  // Ejemplos de preguntas rápidas
  const quickQuestions = [
    "¿Qué lugares visitar en San Cristóbal?",
    "Mejores restaurantes en Tuxtla",
    "¿Cómo llegar a las Cascadas de Agua Azul?",
    "¿Cuándo visitar Palenque?",
    "Comida típica de Chiapas",
    "Hoteles con alberca en San Cristóbal"
  ];

  // Generar ID único para mensajes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Formatear hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Inicializar con mensaje de bienvenida o procesar consulta inicial
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      content: "✨ ¡Bienvenido a MayaGuía! ✨\n\nSoy tu asistente virtual para descubrir la magia de Chiapas. Estoy aquí para ayudarte con información actualizada sobre:\n\n• 🏞️ Destinos ancestrales y paisajes naturales\n• 🌮 Delicias de la gastronomía chiapaneca\n• 🚌 Cómo moverte entre destinos turísticos\n• 🎭 Tradiciones mayas y cultura local\n• 🏨 Experiencias únicas y alojamientos\n\n¿Qué te gustaría explorar de la tierra maya hoy?",
      sender: 'bot',
      timestamp: new Date()
    };
    
    // Si hay una consulta inicial, la procesamos después del mensaje de bienvenida
    if (initialQuery && initialQuery.trim()) {
      setMessages([welcomeMessage]);
      
      // Pequeño retraso para que primero aparezca el mensaje de bienvenida
      setTimeout(() => {
        setInputText(initialQuery);
        handleSendMessage(initialQuery);
      }, 300);
    } else {
      // Solo mostrar el mensaje de bienvenida si no hay consulta inicial
      setMessages([welcomeMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scrollear automáticamente a los nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para scrollear al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enviar mensaje
  const handleSendMessage = async (text?: string) => {
    // Usar el texto proporcionado o el del input
    const messageText = text || inputText;
    
    // Validar que no esté vacío
    if (!messageText.trim()) return;
    
    // Crear el mensaje del usuario
    const userMessage: Message = {
      id: generateId(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Actualizar estado con el mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener el historial de mensajes para mantener contexto
      const history = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .slice(-8) // Limitamos a los últimos 8 mensajes para ahorrar tokens
        .map(msg => ({
          content: msg.content,
          role: msg.sender === 'user' ? 'user' : 'assistant'
        }));
      
      // Llamar a la API
      const response = await apiRequest<{response: string; attractions: Attraction[]}>('/api/simple-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history
        })
      });
      
      // Crear el mensaje de respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date(),
        attractions: response.attractions
      };
      
      // Actualizar estado con la respuesta
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      
      // Mostrar error en la interfaz
      setError('Hubo un problema al conectar con el servicio. Por favor, intenta nuevamente.');
      
      // Notificar con toast
      toast({
        title: 'Error de conexión',
        description: 'No pudimos procesar tu mensaje. Verifica tu conexión a internet.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar la conversación
  const handleClearChat = () => {
    // Mantener solo el mensaje de bienvenida
    const welcomeMessage: Message = {
      id: generateId(),
      content: "✨ ¡Bienvenido a MayaGuía! ✨\n\nSoy tu asistente virtual para descubrir la magia de Chiapas. Estoy aquí para ayudarte con información actualizada sobre:\n\n• 🏞️ Destinos ancestrales y paisajes naturales\n• 🌮 Delicias de la gastronomía chiapaneca\n• 🚌 Cómo moverte entre destinos turísticos\n• 🎭 Tradiciones mayas y cultura local\n• 🏨 Experiencias únicas y alojamientos\n\n¿Qué te gustaría explorar de la tierra maya hoy?",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setError(null);
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Card className="flex flex-col h-[650px] shadow-xl border-0 rounded-xl overflow-hidden bg-gray-900">
      {/* Encabezado del chat */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 p-4 flex items-center justify-between text-white border-b border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 h-12 w-12 rounded-full flex items-center justify-center border-2 border-amber-500/50">
            <span className="text-amber-400 text-xl font-bold">M</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300">MayaGuía</h3>
            <p className="text-xs text-emerald-300">Descubre la magia de Chiapas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleClearChat} 
            size="sm" 
            variant="ghost" 
            className="text-amber-300 hover:bg-emerald-800/50 border border-amber-500/30"
          >
            <RefreshCcw size={18} />
            <span className="ml-1 text-xs">Nueva Conversación</span>
          </Button>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-800 relative" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="h-8 w-8 mr-2 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-600">
                <Bot className="h-5 w-5 text-amber-300" />
              </div>
            )}
            
            <div 
              className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                message.sender === 'user' 
                  ? 'bg-gray-700 text-gray-100 rounded-tr-sm border border-gray-600' 
                  : 'bg-gray-900/70 text-gray-100 rounded-tl-sm border border-emerald-800'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              
              {/* Si hay atracciones, mostrar mapa */}
              {message.attractions && message.attractions.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={14} className="text-amber-400" />
                    <span className="text-xs font-medium text-amber-300">
                      Ubicaciones mencionadas:
                    </span>
                  </div>
                  
                  <div className="mb-2 flex flex-wrap gap-1">
                    {message.attractions.map((attraction, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-gray-700 text-gray-300 border-emerald-800/50"
                      >
                        {attraction.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="h-[200px] rounded-md overflow-hidden border">
                    <GoogleMap 
                      lat={message.attractions[0].coordinates.lat}
                      lng={message.attractions[0].coordinates.lng}
                      zoom={12}
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
              
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formatTime(message.timestamp)}
              </div>
            </div>
            
            {message.sender === 'user' && (
              <div className="h-8 w-8 ml-2 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-400">
                <User className="h-5 w-5 text-gray-900" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="h-8 w-8 mr-2 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-600">
              <Bot className="h-5 w-5 text-amber-300" />
            </div>
            <div className="bg-gray-900/70 rounded-2xl rounded-tl-sm p-3 max-w-xs border border-emerald-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce delay-200"></div>
                <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4 text-sm text-red-300 flex items-center">
            <X className="h-4 w-4 mr-2 text-red-400" />
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias rápidas */}
      {messages.length < 3 && (
        <div className="bg-gray-900 p-3 border-t border-gray-700">
          <p className="text-xs text-gray-300 mb-2">Prueba estas preguntas:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className="cursor-pointer bg-gray-800 text-gray-300 border-emerald-800/50 hover:bg-emerald-900/30 hover:text-amber-300 transition-colors"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Área de entrada */}
      <form onSubmit={handleSubmit} className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre Chiapas..."
            className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-amber-500"
            disabled={isLoading}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputText.trim()} 
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium"
          >
            <Send className="h-4 w-4 mr-1" />
            <span>Enviar</span>
          </Button>
        </div>
        <div className="mt-1 text-center">
          <p className="text-xs text-gray-500">
            Usando GPT-4o-mini • Información actualizada sobre Chiapas
          </p>
        </div>
      </form>
    </Card>
  );
}