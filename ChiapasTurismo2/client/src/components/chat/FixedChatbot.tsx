import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Bot, User, MapPin } from 'lucide-react';
import { GoogleMap } from '@/components/maps/GoogleMap';

// Interfaces para mapa y atracciones
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

interface FixedChatbotProps {
  initialQuery?: string;
}

export function FixedChatbot({ initialQuery = '' }: FixedChatbotProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Este efecto se ejecuta cuando se monta el componente
  useEffect(() => {
    // Si hay una consulta inicial, procesarla automáticamente
    if (initialQuery) {
      handleSubmit();
    } else {
      // Mostrar un mensaje de bienvenida
      const welcomeMessage: Message = {
        id: generateId(),
        content: '👋 ¡Hola! Soy tu guía turístico de Chiapas. Pregúntame sobre lugares para visitar, actividades, transportes, alojamiento, gastronomía o cualquier aspecto de tu viaje.',
        sender: 'bot',
        timestamp: new Date(),
        attractions: [{
          name: "San Cristóbal de las Casas",
          description: "Ciudad colonial en los altos de Chiapas",
          location: "Chiapas, México",
          coordinates: {
            lat: 16.737,
            lng: -92.6376
          }
        }]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Función para generar un ID único para cada mensaje
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Efecto para desplazamiento automático hacia abajo cuando llegan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      // Técnica mejorada para el scroll automático
      const scrollContainer = chatContainerRef.current;
      if (scrollContainer) {
        // Utilizamos setTimeout para asegurarnos que el DOM ha actualizado los mensajes
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  // Función para manejar el envío de mensajes
  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    if (!inputValue.trim()) return;

    // Agregar el mensaje del usuario al chat
    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Actualizar el estado con el mensaje del usuario
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsSubmitting(true);

    try {
      // Crear respuestas predefinidas basadas en palabras clave
      // Este enfoque no requiere API y garantiza respuestas inmediatas
      const userQuestion = userMessage.content.toLowerCase();
      let botResponse = "";
      let locationMatches: Attraction[] = [];
      
      // Buscar coincidencias de lugares en la pregunta
      const chiapasLocations = [
        { name: "San Cristóbal de las Casas", location: "Altos de Chiapas", 
          description: "Ciudad colonial en los altos de Chiapas",
          coordinates: { lat: 16.737, lng: -92.6376 },
          triggers: ["san cristóbal", "sancris", "san cristobal", "colonial"]
        },
        { name: "Palenque", location: "Norte de Chiapas", 
          description: "Zona arqueológica maya en la selva",
          coordinates: { lat: 17.4838, lng: -92.0436 },
          triggers: ["palenque", "ruinas", "maya", "arqueológic"]
        },
        { name: "Cascadas de Agua Azul", location: "Cerca de Palenque", 
          description: "Cascadas turquesas cerca de Palenque",
          coordinates: { lat: 17.2514, lng: -92.1133 },
          triggers: ["agua azul", "cascada", "cascadas", "catarata"]
        },
        { name: "Cañón del Sumidero", location: "Cerca de Tuxtla Gutiérrez", 
          description: "Impresionante cañón con paredes de hasta 1000 metros",
          coordinates: { lat: 16.8513, lng: -93.0777 },
          triggers: ["sumidero", "cañón", "canon", "lancha", "mirador"]
        },
        { name: "Lagos de Montebello", location: "Frontera con Guatemala", 
          description: "Lagos multicolores en la frontera con Guatemala",
          coordinates: { lat: 16.1119, lng: -91.6767 },
          triggers: ["montebello", "lagos", "lagunas", "colores"]
        }
      ];
      
      // Identificar lugares mencionados
      chiapasLocations.forEach(location => {
        location.triggers.forEach(trigger => {
          if (userQuestion.includes(trigger)) {
            locationMatches.push({
              name: location.name,
              description: location.description,
              location: location.location,
              coordinates: location.coordinates
            });
          }
        });
      });
      
      // Eliminar duplicados
      locationMatches = locationMatches.filter((loc, index, self) => 
        index === self.findIndex(t => t.name === loc.name)
      );
      
      // Si no se encontraron coincidencias específicas, agregar San Cristóbal por defecto
      if (locationMatches.length === 0) {
        locationMatches.push({
          name: "San Cristóbal de las Casas",
          description: "Ciudad colonial en los altos de Chiapas",
          location: "Chiapas, México",
          coordinates: {
            lat: 16.737,
            lng: -92.6376
          }
        });
      }
      
      // Generar respuesta según palabras clave
      if (userQuestion.includes("hotel") || userQuestion.includes("hosped") || userQuestion.includes("aloja") || userQuestion.includes("dormir")) {
        botResponse = `🏨 **Alojamiento en Chiapas:**\n\n` +
          `En **San Cristóbal de las Casas** encuentras opciones para todos los presupuestos:\n` +
          `- **Económicos:** Rossco Backpackers, Posada del Abuelito ($300-800 MXN)\n` +
          `- **Gama media:** Hotel Casa Vieja, Hotel Posada del Carmen ($1,000-1,800 MXN)\n` +
          `- **Gama alta:** Hotel Bo, Casa del Alma ($2,000-3,500 MXN)\n\n` +
          `En **Palenque**:\n` +
          `- Chan-Kah Resort Village (cerca de la zona arqueológica)\n` +
          `- Hotel Tulijá Express\n\n` +
          `**Recomendación:** Reserva con anticipación, especialmente en temporada alta (diciembre-enero, Semana Santa y verano).`;
      } 
      else if (userQuestion.includes("comida") || userQuestion.includes("comer") || userQuestion.includes("gastronom") || userQuestion.includes("plato") || userQuestion.includes("restaurant")) {
        botResponse = `🍽️ **Gastronomía de Chiapas:**\n\n` +
          `Platillos imperdibles:\n` +
          `- **Cochito al horno:** Cerdo horneado con especias locales\n` +
          `- **Tamales chiapanecos:** Envueltos en hoja de plátano\n` +
          `- **Sopa de pan:** Tradicional de San Cristóbal\n` +
          `- **Pozol:** Bebida refrescante de maíz y cacao\n` +
          `- **Queso bola de Ocosingo:** Queso regional único\n\n` +
          `Restaurantes recomendados en San Cristóbal:\n` +
          `- El Fogón de Jovel (comida tradicional)\n` +
          `- TierrAdentro (cocina indígena contemporánea)\n` +
          `- La Viña de Bacco (tapas y vinos)\n\n` +
          `El café de Chiapas es reconocido mundialmente. ¡No dejes de probarlo!`;
      }
      else if (userQuestion.includes("llegar") || userQuestion.includes("transport") || userQuestion.includes("mover") || userQuestion.includes("autobus") || userQuestion.includes("carro")) {
        botResponse = `🚌 **Cómo moverte por Chiapas:**\n\n` +
          `**Llegada a Chiapas:**\n` +
          `- **Avión:** Aeropuertos en Tuxtla Gutiérrez y Palenque\n` +
          `- **Autobús:** Conexiones desde CDMX, Oaxaca, Veracruz y Yucatán\n\n` +
          `**Transporte interno:**\n` +
          `- **Colectivos:** Económicos para distancias cortas ($10-40 MXN)\n` +
          `- **Autobuses OCC/ADO:** Para rutas principales ($150-400 MXN)\n` +
          `- **Combis:** Conectan poblaciones cercanas ($20-60 MXN)\n\n` +
          `**San Cristóbal a Palenque:** 5hrs en autobús ($200-300 MXN)\n` +
          `**Tuxtla a San Cristóbal:** 1hr en colectivo ($70 MXN) o autobús ($100 MXN)\n\n` +
          `✅ En San Cristóbal, el centro es peatonal y puedes recorrerlo caminando.`;
      }
      else if (userQuestion.includes("clima") || userQuestion.includes("llovi") || userQuestion.includes("temporada") || userQuestion.includes("cuando") || userQuestion.includes("mes")) {
        botResponse = `🌤️ **Clima en Chiapas:**\n\n` +
          `La mejor época para visitar San Cristóbal es de noviembre a abril (temporada seca).\n\n` +
          `**Por zonas:**\n` +
          `- **Altos (San Cristóbal):** Clima fresco (10-22°C). Lleva abrigo para las noches.\n` +
          `- **Selva y Palenque:** Cálido y húmedo (24-34°C). Época seca ideal (nov-abr).\n` +
          `- **Costa (Tapachula):** Tropical caluroso (28-35°C).\n\n` +
          `**Estaciones:**\n` +
          `- **Temporada seca:** Noviembre a abril\n` +
          `- **Temporada de lluvias:** Mayo a octubre (lluvias por la tarde)\n\n` +
          `Primavera 2024: Condiciones mayormente secas, tardes cálidas y noches frescas en San Cristóbal.`;
      }
      else if (userQuestion.includes("artesania") || userQuestion.includes("comprar") || userQuestion.includes("souvenir") || userQuestion.includes("recuerdo") || userQuestion.includes("textil")) {
        botResponse = `🧶 **Artesanías de Chiapas:**\n\n` +
          `Chiapas ofrece una rica tradición artesanal. Recomendaciones:\n\n` +
          `- **Textiles:** Zinacantán y Chamula destacan por sus bordados coloridos y huipiles.\n` +
          `- **Ámbar:** San Cristóbal tiene numerosas tiendas con certificación de autenticidad.\n` +
          `- **Cerámica:** Amatitlán produce hermosas piezas tradicionales.\n` +
          `- **Lacados:** Chiapa de Corzo es famosa por sus jícaras y bateas decoradas.\n\n` +
          `**Dónde comprar en San Cristóbal:**\n` +
          `- Mercado de Santo Domingo (junto al templo)\n` +
          `- Calle Real de Guadalupe (tiendas con precios fijos)\n` +
          `- Cooperativa Sna Jolobil (textiles auténticos a precios justos)\n\n` +
          `✅ Regatear es aceptable en mercados, pero respeta el valor del trabajo artesanal.`;
      }
      else {
        // Respuesta genérica para cualquier otra consulta
        botResponse = `¡Hola! Bienvenido a tu guía virtual de Chiapas. 😊\n\n` +
          `Chiapas es un estado fascinante con muchísimos atractivos:\n\n` +
          `🏙️ **Ciudades coloniales:** San Cristóbal de las Casas, Chiapa de Corzo, Comitán\n` +
          `🏞️ **Naturaleza:** Cañón del Sumidero, Lagos de Montebello, Cascadas Agua Azul y El Chiflón\n` +
          `🏛️ **Sitios arqueológicos:** Palenque, Yaxchilán, Bonampak, Toniná\n` +
          `👨‍👩‍👧‍👦 **Culturas vivas:** Comunidades tzotziles, tzeltales y lacandones\n` +
          `🍽️ **Gastronomía:** Cochito al horno, tamales chiapanecos, pozol, café de altura\n\n` +
          `Para ayudarte mejor, puedes preguntarme sobre:\n` +
          `- Hoteles y alojamiento\n` +
          `- Gastronomía y restaurantes\n` +
          `- Transporte y cómo moverte\n` +
          `- Clima y mejor temporada\n` +
          `- Artesanías y compras\n\n` +
          `O sobre destinos específicos como San Cristóbal, Palenque o el Cañón del Sumidero.`;
      }
      
      // Crear el mensaje del bot
      const botMessage: Message = {
        id: generateId(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        attractions: locationMatches
      };

      // Actualizar el estado con la respuesta del bot
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      
      // Mostrar mensaje de error
      toast({
        title: "Error",
        description: "Ocurrió un problema al procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      
      // Agregar un mensaje de error al chat
      const errorMessage: Message = {
        id: generateId(),
        content: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta de nuevo.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Formato de tiempo para los mensajes
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4" ref={chatContainerRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } p-4 rounded-lg`}
                >
                  <div className="mt-1">
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="chat-message">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\n/g, '<br />'),
                        }}
                      />
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {/* Mostrar mapa con atracciones si hay alguna */}
                    {message.attractions && message.attractions.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-col gap-2 mb-2">
                          <p className="text-sm font-medium">Ubicaciones mencionadas:</p>
                          {message.attractions.map((attr, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-sm">
                              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold">{attr.name}</span> - {attr.description}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="h-48 mt-2 rounded-md overflow-hidden">
                          <GoogleMap
                            lat={message.attractions[0].coordinates.lat}
                            lng={message.attractions[0].coordinates.lng}
                            zoom={10}
                            height="100%"
                            showMultipleLocations={true}
                            locations={message.attractions.map((attr, idx) => ({
                              id: idx.toString(),
                              name: attr.name,
                              lat: attr.coordinates.lat,
                              lng: attr.coordinates.lng,
                              description: attr.description,
                              category: "cultural"
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta sobre Chiapas..."
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting || !inputValue.trim()}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}