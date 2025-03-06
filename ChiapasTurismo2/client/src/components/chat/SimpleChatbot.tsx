import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, User, MapPin, Calendar, Download, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Interfaces
interface Attraction {
  name: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Day {
  day: number;
  title: string;
  description: string;
  accommodation?: {
    name: string;
    priceRange: string;
    type: string;
  };
  meals?: Array<{
    type: string;
    recommendation: string;
    dish: string;
    priceRange: string;
  }>;
  transportation?: {
    type: string;
    duration: string;
    cost: string;
  };
}

interface Itinerary {
  title: string;
  seasonInfo?: {
    bestTime: string;
    currentSeason: string;
    weatherTips: string;
  };
  days: Day[];
  recommendations: string[];
  hiddenGems?: string[];
  totalBudgetEstimate?: {
    accommodation: string;
    food: string;
    transportation: string;
    activities: string;
    total: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  messageType?: 'chat' | 'itinerary';
  attractions?: Attraction[];
  itinerary?: Itinerary;
  suggestions?: string[];
}

interface SimpleChatbotProps {
  initialQuery?: string;
}

export function SimpleChatbot({ initialQuery }: SimpleChatbotProps = {}) {
  // Estado básico
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '✨ ¡Bienvenido a MayaGuía! ✨\n\nSoy tu asistente virtual para descubrir la magia de Chiapas. ¿Qué te gustaría saber o planificar hoy?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        '¿Qué lugares ancestrales visitar?',
        'Planificar itinerario de 5 días',
        'Gastronomía típica de Chiapas',
        'Recorrido por San Cristóbal'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Estado para el formulario de itinerario simplificado
  const [formData, setFormData] = useState({
    experienceType: 'aventura',
    duration: '4-7',
    destinations: '',
    budget: 'moderado'
  });
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Procesar consulta inicial si existe
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);
  
  // Generar ID único
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Detectar intención (simplificado)
  const detectIntent = (message: string): 'itinerary' | 'question' => {
    const itineraryKeywords = [
      'itinerario', 'planear', 'planifica', 'viaje', 'días', 'visitar'
    ];
    
    const lowercaseMsg = message.toLowerCase();
    
    // Verificar si es una solicitud de itinerario
    const hasItineraryKeyword = itineraryKeywords.some(keyword => lowercaseMsg.includes(keyword));
    const hasDaysPattern = /\d+\s+d[ií]as/i.test(lowercaseMsg);
    
    if (hasItineraryKeyword && hasDaysPattern) {
      return 'itinerary';
    }
    
    // Si no es un itinerario, es una pregunta general
    return 'question';
  };
  
  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };
  
