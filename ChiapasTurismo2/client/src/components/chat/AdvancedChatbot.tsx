import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { X, Bot, Send, Loader2, MessageSquare, Trash2, MinusCircle, MapPin } from 'lucide-react';
import { GoogleMap } from '@/components/maps/GoogleMap';

// Interfaces para el componente GoogleMap
interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: 'naturaleza' | 'cultural' | 'gastronomia' | 'artesanias' | 'arqueologia';
  imageUrl?: string;
}

// Define the interface for Attraction objects
interface Attraction {
  name: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Define the interface for message objects
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attractions?: Attraction[];
}

// Generate a unique ID for messages
function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface AdvancedChatbotProps {
  initialQuery?: string;
}

export function AdvancedChatbot({ initialQuery }: AdvancedChatbotProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState(initialQuery || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversationContext, setConversationContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Control de desplazamiento mejorado:
  // - Solo desplaza automáticamente cuando se añade un mensaje de usuario (no cuando la IA responde)
  // - Preserva la posición de lectura cuando el usuario ha desplazado hacia arriba
  const [prevMessageCount, setPrevMessageCount] = useState(0);
  const [userScrolled, setUserScrolled] = useState(false);
  
  // Detectar cuando el usuario ha desplazado manualmente
  useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current && messagesEndRef.current.parentElement) {
        const container = messagesEndRef.current.parentElement;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        // Si no está cerca del fondo, el usuario ha desplazado hacia arriba
        setUserScrolled(!isNearBottom);
      }
    };
    
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Control de desplazamiento cuando cambia el número de mensajes
  useEffect(() => {
    // Si hay un nuevo mensaje y es del usuario (el último mensaje añadido es del usuario)
    const isNewUserMessage = 
      messages.length > prevMessageCount && 
      messages.length > 0 && 
      messages[messages.length - 1].sender === 'user';
    
    if (messagesEndRef.current && messages.length > 0) {
      const container = messagesEndRef.current.parentElement;
      
      // Desplazar al final SOLO si:
      // 1. El usuario no ha desplazado manualmente hacia arriba, O
      // 2. Acaba de enviar un nuevo mensaje (isNewUserMessage)
      if (container && (!userScrolled || isNewUserMessage)) {
        // Usar setTimeout para asegurar que la UI se ha actualizado
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          // Resetear el flag solo si se desplazó debido a un mensaje de usuario
          if (isNewUserMessage) setUserScrolled(false);
        }, 100);
      }
    }
    
    // Actualizar el contador de mensajes para la próxima comparación
    setPrevMessageCount(messages.length);
  }, [messages, userScrolled, prevMessageCount]);

  // Function to delete a specific message
  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // Function to clear all messages
  const clearAllMessages = () => {
    setMessages([]);
    setConversationContext(null);
  };

  // Function to handle asking a question
  async function handleAskQuestion() {
    if (!question.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor escribe una pregunta antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    const currentQuestion = question;
    setIsSubmitting(true);
    
    // Add user message to chat
    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      content: currentQuestion,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear the input field immediately after sending
    setQuestion('');
    
    // Añadir mensaje de "escribiendo..." para indicar que el chatbot está procesando la pregunta
    const typingId = generateId();
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        id: typingId,
        content: "Estoy buscando la mejor información para ti...",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    try {
      // Prepare the previous messages for context
      const previousMessages = messages
        .slice(-6) // Include only the last 6 messages for context
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      // Call the AI API with improved error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos máximo de espera
      
      const response = await apiRequest<any>(
        '/api/ai-tour-guide',
        {
          method: 'POST',
          body: JSON.stringify({ 
            question: currentQuestion,
            context: conversationContext,
            previousMessages
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      // Eliminar el mensaje de "escribiendo..."
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== typingId));
      
      // Add bot response to chat
      const botMessage: Message = {
        id: generateId(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date(),
        attractions: response.attractions
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsSubmitting(false);
      
      // Actualizar contexto de manera más inteligente basado en la respuesta y la pregunta
      // Esto permite que el contexto evolucione con la conversación
      const questionLower = currentQuestion.toLowerCase();
      const responseLower = response.response.toLowerCase();
      
      // Función auxiliar para detectar temas en texto
      const detectTopics = (text: string) => {
        const topics = new Map<string, string[]>([
          ["transporte", ["autobús", "autobus", "colectivo", "taxi", "carro", "combi", "avión", "avion", "llegar", "viajar", "boleto", "terminal"]],
          ["hospedaje", ["hotel", "hostal", "airbnb", "alojamiento", "hospedaje", "habitación", "habitacion", "dormir", "albergar", "posada"]],
          ["gastronomía", ["comida", "restaurante", "plato", "típico", "típica", "tipico", "tipica", "sabor", "comer", "probar", "desayuno", "almuerzo", "cena"]],
          ["clima", ["lluvia", "temperatura", "calor", "frío", "frio", "clima", "temporada", "época", "humedad", "soleado", "nublado"]]
        ]);
        
        for (const [topic, keywords] of topics.entries()) {
          if (keywords.some(keyword => text.includes(keyword))) {
            return topic;
          }
        }
        
        return null;
      };
      
      // Detectar lugares en la conversación
      const lugares = [
        {name: "san_cristobal", keywords: ["san cristóbal", "san cristobal", "sancris"]},
        {name: "palenque", keywords: ["palenque", "ruinas"]},
        {name: "canon_sumidero", keywords: ["sumidero", "cañón", "canon"]},
        {name: "cascadas", keywords: ["cascada", "cascadas", "agua azul", "el chiflón", "chiflon"]},
        {name: "comunidades_indigenas", keywords: ["chamula", "tzotzil", "indígen", "indigena", "zinacant", "zinacantan"]},
        {name: "montebello", keywords: ["montebello", "lagos"]},
        {name: "selva_lacandona", keywords: ["selva", "lacandona"]},
        {name: "tuxtla", keywords: ["tuxtla", "capital"]},
        {name: "comitan", keywords: ["comitán", "comitan"]},
        {name: "chiapa_corzo", keywords: ["chiapa de corzo"]}
      ];
      
      // Detectar tema
      const detectedTopic = detectTopics(questionLower + " " + responseLower);
      
      // Detectar lugar
      let detectedPlace = null;
      for (const lugar of lugares) {
        if (lugar.keywords.some(keyword => questionLower.includes(keyword) || responseLower.includes(keyword))) {
          detectedPlace = lugar.name;
          break;
        }
      }
      
      // Actualizar contexto combinando tema y lugar si están disponibles
      if (detectedPlace && detectedTopic) {
        setConversationContext(`${detectedPlace}_${detectedTopic}`);
      } else if (detectedPlace) {
        setConversationContext(detectedPlace);
      } else if (detectedTopic) {
        setConversationContext(detectedTopic);
      }
      // Si no se detecta nada, mantenemos el contexto actual para continuidad
      
      // Track conversation in analytics if available
      if (window.gtag) {
        window.gtag('event', 'ai_chat_interaction', {
          'question': currentQuestion,
          'response_id': botMessage.id,
          'model': 'deepseek-llama-70b'
        });
      }
    } catch (error) {
      console.error('Error processing question:', error);
      
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: generateId(),
          content: "Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta nuevamente.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: "No se pudo procesar tu pregunta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  }

  // Handle Enter key to submit
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  // Handle clicking on a sample question
  const handleSampleQuestionSelection = (q: string) => {
    // Mostrar el chat si está oculto
    setShowChat(true);
    
    // Crear y añadir el mensaje del usuario inmediatamente
    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      content: q,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Añadir el mensaje de usuario a la conversación
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Iniciar la consulta al API
    setIsSubmitting(true);
    
    // Añadir mensaje de "escribiendo..." para indicar que el chatbot está procesando
    const typingId = generateId();
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        id: typingId,
        content: "Estoy buscando la mejor información para ti...",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    // Preparar los mensajes para el contexto (IMPORTANTE: usar la versión actual de messages)
    const currentMessages = [...messages, userMessage]; // Incluir el mensaje recién añadido
    const previousMsgs = currentMessages
      .slice(-6)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    
    // Mejorar manejo de errores y tiempos de espera
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos máximo
    
    // Llamar a la API
    apiRequest<any>(
      '/api/ai-tour-guide',
      {
        method: 'POST',
        body: JSON.stringify({ 
          question: q,
          context: conversationContext,
          previousMessages: previousMsgs
        }),
        signal: controller.signal
      }
    ).then(response => {
      clearTimeout(timeoutId);
      
      // Eliminar mensaje de "escribiendo..."
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== typingId));
      
      // Añadir respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date(),
        attractions: response.attractions
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsSubmitting(false);
      
      // Actualizar contexto de manera más inteligente basado en la respuesta y la pregunta
      const questionLower = q.toLowerCase();
      const responseLower = response.response.toLowerCase();
      
      // Función auxiliar para detectar temas en texto
      const detectTopics = (text: string) => {
        const topics = new Map<string, string[]>([
          ["transporte", ["autobús", "autobus", "colectivo", "taxi", "carro", "combi", "avión", "avion", "llegar", "viajar", "boleto", "terminal"]],
          ["hospedaje", ["hotel", "hostal", "airbnb", "alojamiento", "hospedaje", "habitación", "habitacion", "dormir", "albergar", "posada"]],
          ["gastronomía", ["comida", "restaurante", "plato", "típico", "típica", "tipico", "tipica", "sabor", "comer", "probar", "desayuno", "almuerzo", "cena"]],
          ["clima", ["lluvia", "temperatura", "calor", "frío", "frio", "clima", "temporada", "época", "humedad", "soleado", "nublado"]]
        ]);
        
        for (const [topic, keywords] of topics.entries()) {
          if (keywords.some(keyword => text.includes(keyword))) {
            return topic;
          }
        }
        
        return null;
      };
      
      // Detectar lugares en la conversación
      const lugares = [
        {name: "san_cristobal", keywords: ["san cristóbal", "san cristobal", "sancris"]},
        {name: "palenque", keywords: ["palenque", "ruinas"]},
        {name: "canon_sumidero", keywords: ["sumidero", "cañón", "canon"]},
        {name: "cascadas", keywords: ["cascada", "cascadas", "agua azul", "el chiflón", "chiflon"]},
        {name: "comunidades_indigenas", keywords: ["chamula", "tzotzil", "indígen", "indigena", "zinacant", "zinacantan"]},
        {name: "montebello", keywords: ["montebello", "lagos"]},
        {name: "selva_lacandona", keywords: ["selva", "lacandona"]},
        {name: "tuxtla", keywords: ["tuxtla", "capital"]},
        {name: "comitan", keywords: ["comitán", "comitan"]},
        {name: "chiapa_corzo", keywords: ["chiapa de corzo"]}
      ];
      
      // Detectar tema
      const detectedTopic = detectTopics(questionLower + " " + responseLower);
      
      // Detectar lugar
      let detectedPlace = null;
      for (const lugar of lugares) {
        if (lugar.keywords.some(keyword => questionLower.includes(keyword) || responseLower.includes(keyword))) {
          detectedPlace = lugar.name;
          break;
        }
      }
      
      // Actualizar contexto combinando tema y lugar si están disponibles
      if (detectedPlace && detectedTopic) {
        setConversationContext(`${detectedPlace}_${detectedTopic}`);
      } else if (detectedPlace) {
        setConversationContext(detectedPlace);
      } else if (detectedTopic) {
        setConversationContext(detectedTopic);
      }
      // Si no se detecta nada, mantenemos el contexto actual para continuidad
    }).catch(error => {
      clearTimeout(timeoutId);
      console.error('Error en pregunta de ejemplo:', error);
      
      // Eliminar mensaje de "escribiendo..."
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== typingId));
      
      // Añadir mensaje de error
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: generateId(),
          content: "Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta nuevamente.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: "No se pudo procesar tu pregunta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    });
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Sample questions to get started
  const sampleQuestions = [
    "¿Cómo llegar a San Cristóbal desde Villahermosa?",
    "¿Qué puedo hacer en Tuxtla Gutiérrez en un día?",
    "¿Cuál es la mejor época para visitar las cascadas?",
    "¿Me recomiendas restaurantes en San Cristóbal?"
  ];

  // Suggested follow-up questions based on the context
  const obtenerSugerencias = (): string[] => {
    if (!conversationContext) {
      return [
        "¿Qué lugares visitar en Chiapas?",
        "¿Cuáles son las mejores cascadas?",
        "¿Cómo es el clima en San Cristóbal?"
      ];
    }
    
    if (conversationContext === "san_cristobal") {
      return [
        "¿Dónde comer en San Cristóbal?",
        "¿Cómo es el clima en San Cristóbal?",
        "¿Qué comunidades indígenas visitar cerca?"
      ];
    } else if (conversationContext === "palenque") {
      return [
        "¿Cómo llegar a Palenque desde San Cristóbal?",
        "¿Qué más hay para ver cerca de Palenque?",
        "¿Dónde alojarse en Palenque?"
      ];
    } else if (conversationContext === "canon_sumidero") {
      return [
        "¿Dónde salen las lanchas para el Cañón?",
        "¿Qué más hay para ver en Tuxtla?",
        "¿Cómo es el clima en Tuxtla?"
      ];
    } else if (conversationContext === "cascadas") {
      return [
        "¿Se puede nadar en las cascadas?",
        "¿Cuál es la mejor época para visitar las cascadas?",
        "¿Cómo llegar a las cascadas desde San Cristóbal?"
      ];
    } else if (conversationContext === "cultura_indigena") {
      return [
        "¿Puedo tomar fotos en San Juan Chamula?",
        "¿Qué significan sus trajes tradicionales?",
        "¿Qué artesanías puedo comprar ahí?"
      ];
    }
    
    return [
      "¿Qué lugares recomiendas visitar en Chiapas?",
      "¿Cómo moverme por Chiapas?",
      "¿Mejor época para visitar Chiapas?"
    ];
  };

  // Add a welcome message when the component loads
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: generateId(),
        content: "¡Hola! Soy tu asistente de viajes por Chiapas. Puedo ayudarte con información sobre destinos, rutas, transporte, alojamiento, gastronomía y más. ¿Qué te gustaría saber sobre Chiapas?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  return (
    <section 
      className="relative z-10 py-6 px-4 md:px-0"
      itemScope 
      itemType="https://schema.org/WebApplication"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-display font-bold mb-1 text-chiapas-dark"
            itemProp="name"
          >
            Asistente Inteligente de Viajes
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-chiapas-gold to-chiapas-green mx-auto mb-2"></div>
          <p className="text-sm text-chiapas-dark/80 max-w-xl mx-auto">
            Pregúntame lo que quieras sobre Chiapas - rutas, comida, alojamiento, atracciones, o cualquier duda sobre tu viaje
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-chiapas-green/5">
          {/* Decorative header */}
          <div className="h-1 bg-gradient-to-r from-chiapas-gold via-chiapas-green to-chiapas-gold/70"></div>
          
          <div className="p-4">
            {/* Main area */}
            <div className="flex flex-col items-center">
              {!showChat ? (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-chiapas-green/10 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-chiapas-green" />
                    </div>
                    <p className="text-sm font-medium text-chiapas-dark">¿Qué quieres saber sobre Chiapas?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleQuestions.map((q, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleSampleQuestionSelection(q)}
                        className="text-xs p-2 bg-white hover:bg-chiapas-green/5
                        border border-gray-200 hover:border-chiapas-green/30 text-chiapas-dark/90 rounded-lg
                        transition-all duration-200 font-medium shadow-sm text-left flex items-start gap-2"
                      >
                        <MessageSquare className="h-3 w-3 mt-0.5 text-chiapas-green flex-shrink-0" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-3">
                    <Button 
                      onClick={() => setShowChat(true)} 
                      variant="default" 
                      size="sm" 
                      className="bg-gradient-to-r from-chiapas-green to-chiapas-green/90 hover:from-chiapas-gold hover:to-chiapas-gold/90 transition-all duration-300 text-white font-medium px-4 py-1 rounded-full shadow-sm hover:shadow-md"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Hacer mi propia pregunta
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-md">
                  {/* Top bar */}
                  <div className="bg-gradient-to-r from-chiapas-green to-chiapas-gold p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-xs">Asistente Inteligente de Chiapas</h3>
                        <p className="text-white/70 text-[10px]">Powered by DeepSeek AI</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowChat(false)} 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Messages area */}
                  <div className="h-64 md:h-96 overflow-y-auto p-3 bg-gray-50/50 space-y-3">
                    {messages.map((message, index) => (
                      <div 
                        key={message.id} 
                        className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="group relative">
                          <div 
                            className={`max-w-[80%] md:max-w-md rounded-lg p-2 ${
                              message.sender === 'user'
                                ? 'bg-chiapas-green/10 ml-auto'
                                : 'bg-white border border-gray-100'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.sender === 'bot' && (
                                <div className="w-6 h-6 rounded-full bg-chiapas-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Bot className="h-3 w-3 text-chiapas-green" />
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <div className="text-xs whitespace-pre-wrap">
                                  {message.content}
                                </div>
                                <div className="mt-1 text-[10px] text-gray-400 flex justify-between items-center">
                                  <span>{formatTime(message.timestamp)}</span>
                                  
                                  {message.sender === 'user' && (
                                    <button 
                                      onClick={() => deleteMessage(message.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-red-500"
                                    >
                                      <MinusCircle className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Show attractions on map if message has attractions */}
                        {message.attractions && message.attractions.length > 0 && (
                          <div className="mt-2 w-full max-w-[80%] rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-white p-2 text-xs flex items-center gap-1 border-b">
                              <MapPin className="h-3 w-3 text-chiapas-green" />
                              <span className="font-medium">Ubicaciones mencionadas</span>
                            </div>
                            <div className="h-48">
                              <GoogleMap 
                                lat={message.attractions[0].coordinates.lat}
                                lng={message.attractions[0].coordinates.lng}
                                zoom={8}
                                showMultipleLocations={true}
                                locations={message.attractions.map(attraction => ({
                                  id: attraction.name.toLowerCase().replace(/\s+/g, '-'),
                                  name: attraction.name,
                                  lat: attraction.coordinates.lat,
                                  lng: attraction.coordinates.lng,
                                  description: attraction.description,
                                  category: 'cultural' // Por defecto asignamos categoría cultural
                                }))}
                                height="100%"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Add suggestions after bot responses */}
                        {message.sender === 'bot' && index === messages.length - 1 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 ml-8 max-w-[90%]">
                            {obtenerSugerencias().slice(0, 3).map((sugerencia, i) => (
                              <button
                                key={i}
                                onClick={() => handleSampleQuestionSelection(sugerencia)}
                                className="text-[10px] py-1 px-2 bg-white hover:bg-chiapas-green/5 
                                        border border-gray-200 hover:border-chiapas-green/30 text-chiapas-dark/80 rounded-full
                                        transition-all duration-200 shadow-sm flex items-center"
                              >
                                <MessageSquare className="h-2 w-2 mr-1 text-chiapas-green" />
                                {sugerencia}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isSubmitting && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] md:max-w-md rounded-lg p-2 bg-white border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-chiapas-green/10 flex items-center justify-center">
                              <Bot className="h-3 w-3 text-chiapas-green" />
                            </div>
                            <div className="flex gap-1 items-center h-5 px-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-chiapas-green animate-bounce"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-chiapas-green animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-chiapas-green animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input area */}
                  <div className="p-2 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe tu pregunta sobre Chiapas..."
                        className="min-h-[40px] max-h-[80px] text-xs py-2 resize-none border-gray-200 focus:border-chiapas-green/50 focus:ring-1 focus:ring-chiapas-green/30 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <Button 
                          onClick={handleAskQuestion}
                          disabled={isSubmitting || !question.trim()}
                          variant="default" 
                          size="sm" 
                          className="h-8 px-3 bg-chiapas-green text-white rounded-md hover:bg-chiapas-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        </Button>
                        
                        {messages.length > 1 && (
                          <Button 
                            onClick={clearAllMessages}
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-8 p-0 rounded-md border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
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