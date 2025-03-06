import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MapPin, User, Bot, SmilePlus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { GoogleMap } from '@/components/maps/GoogleMap';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attractions?: Array<{
    name: string;
    description: string;
    location: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
}

export function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! 👋 Soy tu asistente virtual de turismo en Chiapas. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre lugares para visitar, gastronomía local, actividades culturales o cualquier otra información turística. 🌴✨',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Función para generar un ID único
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Cerrar el selector de emojis al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await apiRequest('/api/tour-guide', {
        method: 'POST',
        body: JSON.stringify({ question: inputValue })
      });
      
      // Extraer emojis del texto basado en el contenido
      let enrichedContent = response.response;
      
      // Añadir emojis basados en palabras clave en el texto
      const emojiMap: {[key: string]: string} = {
        'playa': '🏖️',
        'mar': '🌊',
        'cascada': '💦',
        'cascadas': '💦',
        'selva': '🌴',
        'bosque': '🌲',
        'montaña': '⛰️',
        'montañas': '🏔️',
        'lago': '🏞️',
        'lagos': '🏞️',
        'ciudad': '🏙️',
        'pueblo': '🏘️',
        'comida': '🍽️',
        'gastronomía': '🍲',
        'cultura': '🎭',
        'artesanía': '🧶',
        'artesanías': '🎨',
        'museo': '🏛️',
        'museos': '🏛️',
        'arqueología': '🏺',
        'ruinas': '🏛️',
        'hotel': '🏨',
        'hospedaje': '🛌',
        'restaurante': '🍴',
        'restaurantes': '🍴',
        'café': '☕',
        'bar': '🍹',
        'iglesia': '⛪',
        'catedral': '⛪',
        'mercado': '🛍️',
        'compras': '🛒',
        'aventura': '🧗‍♂️',
        'excursión': '🚶‍♂️',
        'excursiones': '🧭',
        'tour': '🚌',
        'tours': '🚐',
        'naturaleza': '🌿',
        'fauna': '🦜',
        'flora': '🌺',
        'festival': '🎊',
        'fiesta': '🎉',
        'fiestas': '💃',
        'tradición': '👘',
        'tradiciones': '👘',
        'clima': '🌤️',
        'lluvia': '🌧️',
        'sol': '☀️',
        'calor': '🔥',
        'frío': '❄️',
        'transporte': '🚌',
        'autobús': '🚍',
        'taxi': '🚕',
        'avión': '✈️',
        'seguridad': '🔒',
        'salud': '🏥',
        'hospital': '🏥',
        'farmacia': '💊',
        'información': 'ℹ️',
        'ayuda': '🆘',
        'guía': '📋',
        'mapa': '🗺️',
        'recomendación': '👍',
        'recomendaciones': '👍',
        'sugerencia': '💡',
        'sugerencias': '💡',
        'consejo': '📝',
        'consejos': '📝',
        'baño': '🚻',
        'agua': '💧',
        'fotografía': '📸',
        'fotos': '📷',
        'palenque': '🏯',
        'chiapas': '🌵',
        'mexicano': '🇲🇽',
        'mexico': '🇲🇽',
        'gracias': '🙏',
        'buenos días': '🌞',
        'buenas tardes': '🌆',
        'buenas noches': '🌙',
        'hola': '👋',
        'adiós': '👋',
        'hasta luego': '👋'
      };
      
      // Añadir emojis aleatoriamente en el texto
      Object.entries(emojiMap).forEach(([keyword, emoji]) => {
        // Usando expresión regular para encontrar la palabra completa y no parte de otra palabra
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(enrichedContent)) {
          // Solo reemplazar la primera ocurrencia
          enrichedContent = enrichedContent.replace(
            regex, 
            function(match: string): string { 
              return `${match} ${emoji}`; 
            }
          );
        }
      });
      
      // Añadir mensaje del bot
      const botMessage: Message = {
        id: generateId(),
        content: enrichedContent,
        sender: 'bot',
        timestamp: new Date(),
        attractions: response.attractions
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en chatbot:', error);
      toast({
        title: "Error",
        description: "No pudimos procesar tu consulta. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      
      // Mensaje de error genérico
      const errorMessage: Message = {
        id: generateId(),
        content: "Lo siento, estoy experimentando algunos problemas técnicos en este momento. ¿Podrías intentar de nuevo con tu pregunta? 🙏",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  const getRandomGreeting = () => {
    const greetings = [
      "¡Hola! ¿En qué puedo ayudarte hoy? 😊",
      "¿Qué lugares de Chiapas te gustaría conocer? 🌄",
      "¿Planeas un viaje a Chiapas? Pregúntame lo que necesites 🧳",
      "¿Buscas recomendaciones para tu visita a Chiapas? 🗺️",
      "¿Te gustaría saber sobre la cultura de Chiapas? 🎭"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-chiapas-gold/20">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-chiapas-green to-chiapas-green/80 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-2" />
          <div>
            <h3 className="font-bold">ChiapasBot</h3>
            <p className="text-xs text-white/80">Tu guía de viaje personal</p>
          </div>
        </div>
        <div className="bg-white/20 px-2 py-1 rounded text-xs">
          En línea 🟢
        </div>
      </div>
      
      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-xl p-3",
                message.sender === 'user' 
                  ? "bg-chiapas-green text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}>
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <>
                      <span className="text-xs font-medium text-white/90">Tú</span>
                      <User className="h-3 w-3 ml-1 text-white/80" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3 mr-1 text-chiapas-dark/80" />
                      <span className="text-xs font-medium text-chiapas-dark/90">ChiapasBot</span>
                    </>
                  )}
                </div>
                
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Atracciones recomendadas */}
                {message.attractions && message.attractions.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.attractions.map((attraction, index) => (
                      <Card key={index} className="p-3 bg-white border border-chiapas-gold/20 shadow-sm">
                        <h4 className="font-bold text-sm flex items-center text-chiapas-dark">
                          <MapPin className="h-3 w-3 mr-1 text-chiapas-red" />
                          {attraction.name}
                        </h4>
                        <p className="text-xs mt-1 text-gray-700">{attraction.description}</p>
                        
                        {attraction.coordinates && (
                          <div className="mt-2 rounded overflow-hidden border border-gray-100">
                            <GoogleMap 
                              lat={attraction.coordinates.lat} 
                              lng={attraction.coordinates.lng}
                              zoom={13}
                              title={attraction.name}
                              height="120px"
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] block mt-1 opacity-70">
                  {new Intl.DateTimeFormat('es', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-chiapas-green" />
                  <span className="text-sm text-gray-600">Escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Área de sugerencias */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-chiapas-gold/30 text-chiapas-dark"
              onClick={() => setInputValue("¿Qué lugares puedo visitar en San Cristóbal de las Casas?")}
            >
              Lugares en San Cristóbal 🏙️
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-chiapas-gold/30 text-chiapas-dark"
              onClick={() => setInputValue("¿Dónde puedo probar comida típica de Chiapas?")}
            >
              Comida típica 🍽️
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-chiapas-gold/30 text-chiapas-dark"
              onClick={() => setInputValue("¿Cuáles son las mejores cascadas en Chiapas?")}
            >
              Cascadas 💦
            </Button>
          </div>
        </div>
      )}
      
      {/* Área de entrada */}
      <div className="p-3 border-t border-gray-200">
        <div className="relative flex items-center">
          <div className="relative emoji-picker-container">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <SmilePlus className="h-5 w-5 text-chiapas-dark/70" />
            </Button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-10">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick} 
                  searchPlaceHolder="Buscar emoji..."
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          
          <Input
            className="flex-1 bg-gray-50"
            placeholder={getRandomGreeting()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          
          <Button 
            type="button" 
            size="icon" 
            className="ml-2 bg-chiapas-gold hover:bg-chiapas-gold/90 text-chiapas-dark"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}