  // Manejar cambio en formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar envío de mensaje
  const handleSendMessage = async (overrideMessage?: string) => {
    const messageContent = overrideMessage || inputValue;
    
    if (!messageContent.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: generateId(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Determinar la intención del mensaje
      const intent = detectIntent(messageContent);
      
      // Si estamos en el formulario y el usuario está listo para generar
      if (showItineraryForm && messageContent.toLowerCase().includes('generar')) {
        await generateItinerary();
        return;
      }
      
      // Si es una solicitud de itinerario y no estamos mostrando el formulario
      if (intent === 'itinerary' && !showItineraryForm) {
        // Extraer información útil del mensaje para pre-llenar el formulario
        const durationMatch = messageContent.match(/(\d+)\s+d[ií]as/i);
        if (durationMatch) {
          const days = parseInt(durationMatch[1]);
          if (days <= 3) setFormData(prev => ({ ...prev, duration: '1-3' }));
          else if (days <= 7) setFormData(prev => ({ ...prev, duration: '4-7' }));
          else setFormData(prev => ({ ...prev, duration: '8+' }));
        }
        
        // Detectar tipo de experiencia simplificado
        if (messageContent.toLowerCase().includes('cultural') || 
            messageContent.toLowerCase().includes('historia')) {
          setFormData(prev => ({ ...prev, experienceType: 'cultural' }));
        }
        
        // Mostrar formulario simplificado
        setShowItineraryForm(true);
        
        // Mensaje de seguimiento
        const followupMessage: Message = {
          id: generateId(),
          content: 'Perfecto. Vamos a crear tu itinerario personalizado. Por favor completa estos datos:',
          sender: 'bot',
          timestamp: new Date(),
          messageType: 'chat'
        };
        
        setMessages(prev => [...prev, followupMessage]);
        setIsLoading(false);
      } else {
        // Consulta normal al chatbot
        const response = await fetch('/api/tour-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            question: messageContent,
            intent: intent,
            context: messages.length > 1 ? messages[messages.length - 2].content : null
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Añadir mensaje del bot
        const botMessage: Message = {
          id: generateId(),
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
          messageType: 'chat',
          attractions: data.attractions,
          suggestions: [
            '¿Qué más hay cerca?',
            '¿Cuánto cuesta?',
            '¿Cómo llego?',
            '¿Dónde hospedarme?'
          ]
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No pudimos procesar tu consulta. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      
      // Mensaje de error
      const errorMessage: Message = {
        id: generateId(),
        content: "Lo siento, estoy experimentando algunos problemas técnicos. ¿Podrías intentar de nuevo? 🙏",
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'chat'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generar itinerario
  const generateItinerary = async () => {
    try {
      setIsLoading(true);
      setShowItineraryForm(false);
      
      // Mensaje de transición
      const processingMessage: Message = {
        id: generateId(),
        content: "Diseñando tu itinerario personalizado. Esto tomará un momento...",
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'chat'
      };
      
      setMessages(prev => [...prev, processingMessage]);
      
      // Llamada a la API
      const response = await fetch('/api/openai/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mensaje con el itinerario generado
      const itineraryMessage: Message = {
        id: generateId(),
        content: `¡Aquí está tu itinerario personalizado! "${data.itinerary.title}"`,
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'itinerary',
        itinerary: data.itinerary,
        suggestions: [
          '¿Puedes modificar este itinerario?',
          '¿Qué lugares son imperdibles?',
          'Descarga mi itinerario'
        ]
      };
      
      setMessages(prev => [...prev, itineraryMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No pudimos generar el itinerario. Intenta nuevamente por favor.',
        variant: 'destructive'
      });
      
      // Mensaje de error
      const errorMessage: Message = {
        id: generateId(),
        content: "Lo siento, tuve problemas generando tu itinerario. Por favor intenta nuevamente.",
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'chat'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formatear hora para mostrar en los mensajes
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Descargar itinerario en PDF
  const downloadItinerary = (format = 'pdf', itinerary: Itinerary) => {
    if (!itinerary) return;
    
    if (format === 'pdf' && itineraryRef.current) {
      html2canvas(itineraryRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4'
        });
        
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Si el contenido es más largo que una página
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('Itinerario-Chiapas.pdf');
      });
    }
  };
  
  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim() !== '') {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-[600px] flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Encabezado de MayaGuía */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          <h3 className="font-medium text-sm">MayaGuía</h3>
        </div>
        <div className="bg-white/20 px-2 py-1 rounded-full text-xs">
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
                "max-w-[85%] rounded-lg p-3",
                message.sender === 'user' 
                  ? "bg-amber-600 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}>
                {/* Cabecera del mensaje */}
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <span className="text-xs font-medium text-white/90">Tú</span>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-gray-700">Asistente</span>
                      <span className="text-[10px] ml-1 text-gray-500">{formatTime(message.timestamp)}</span>
                    </>
                  )}
                </div>
                
                {/* Contenido del mensaje */}
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Itinerario */}
                {message.messageType === 'itinerary' && message.itinerary && (
                  <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm" ref={itineraryRef}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-chiapas-dark flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-chiapas-green" />
                        {message.itinerary.title}
                      </h4>
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => downloadItinerary('pdf', message.itinerary!)}
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    
                    {/* Vista compacta del itinerario */}
                    <div className="max-h-52 overflow-y-auto text-sm pr-1">
                      {message.itinerary.days.map((day, index) => (
                        <div key={index} className="mb-2 pb-2 border-b border-gray-100">
                          <p className="font-medium">{day.title}</p>
                          <p className="text-xs text-gray-600">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Atracciones simplificadas */}
                {message.attractions && message.attractions.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.attractions.map((attraction, index) => (
                      <Card key={index} className="p-3 bg-white border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-sm flex items-center text-gray-800">
                          <MapPin className="h-3 w-3 mr-1 text-chiapas-red" />
                          {attraction.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{attraction.description}</p>
                        
                        <div className="mt-2 h-36 relative rounded overflow-hidden">
                          <GoogleMap 
                            lat={attraction.coordinates.lat} 
                            lng={attraction.coordinates.lng}
                            height="144px"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Sugerencias de respuesta */}
                {message.suggestions && message.suggestions.length > 0 && message.sender === 'bot' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full border border-gray-300 hover:bg-amber-600/10 hover:border-amber-500/50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div ref={message.id === messages[messages.length - 1].id ? messagesEndRef : null} />
            </div>
          ))}
          
          {/* Formulario de itinerario simplificado */}
          {showItineraryForm && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-4">
              <h4 className="font-medium text-sm text-gray-800 mb-3">Configura tu itinerario:</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1 text-xs">¿Qué tipo de experiencia buscas?</label>
                  <select 
                    name="experienceType"
                    value={formData.experienceType}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm"
                  >
                    <option value="aventura">Aventura y naturaleza</option>
                    <option value="cultural">Cultural e histórico</option>
                    <option value="gastronomico">Gastronómico</option>
                    <option value="relax">Relax y bienestar</option>
                    <option value="familia">Familiar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-600 mb-1 text-xs">¿Cuántos días planeas estar?</label>
                  <select 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm"
                  >
                    <option value="1-3">1-3 días</option>
                    <option value="4-7">4-7 días</option>
                    <option value="8+">8+ días</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-600 mb-1 text-xs">¿Algún destino imprescindible?</label>
                  <input 
                    type="text" 
                    name="destinations"
                    value={formData.destinations}
                    onChange={handleInputChange}
                    placeholder="Ej. San Cristóbal, Palenque..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm" 
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => handleSendMessage("Generar mi itinerario")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...
                      </>
                    ) : (
                      'Crear mi itinerario'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Indicador de escritura */}
          {isLoading && !showItineraryForm && (
            <div className="flex items-center text-xs text-gray-500 pl-2">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 bg-amber-600/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-amber-600/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-amber-600/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="ml-2">Escribiendo...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Área de entrada de texto */}
      <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
        <Input
          className="flex-1 bg-gray-50 rounded-full"
          placeholder="Pregunta o pide un itinerario..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <Button 
          type="button" 
          size="icon" 
          className="bg-amber-600 text-white h-9 w-9 rounded-full"
          onClick={() => handleSendMessage()}
          disabled={isLoading || inputValue.trim() === ''}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}