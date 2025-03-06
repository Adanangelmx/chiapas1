import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MapPin, User, Bot, SmilePlus, Calendar, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleMap } from '@/components/maps/GoogleMap';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

interface SmartTravelAssistantProps {
  mode?: 'chat' | 'itinerary' | 'unified';
}

export function SmartTravelAssistant({ mode = 'unified' }: SmartTravelAssistantProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola viajero! 👋 Soy tu asistente de viaje personal para Chiapas. ¿En qué puedo ayudarte hoy?\n\nPuedo:\n- Responderte cualquier pregunta sobre Chiapas\n- Ayudarte a planificar un itinerario personalizado\n- Brindarte información actualizada sobre clima, transportes y lugares',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        '¿Qué lugares recomiendas visitar en 5 días?',
        'Planifica un viaje cultural a Chiapas',
        '¿Cómo llegar de San Cristóbal a Palenque?',
        '¿Cuál es la mejor época para visitar?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Estado para el formulario de itinerario
  const [formData, setFormData] = useState({
    experienceType: 'aventura',
    duration: '4-7',
    destinations: '',
    budget: 'moderado'
  });
  
  // Historial de conversación para mantener contexto
  const [conversationContext, setConversationContext] = useState({
    lastIntent: '',
    lastQuestion: '',
    lastLocation: '',
    recentTopics: [] as string[]
  });
  
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

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };

  // Manejar cambio en formulario de itinerario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar clic en emoji
  const handleEmojiClick = (emojiData: any) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim() !== '') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Detectar la intención del mensaje
  const detectIntent = (message: string): 'itinerary' | 'question' | 'followup' => {
    const itineraryKeywords = [
      'itinerario', 'planear', 'planifica', 'viaje', 'ruta', 'agenda', 
      'plan', 'días', 'visitar', 'estancia', 'recorrido', 'organizar'
    ];
    
    const followupKeywords = [
      'gracias', 'perfecto', 'me gusta', 'suena bien', 'excelente', 
      'genial', '¿y qué más', '¿algo más', '¿qué recomiendas'
    ];
    
    const timePeriodPatterns = [
      /\d+\s+días?/i,      // "3 días", "5 dia"
      /\d+\s+semanas?/i,   // "2 semanas", "1 semana"
      /una semana/i,       // "una semana"
      /fin de semana/i,    // "fin de semana"
      /\d+\s+noches?/i     // "3 noches", "5 noche"
    ];
    
    const lowercaseMsg = message.toLowerCase();
    
    // Verificar si es una pregunta de seguimiento basada en contexto previo
    const isFollowup = followupKeywords.some(keyword => lowercaseMsg.includes(keyword));
    if (isFollowup) return 'followup';
    
    // Verificar si es una solicitud de itinerario
    const hasItineraryKeyword = itineraryKeywords.some(keyword => lowercaseMsg.includes(keyword));
    const hasTimePeriod = timePeriodPatterns.some(pattern => pattern.test(lowercaseMsg));
    
    if (hasItineraryKeyword && (hasTimePeriod || lowercaseMsg.includes('día'))) {
      return 'itinerary';
    }
    
    // Si no es ninguna de las anteriores, es una pregunta general
    return 'question';
  };
  
  // Enviar mensaje
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
      
      // Actualizar contexto de conversación
      setConversationContext(prev => ({
        ...prev,
        lastIntent: intent,
        lastQuestion: messageContent,
        recentTopics: [...prev.recentTopics.slice(-3), messageContent] // Mantener solo los últimos 4 temas
      }));
      
      // Si estamos en el formulario de itinerario y el usuario está listo para generar
      if (showItineraryForm && messageContent.toLowerCase().includes('generar')) {
        // Generar itinerario
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
        
        // Detectar tipo de experiencia
        if (messageContent.toLowerCase().includes('aventura') || 
            messageContent.toLowerCase().includes('naturaleza') ||
            messageContent.toLowerCase().includes('selva')) {
          setFormData(prev => ({ ...prev, experienceType: 'aventura' }));
        } else if (messageContent.toLowerCase().includes('cultural') || 
                  messageContent.toLowerCase().includes('historia') ||
                  messageContent.toLowerCase().includes('arqueolog')) {
          setFormData(prev => ({ ...prev, experienceType: 'cultural' }));
        } else if (messageContent.toLowerCase().includes('relaj') || 
                  messageContent.toLowerCase().includes('tranquil') ||
                  messageContent.toLowerCase().includes('descanso')) {
          setFormData(prev => ({ ...prev, experienceType: 'relax' }));
        }
        
        // Extraer destinos mencionados
        const destinationKeywords = [
          'san cristóbal', 'palenque', 'tuxtla', 'comitán', 'chiapa de corzo',
          'cascadas', 'agua azul', 'sumidero', 'montebello', 'chamula'
        ];
        
        const mentionedDestinations = destinationKeywords
          .filter(dest => messageContent.toLowerCase().includes(dest))
          .join(', ');
        
        if (mentionedDestinations) {
          setFormData(prev => ({ ...prev, destinations: mentionedDestinations }));
        }
        
        // Detectar presupuesto
        if (messageContent.toLowerCase().includes('económic') || 
            messageContent.toLowerCase().includes('barato') ||
            messageContent.toLowerCase().includes('bajo costo')) {
          setFormData(prev => ({ ...prev, budget: 'económico' }));
        } else if (messageContent.toLowerCase().includes('lujo') || 
                  messageContent.toLowerCase().includes('premium') ||
                  messageContent.toLowerCase().includes('alto nivel')) {
          setFormData(prev => ({ ...prev, budget: 'premium' }));
        }
        
        // Mostrar formulario de itinerario
        setShowItineraryForm(true);
        
        // Mensaje de seguimiento del bot para pedir detalles
        const followupMessage: Message = {
          id: generateId(),
          content: 'Genial, vamos a crear tu itinerario personalizado. He preseleccionado algunas opciones basadas en tu mensaje, pero por favor revisa y ajusta los detalles para ayudarme a diseñar el plan perfecto para ti:',
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
        
        // Enriquecer el contenido con emojis basados en palabras clave
        let enrichedContent = data.response;
        const emojiMap: Record<string, string> = {
          'cascada': '💦',
          'lago': '🏞️',
          'montaña': '⛰️',
          'selva': '🌳',
          'playa': '🏖️',
          'museo': '🏛️',
          'iglesia': '⛪',
          'templo': '🛕',
          'comida': '🍽️',
          'restaurante': '🍴',
          'hotel': '🏨',
          'artesanía': '🧶',
          'mercado': '🛍️',
          'festival': '🎭',
          'clima': '🌦️',
          'costo': '💰',
          'precio': '💲',
          'tours': '🧭',
          'guía': '📱',
          'transporte': '🚌',
          'bus': '🚌',
          'taxi': '🚕',
          'caminata': '🚶',
          'aventura': '🏕️',
          'cultura': '🎨',
          'historia': '📜',
          'ciudad': '🏙️',
          'pueblo': '🏘️',
          'días': '📅',
          'noches': '🌙',
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
          messageType: 'chat',
          attractions: data.attractions,
          suggestions: [
            '¿Qué más puedo visitar cerca?',
            '¿Cuál es el costo aproximado?',
            '¿Cómo llego hasta allí?',
            '¿Me recomiendas algún hotel?'
          ]
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
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
        content: "Estoy diseñando tu itinerario personalizado. Esto tomará unos momentos...",
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
        content: `¡Listo! He creado un itinerario personalizado basado en tus preferencias: "${data.itinerary.title}"`,
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'itinerary',
        itinerary: data.itinerary,
        suggestions: [
          '¿Puedes modificar el día 2?',
          '¿Hay alternativas para clima lluvioso?',
          '¿Qué lugares son imperdibles?',
          'Descarga mi itinerario'
        ]
      };
      
      setMessages(prev => [...prev, itineraryMessage]);
    } catch (error) {
      console.error('Error generando itinerario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el itinerario. Intente nuevamente más tarde.',
        variant: 'destructive'
      });
      
      // Mensaje de error
      const errorMessage: Message = {
        id: generateId(),
        content: "Lo siento, tuve problemas generando tu itinerario. Por favor intenta nuevamente o sé más específico con tus preferencias de viaje.",
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'chat'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Descargar itinerario
  const downloadItinerary = (format = 'pdf', itinerary: Itinerary) => {
    if (!itinerary) return;

    if (format === 'md') {
      // Formato Markdown mejorado
      let content = `# ${itinerary.title}\n\n`;
      
      // Información de temporada si está disponible
      if (itinerary.seasonInfo) {
        content += `## Información de temporada\n`;
        content += `- **Mejor época para visitar:** ${itinerary.seasonInfo.bestTime}\n`;
        content += `- **Temporada actual:** ${itinerary.seasonInfo.currentSeason}\n`;
        content += `- **Consejos de clima:** ${itinerary.seasonInfo.weatherTips}\n\n`;
      }
      
      // Detalles del itinerario día a día
      itinerary.days.forEach(day => {
        content += `## ${day.title}\n${day.description}\n\n`;
        
        // Alojamiento
        if (day.accommodation) {
          content += `### Alojamiento\n`;
          content += `- **Nombre:** ${day.accommodation.name}\n`;
          content += `- **Tipo:** ${day.accommodation.type}\n`;
          content += `- **Rango de precios:** ${day.accommodation.priceRange}\n\n`;
        }
        
        // Comidas
        if (day.meals && day.meals.length > 0) {
          content += `### Comidas recomendadas\n`;
          day.meals.forEach(meal => {
            content += `- **${meal.type}:** ${meal.recommendation} - ${meal.dish} (${meal.priceRange})\n`;
          });
          content += '\n';
        }
        
        // Transporte
        if (day.transportation) {
          content += `### Transporte\n`;
          content += `- **Tipo:** ${day.transportation.type}\n`;
          content += `- **Duración:** ${day.transportation.duration}\n`;
          content += `- **Costo:** ${day.transportation.cost}\n\n`;
        }
      });
      
      // Recomendaciones y lugares secretos
      content += `## Recomendaciones adicionales:\n${itinerary.recommendations.map(rec => `- ${rec}`).join('\n')}\n\n`;
      
      if (itinerary.hiddenGems && itinerary.hiddenGems.length > 0) {
        content += `## Lugares poco conocidos que vale la pena visitar:\n${itinerary.hiddenGems.map(gem => `- ${gem}`).join('\n')}\n\n`;
      }
      
      // Resumen de presupuesto estimado
      if (itinerary.totalBudgetEstimate) {
        content += `## Estimación de presupuesto total\n`;
        content += `- **Alojamiento:** ${itinerary.totalBudgetEstimate.accommodation}\n`;
        content += `- **Comidas:** ${itinerary.totalBudgetEstimate.food}\n`;
        content += `- **Transporte:** ${itinerary.totalBudgetEstimate.transportation}\n`;
        content += `- **Actividades:** ${itinerary.totalBudgetEstimate.activities}\n`;
        content += `- **TOTAL:** ${itinerary.totalBudgetEstimate.total}\n`;
      }

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'itinerario-chiapas.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Generar PDF
      const container = document.createElement('div');
      container.style.cssText = `
        width: 100%;
        max-width: 800px;
        background-color: white;
        color: black;
        padding: 20px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
      `;
      
      // Crear contenido para el PDF
      const content = document.createElement('div');
      
      // Título
      const title = document.createElement('h1');
      title.textContent = itinerary.title;
      title.style.cssText = 'text-align: center; color: #333; margin-bottom: 20px;';
      content.appendChild(title);
      
      // Información de temporada
      if (itinerary.seasonInfo) {
        const seasonSection = document.createElement('div');
        seasonSection.style.cssText = 'margin-bottom: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;';
        
        const seasonTitle = document.createElement('h2');
        seasonTitle.textContent = 'Información de temporada';
        seasonTitle.style.cssText = 'color: #444; margin-bottom: 10px; font-size: 16px;';
        seasonSection.appendChild(seasonTitle);
        
        const seasonInfo = document.createElement('ul');
        seasonInfo.style.cssText = 'padding-left: 20px;';
        
        const items = [
          { label: 'Mejor época para visitar', value: itinerary.seasonInfo.bestTime },
          { label: 'Temporada actual', value: itinerary.seasonInfo.currentSeason },
          { label: 'Consejos de clima', value: itinerary.seasonInfo.weatherTips }
        ];
        
        items.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
          seasonInfo.appendChild(li);
        });
        
        seasonSection.appendChild(seasonInfo);
        content.appendChild(seasonSection);
      }
      
      // Días del itinerario
      itinerary.days.forEach(day => {
        const daySection = document.createElement('div');
        daySection.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;';
        
        const dayTitle = document.createElement('h2');
        dayTitle.textContent = day.title;
        dayTitle.style.cssText = 'color: #333; margin-bottom: 5px; font-size: 16px;';
        daySection.appendChild(dayTitle);
        
        const dayDesc = document.createElement('p');
        dayDesc.textContent = day.description;
        dayDesc.style.cssText = 'margin-bottom: 10px;';
        daySection.appendChild(dayDesc);
        
        // Detalles adicionales
        if (day.accommodation || (day.meals && day.meals.length > 0) || day.transportation) {
          const details = document.createElement('div');
          details.style.cssText = 'margin-top: 10px; font-size: 13px;';
          
          if (day.accommodation) {
            const accomm = document.createElement('div');
            accomm.innerHTML = `<strong>Alojamiento:</strong> ${day.accommodation.name} (${day.accommodation.priceRange})`;
            details.appendChild(accomm);
          }
          
          if (day.meals && day.meals.length > 0) {
            const meals = document.createElement('div');
            meals.innerHTML = `<strong>Comidas:</strong> ${day.meals.map(m => `${m.type}: ${m.recommendation}`).join(', ')}`;
            details.appendChild(meals);
          }
          
          if (day.transportation) {
            const transport = document.createElement('div');
            transport.innerHTML = `<strong>Transporte:</strong> ${day.transportation.type} (${day.transportation.cost})`;
            details.appendChild(transport);
          }
          
          daySection.appendChild(details);
        }
        
        content.appendChild(daySection);
      });
      
      // Recomendaciones
      const recSection = document.createElement('div');
      recSection.style.cssText = 'margin-top: 20px;';
      
      const recTitle = document.createElement('h2');
      recTitle.textContent = 'Recomendaciones adicionales';
      recTitle.style.cssText = 'color: #333; margin-bottom: 10px; font-size: 16px;';
      recSection.appendChild(recTitle);
      
      const recList = document.createElement('ul');
      recList.style.cssText = 'padding-left: 20px;';
      
      itinerary.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recList.appendChild(li);
      });
      
      recSection.appendChild(recList);
      content.appendChild(recSection);
      
      // Lugares poco conocidos
      if (itinerary.hiddenGems && itinerary.hiddenGems.length > 0) {
        const gemsSection = document.createElement('div');
        gemsSection.style.cssText = 'margin-top: 20px;';
        
        const gemsTitle = document.createElement('h2');
        gemsTitle.textContent = 'Lugares poco conocidos que vale la pena visitar';
        gemsTitle.style.cssText = 'color: #333; margin-bottom: 10px; font-size: 16px;';
        gemsSection.appendChild(gemsTitle);
        
        const gemsList = document.createElement('ul');
        gemsList.style.cssText = 'padding-left: 20px;';
        
        itinerary.hiddenGems.forEach(gem => {
          const li = document.createElement('li');
          li.textContent = gem;
          gemsList.appendChild(li);
        });
        
        gemsSection.appendChild(gemsList);
        content.appendChild(gemsSection);
      }
      
      // Presupuesto
      if (itinerary.totalBudgetEstimate) {
        const budgetSection = document.createElement('div');
        budgetSection.style.cssText = 'margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;';
        
        const budgetTitle = document.createElement('h2');
        budgetTitle.textContent = 'Estimación de presupuesto total';
        budgetTitle.style.cssText = 'color: #444; margin-bottom: 10px; font-size: 16px;';
        budgetSection.appendChild(budgetTitle);
        
        const budgetInfo = document.createElement('div');
        budgetInfo.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 5px;';
        
        const items = [
          { label: 'Alojamiento', value: itinerary.totalBudgetEstimate.accommodation },
          { label: 'Comidas', value: itinerary.totalBudgetEstimate.food },
          { label: 'Transporte', value: itinerary.totalBudgetEstimate.transportation },
          { label: 'Actividades', value: itinerary.totalBudgetEstimate.activities },
          { label: 'TOTAL', value: itinerary.totalBudgetEstimate.total }
        ];
        
        items.forEach(item => {
          const row = document.createElement('div');
          row.style.cssText = 'display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ddd;';
          row.innerHTML = `<strong>${item.label}:</strong> <span>${item.value}</span>`;
          budgetInfo.appendChild(row);
        });
        
        budgetSection.appendChild(budgetInfo);
        content.appendChild(budgetSection);
      }
      
      // Agregar contenido al contenedor
      container.appendChild(content);
      document.body.appendChild(container);
      
      // Generar PDF
      html2canvas(container, { 
        scale: 2,
        backgroundColor: "#ffffff"
      }).then(canvas => {
        document.body.removeChild(container);
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
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
  
  // Formatear hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Obtener un saludo aleatorio
  const getRandomGreeting = () => {
    const greetings = [
      "¿En qué puedo ayudarte hoy? 😊",
      "¿Qué lugares de Chiapas te gustaría conocer? 🌄",
      "¿Planeas un viaje a Chiapas? Pregúntame lo que necesites 🧳",
      "¿Buscas recomendaciones para tu visita a Chiapas? 🗺️",
      "¿Te gustaría que te ayude a planificar un itinerario? ✈️"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Configurar mensajes iniciales según el modo
  useEffect(() => {
    if (messages.length === 0) {
      let initialMessage: Message = {
        id: '1',
        content: '',
        sender: 'bot',
        timestamp: new Date(),
      };

      if (mode === 'chat' || mode === 'unified') {
        initialMessage = {
          ...initialMessage,
          content: '¡Hola viajero! 👋 Soy tu asistente de viaje personal para Chiapas. ¿En qué puedo ayudarte hoy?\n\nPuedo:\n- Responderte cualquier pregunta sobre Chiapas\n- Brindarte información actualizada sobre clima, transportes y lugares',
          messageType: 'chat',
          suggestions: [
            '¿Qué lugares recomiendas visitar en 5 días?',
            '¿Cómo llegar de San Cristóbal a Palenque?',
            '¿Cuál es la mejor época para visitar?',
            '¿Qué actividades hay en el Cañón del Sumidero?'
          ]
        };
      } else if (mode === 'itinerary') {
        initialMessage = {
          ...initialMessage,
          content: '¡Bienvenido al planificador de itinerarios! 🗺️ Dime qué tipo de experiencia buscas en Chiapas, por cuántos días, y qué lugares te interesan visitar.',
          messageType: 'chat',
          suggestions: [
            'Planifica un viaje cultural a Chiapas por 4 días',
            'Quiero un itinerario de aventura por 3 días',
            'Itinerario para 7 días con niños en Chiapas',
            'Plan para visitar cascadas y naturaleza en 5 días'
          ]
        };
      }

      setMessages([initialMessage]);
    }
  }, [mode]);

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Encabezado - Solo visible en modo unificado */}
      {mode === 'unified' && (
        <div className="bg-gradient-to-r from-chiapas-green to-chiapas-green/80 text-white p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-2" />
            <div>
              <h3 className="font-bold">Asistente de Viaje Chiapas</h3>
              <p className="text-xs text-white/80">Tu planificador y guía en un solo lugar</p>
            </div>
          </div>
          <div className="bg-white/20 px-2 py-1 rounded text-xs">
            En línea 🟢
          </div>
        </div>
      )}
      
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
                "max-w-[85%] rounded-xl p-3",
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
                      <span className="text-xs font-medium text-chiapas-dark/90">Asistente</span>
                      <span className="text-[10px] ml-1 text-chiapas-dark/60">{formatTime(message.timestamp)}</span>
                    </>
                  )}
                </div>
                
                {/* Contenido del mensaje */}
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Itinerario */}
                {message.messageType === 'itinerary' && message.itinerary && (
                  <div className="mt-3 bg-white rounded-lg p-3 border border-chiapas-gold/20 shadow-sm" ref={itineraryRef}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-chiapas-dark flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-chiapas-green" />
                        {message.itinerary.title}
                      </h4>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => downloadItinerary('pdf', message.itinerary!)}
                          title="Descargar PDF"
                        >
                          <Download className="h-4 w-4 text-chiapas-dark/60" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => downloadItinerary('md', message.itinerary!)}
                          title="Descargar Markdown"
                        >
                          <FileText className="h-4 w-4 text-chiapas-dark/60" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Información de temporada */}
                    {message.itinerary.seasonInfo && (
                      <div className="mb-3 p-2 bg-chiapas-green/10 rounded text-sm">
                        <p><strong>Mejor época:</strong> {message.itinerary.seasonInfo.bestTime}</p>
                        <p><strong>Temporada actual:</strong> {message.itinerary.seasonInfo.currentSeason}</p>
                        <p><strong>Consejos:</strong> {message.itinerary.seasonInfo.weatherTips}</p>
                      </div>
                    )}
                    
                    {/* Vista compacta del itinerario */}
                    <div className="max-h-52 overflow-y-auto text-sm pr-1">
                      {message.itinerary.days.map((day, index) => (
                        <div key={index} className="mb-2 pb-2 border-b border-gray-100">
                          <p className="font-medium">{day.title}</p>
                          <p className="text-xs text-gray-600">{day.description}</p>
                        </div>
                      ))}
                      
                      {/* Presupuesto */}
                      {message.itinerary.totalBudgetEstimate && (
                        <div className="mt-2 p-2 bg-chiapas-gold/10 rounded text-xs">
                          <p className="font-medium mb-1">Presupuesto total estimado: {message.itinerary.totalBudgetEstimate.total}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Atracciones recomendadas */}
                {message.attractions && message.attractions.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.attractions.map((attraction, index) => (
                      <Card key={index} className="p-3 bg-white border border-chiapas-gold/20 shadow-sm">
                        <h4 className="font-bold text-sm flex items-center text-chiapas-dark">
                          <MapPin className="h-3 w-3 mr-1 text-chiapas-red" />
                          {attraction.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{attraction.description}</p>
                        <p className="text-xs text-gray-500">{attraction.location}</p>
                        
                        <div className="mt-2 h-40 relative rounded overflow-hidden">
                          <GoogleMap 
                            lat={attraction.coordinates.lat} 
                            lng={attraction.coordinates.lng}
                            height="160px"
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
                        className="text-xs bg-white text-chiapas-dark px-2 py-1 rounded-full border border-chiapas-gold/30 hover:bg-chiapas-gold/10 transition-colors"
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
          
          {/* Formulario de itinerario */}
          {showItineraryForm && (
            <div className="bg-white rounded-xl p-4 border border-chiapas-gold/20 shadow-sm mb-4">
              <h4 className="font-bold text-sm text-chiapas-dark mb-3">Personaliza tu itinerario</h4>
              
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
                    <option value="8-14">8-14 días</option>
                    <option value="15+">15+ días</option>
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
                
                <div>
                  <label className="block text-gray-600 mb-1 text-xs">¿Qué presupuesto aproximado tienes?</label>
                  <select 
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm"
                  >
                    <option value="economico">Económico</option>
                    <option value="moderado">Moderado</option>
                    <option value="lujo">Premium</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <Button
                    className="w-full bg-chiapas-green hover:bg-chiapas-green/90 text-white"
                    onClick={() => handleSendMessage("Generar mi itinerario personalizado")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...
                      </>
                    ) : (
                      'Generar mi itinerario'
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
                <div className="w-2 h-2 bg-chiapas-green/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-chiapas-green/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-chiapas-green/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="ml-2">Escribiendo...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Área de entrada de texto */}
      <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
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
          className="bg-chiapas-green text-white h-9 w-9"
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