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

interface WorkingChatbotProps {
  initialQuery?: string;
}

export function WorkingChatbot({ initialQuery = '' }: WorkingChatbotProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Este efecto se ejecuta cuando se monta el componente
  useEffect(() => {
    // Si hay una consulta inicial, procesarla automáticamente después de un pequeño retraso
    if (initialQuery) {
      setTimeout(() => {
        setInputValue(initialQuery);
        handleSubmit();
      }, 500);
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
    if (messagesEndRef.current && chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current;
      const scrollToBottom = () => {
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      };
      
      // Usar requestAnimationFrame para asegurar que el DOM se haya actualizado
      requestAnimationFrame(() => {
        scrollToBottom();
        // Doble confirmación con setTimeout
        setTimeout(scrollToBottom, 100);
      });
    }
  }, [messages]);

  /**
   * Base de conocimiento para el chatbot
   * Mapa de palabras clave a respuestas predefinidas
   */
  const knowledgeBase = {
    // Categoría: Museos
    museos: {
      general: `🏛️ **Museos en Chiapas:**\n\n` +
        `**San Cristóbal de las Casas:**\n` +
        `- **Museo Na Bolom:** Casa-museo dedicada a la cultura lacandona y maya\n` +
        `- **Museo del Ámbar:** Exhibición de piezas de ámbar chiapaneco\n` +
        `- **Centro Cultural El Carmen:** Exposiciones de arte contemporáneo\n` +
        `- **Museo de las Culturas Populares:** Tradiciones y artesanías locales\n\n` +
        `**Tuxtla Gutiérrez:**\n` +
        `- **Museo Regional de Chiapas:** Historia y arqueología\n` +
        `- **Museo del Café:** Historia y proceso del café chiapaneco\n\n` +
        `**Comitán:**\n` +
        `- **Museo Arqueológico de Comitán:** Piezas mayas de la región\n` +
        `- **Museo de Arte Hermila Domínguez:** Arte regional\n` +
        `- **Museo Rosario Castellanos:** Dedicado a la escritora comiteca\n` +
        `- **Casa Museo Dr. Belisario Domínguez:** Historia del héroe nacional\n\n` +
        `**Palenque:**\n` +
        `- **Museo de Sitio de Palenque:** Artefactos mayas encontrados en la zona arqueológica`,
      comitan: `🏛️ **Museos en Comitán de Domínguez:**\n\n` +
        `1. **Museo Arqueológico de Comitán:** Exhibe piezas arqueológicas de la región, principalmente mayas.\n\n` +
        `2. **Museo Rosario Castellanos:** Dedicado a la famosa escritora comiteca, con objetos personales y obras.\n\n` +
        `3. **Casa Museo Dr. Belisario Domínguez:** Casa natal del héroe nacional con exposición de documentos históricos y objetos personales.\n\n` +
        `4. **Museo de Arte Hermila Domínguez de Castellanos:** Obras de arte regional y exposiciones temporales.\n\n` +
        `5. **Museo de Arte Sacro:** Colección de objetos religiosos de la época colonial.\n\n` +
        `Horario general: Martes a domingo de 9:00 a 17:00 hrs.\n` +
        `Costo: Entre $20-50 MXN, algunos gratuitos los domingos.`,
      palenque: `🏛️ **Museos en Palenque:**\n\n` +
        `1. **Museo de Sitio de Palenque "Alberto Ruz Lhuillier":** Ubicado en la entrada de la zona arqueológica, muestra hallazgos importantes como la réplica de la tumba del Rey Pakal. Costo incluido en el boleto de la zona arqueológica.\n\n` +
        `2. **Museo del Textil:** Pequeño museo que muestra técnicas tradicionales de tejido maya.\n\n` +
        `Palenque es más conocido por su extraordinaria zona arqueológica que por sus museos. La visita al sitio arqueológico es la atracción principal.`,
      tuxtla: `🏛️ **Museos en Tuxtla Gutiérrez:**\n\n` +
        `1. **Museo Regional de Chiapas:** Historia natural y arqueología de la región. Exhibe piezas mayas y zoques.\n\n` +
        `2. **Museo del Café:** Historia y proceso del café chiapaneco, con degustación.\n\n` +
        `3. **Museo Botánico:** Flora nativa y ecosistemas de Chiapas.\n\n` +
        `4. **Museo de la Marimba:** Dedicado al instrumento emblemático de Chiapas.\n\n` +
        `5. **Planetario Tuxtla:** Ciencia y astronomía, con proyecciones diarias.\n\n` +
        `6. **Museo de Paleontología:** Fósiles y restos prehistóricos encontrados en Chiapas.\n\n` +
        `Ubicación: La mayoría se encuentran en el centro de la ciudad o cerca del Parque Madero.`
    },
    
    // Categoría: Hoteles y alojamiento
    alojamiento: {
      general: `🏨 **Alojamiento en Chiapas:**\n\n` +
        `En **San Cristóbal de las Casas** encuentras opciones para todos los presupuestos:\n` +
        `- **Económicos:** Rossco Backpackers, Posada del Abuelito ($300-800 MXN)\n` +
        `- **Gama media:** Hotel Casa Vieja, Hotel Posada del Carmen ($1,000-1,800 MXN)\n` +
        `- **Gama alta:** Hotel Bo, Casa del Alma ($2,000-3,500 MXN)\n\n` +
        `En **Palenque**:\n` +
        `- Chan-Kah Resort Village (cerca de la zona arqueológica)\n` +
        `- Hotel Tulijá Express\n` +
        `- Hotel Chablis (opciones económicas en la ciudad)\n\n` +
        `En **Tuxtla Gutiérrez**:\n` +
        `- Marriott Tuxtla Gutiérrez\n` +
        `- Hilton Garden Inn\n` +
        `- Holiday Inn\n\n` +
        `**Recomendación:** Reserva con anticipación, especialmente en temporada alta (diciembre-enero, Semana Santa y verano).`,
      economico: `💰 **Hospedaje Económico en Chiapas:**\n\n` +
        `**San Cristóbal de las Casas:**\n` +
        `- **Posada del Abuelito:** Desde $300 MXN, ambiente familiar, desayuno incluido\n` +
        `- **Rossco Backpackers:** Desde $180 MXN en dormitorio, cocina compartida\n` +
        `- **Hostal Casa Gaia:** Desde $250 MXN, céntrico\n\n` +
        `**Palenque:**\n` +
        `- **Hostal Cañada:** Desde $150 MXN en dormitorio\n` +
        `- **Hotel Maya Tulipanes:** Desde $500 MXN, piscina incluida\n\n` +
        `**Comitán:**\n` +
        `- **Hotel San José:** Desde $400 MXN, céntrico\n` +
        `- **Hotel Santa María:** Desde $350 MXN\n\n` +
        `**Consejos:**\n` +
        `- Temporada baja (mayo-noviembre) ofrece mejores precios\n` +
        `- Busca lugares con cocina compartida para ahorrar en comidas\n` +
        `- Hostales suelen ofrecer tours con descuento`,
      lujo: `✨ **Hoteles de Lujo en Chiapas:**\n\n` +
        `**San Cristóbal de las Casas:**\n` +
        `- **Hotel Bo:** Boutique de diseño contemporáneo, desde $3,000 MXN. Excelente restaurante gourmet.\n` +
        `- **Casa del Alma:** Hotel boutique colonial con spa, desde $2,500 MXN.\n` +
        `- **Hotel Museo Na Bolom:** Antigua hacienda histórica, desde $2,000 MXN.\n\n` +
        `**Palenque:**\n` +
        `- **Chan-Kah Resort Village:** Resort en medio de la selva, desde $2,200 MXN. Cuenta con piscina y spa.\n` +
        `- **Villa Mercedes Palenque:** Hotel 5 estrellas, desde $1,800 MXN.\n\n` +
        `**Tuxtla Gutiérrez:**\n` +
        `- **Marriott Tuxtla Gutiérrez:** Hotel 5 estrellas, desde $2,500 MXN.\n` +
        `- **Hilton Garden Inn:** Moderno y elegante, desde $2,200 MXN.\n\n` +
        `**Servicios premium comunes:** Spa, piscina, restaurantes gourmet, wifi de alta velocidad, servicio a la habitación 24/7.`
    },
    
    // Categoría: Gastronomía
    gastronomia: {
      general: `🍽️ **Gastronomía de Chiapas:**\n\n` +
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
        `El café de Chiapas es reconocido mundialmente. ¡No dejes de probarlo!`,
      comida_tipica: `🌮 **Comida Típica de Chiapas:**\n\n` +
        `**Platillos principales:**\n` +
        `- **Cochito al horno:** Cerdo adobado con especias y horneado lentamente\n` +
        `- **Tamales juacanes:** Rellenos de frijol y chipilín\n` +
        `- **Chanfaina:** Guiso de vísceras de cordero\n` +
        `- **Pepita con tasajo:** Carne seca en salsa de pepitas de calabaza\n` +
        `- **Puchero:** Caldo de res con verduras\n\n` +
        `**Bebidas típicas:**\n` +
        `- **Pozol:** Bebida de maíz fermentado (blanco o con cacao)\n` +
        `- **Tascalate:** Bebida de maíz, achiote, canela y cacao\n` +
        `- **Comiteco:** Licor destilado de agave\n` +
        `- **Café de altura:** De las regiones del Soconusco y Margaritas\n\n` +
        `**Dulces tradicionales:**\n` +
        `- Nuégados (de maíz con miel)\n` +
        `- Chimbo (bizcocho tradicional)\n` +
        `- Dulces de fruta cristalizada`,
      restaurantes: `🍴 **Mejores Restaurantes en Chiapas:**\n\n` +
        `**San Cristóbal de las Casas:**\n` +
        `- **El Fogón de Jovel:** Cocina chiapaneca tradicional, $$ (Real de Guadalupe)\n` +
        `- **TierrAdentro:** Cocina indígena contemporánea, $$ (Calle Insurgentes)\n` +
        `- **Restaurante LUM:** Alta cocina chiapaneca, $$$ (Hotel Bo)\n` +
        `- **Cacao Nativa:** Cocina mexicana creativa, $$ (Plaza 31 de Marzo)\n\n` +
        `**Palenque:**\n` +
        `- **La Selva:** Cocina regional, $$ (Centro)\n` +
        `- **Restaurant Bajlum:** Cocina mexicana e internacional, $$ (Hotel Ciudad Real)\n\n` +
        `**Tuxtla Gutiérrez:**\n` +
        `- **Los Jarrones:** Cocina chiapaneca de autor, $$$ (Blvd. Belisario Domínguez)\n` +
        `- **El Mesón del Recuerdo:** Cocina regional, $$ (Centro)\n\n` +
        `**Comitán:**\n` +
        `- **Restaurante San Martín:** Cocina regional, $$ (Centro)\n` +
        `- **Cominteco:** Cocina local, $ (Calle Central)`
    },
    
    // Categoría: Transporte
    transporte: {
      general: `🚌 **Cómo moverte por Chiapas:**\n\n` +
        `**Llegada a Chiapas:**\n` +
        `- **Avión:** Aeropuertos en Tuxtla Gutiérrez y Palenque\n` +
        `- **Autobús:** Conexiones desde CDMX, Oaxaca, Veracruz y Yucatán\n\n` +
        `**Transporte interno:**\n` +
        `- **Colectivos:** Económicos para distancias cortas ($10-40 MXN)\n` +
        `- **Autobuses OCC/ADO:** Para rutas principales ($150-400 MXN)\n` +
        `- **Combis:** Conectan poblaciones cercanas ($20-60 MXN)\n\n` +
        `**San Cristóbal a Palenque:** 5hrs en autobús ($200-300 MXN)\n` +
        `**Tuxtla a San Cristóbal:** 1hr en colectivo ($70 MXN) o autobús ($100 MXN)\n\n` +
        `✅ En San Cristóbal, el centro es peatonal y puedes recorrerlo caminando.`,
      aeropuertos: `✈️ **Aeropuertos en Chiapas:**\n\n` +
        `**Aeropuerto Internacional Ángel Albino Corzo (TGZ):**\n` +
        `- Ubicación: A 35 km de Tuxtla Gutiérrez\n` +
        `- Aerolíneas: Aeroméxico, Volaris, VivaAerobus\n` +
        `- Conexiones: Ciudad de México, Monterrey, Guadalajara, Cancún, Tijuana\n` +
        `- Al centro: Taxi ($350 MXN) o colectivo ($50 MXN)\n\n` +
        `**Aeropuerto Internacional de Palenque:**\n` +
        `- Ubicación: A 10 km de Palenque\n` +
        `- Aerolíneas: Calafia, Interjet (operaciones limitadas)\n` +
        `- Conexiones: Ciudad de México, Villahermosa\n` +
        `- Al centro: Taxi ($200 MXN)\n\n` +
        `**Recomendaciones:**\n` +
        `- Reserva vuelos con al menos 1 mes de anticipación para mejores tarifas\n` +
        `- Desde el aeropuerto de Tuxtla también hay servicios directos a San Cristóbal ($250 MXN)`,
      distancias: `🗺️ **Distancias y tiempos entre destinos principales en Chiapas:**\n\n` +
        `**Tuxtla Gutiérrez a San Cristóbal:** 85 km - 1 hora\n` +
        `**San Cristóbal a Palenque:** 220 km - 5 horas\n` +
        `**San Cristóbal a Comitán:** 90 km - 1.5 horas\n` +
        `**Comitán a Lagos de Montebello:** 55 km - 1 hora\n` +
        `**Palenque a Cascadas de Agua Azul:** 70 km - 1.5 horas\n` +
        `**Tuxtla a Cañón del Sumidero:** 15 km - 25 minutos\n` +
        `**San Cristóbal a Chamula:** 10 km - 20 minutos\n` +
        `**Palenque a Bonampak:** 150 km - 3 horas\n` +
        `**Bonampak a Yaxchilán:** 25 km (+1 hora en lancha) - Total 2 horas\n\n` +
        `⚠️ **Nota:** Los tiempos pueden variar según condiciones del camino y tráfico. Para la zona de la Selva Lacandona (Bonampak, Yaxchilán), es recomendable contratar tours.`
    },
    
    // Categoría: Clima
    clima: {
      general: `🌤️ **Clima en Chiapas:**\n\n` +
        `La mejor época para visitar San Cristóbal es de noviembre a abril (temporada seca).\n\n` +
        `**Por zonas:**\n` +
        `- **Altos (San Cristóbal):** Clima fresco (10-22°C). Lleva abrigo para las noches.\n` +
        `- **Selva y Palenque:** Cálido y húmedo (24-34°C). Época seca ideal (nov-abr).\n` +
        `- **Costa (Tapachula):** Tropical caluroso (28-35°C).\n\n` +
        `**Estaciones:**\n` +
        `- **Temporada seca:** Noviembre a abril\n` +
        `- **Temporada de lluvias:** Mayo a octubre (lluvias por la tarde)\n\n` +
        `Primavera 2024: Condiciones mayormente secas, tardes cálidas y noches frescas en San Cristóbal.`,
      mejor_epoca: `📅 **Mejor época para visitar Chiapas:**\n\n` +
        `**Temporada Alta (Mejor clima):**\n` +
        `- **Noviembre a abril:** Temporada seca con días soleados y menor probabilidad de lluvia\n` +
        `- **Diciembre-enero:** Ideal pero con mayor afluencia de turistas y precios más altos\n` +
        `- **Semana Santa:** Festividades locales pero saturación turística\n\n` +
        `**Temporada Baja:**\n` +
        `- **Mayo a octubre:** Temporada de lluvias, generalmente por las tardes\n` +
        `- **Septiembre:** Mes más lluvioso, algunas atracciones pueden tener acceso limitado\n\n` +
        `**Recomendaciones por destino:**\n` +
        `- **San Cristóbal:** Noviembre a febrero para disfrutar el clima fresco sin lluvias\n` +
        `- **Palenque y Selva:** Enero a marzo para menor humedad y mosquitos\n` +
        `- **Cascadas (Agua Azul, El Chiflón):** Mejor en temporada seca cuando el agua está más azul\n\n` +
        `**Fiestas destacadas:**\n` +
        `- **Enero:** Fiesta Grande de Chiapa de Corzo (8-23 enero)\n` +
        `- **Carnaval Zoque:** Febrero (fecha variable)\n` +
        `- **Feria de Comitán:** Octubre`
    },
    
    // Categoría: Artesanías
    artesanias: {
      general: `🧶 **Artesanías de Chiapas:**\n\n` +
        `Chiapas ofrece una rica tradición artesanal. Recomendaciones:\n\n` +
        `- **Textiles:** Zinacantán y Chamula destacan por sus bordados coloridos y huipiles.\n` +
        `- **Ámbar:** San Cristóbal tiene numerosas tiendas con certificación de autenticidad.\n` +
        `- **Cerámica:** Amatitlán produce hermosas piezas tradicionales.\n` +
        `- **Lacados:** Chiapa de Corzo es famosa por sus jícaras y bateas decoradas.\n\n` +
        `**Dónde comprar en San Cristóbal:**\n` +
        `- Mercado de Santo Domingo (junto al templo)\n` +
        `- Calle Real de Guadalupe (tiendas con precios fijos)\n` +
        `- Cooperativa Sna Jolobil (textiles auténticos a precios justos)\n\n` +
        `✅ Regatear es aceptable en mercados, pero respeta el valor del trabajo artesanal.`,
      textiles: `🧵 **Textiles de Chiapas:**\n\n` +
        `Los textiles son una de las expresiones artísticas más importantes de Chiapas:\n\n` +
        `**Tipos de textiles:**\n` +
        `- **Huipiles:** Blusas tradicionales con elaborados bordados\n` +
        `- **Rebozos:** Chales con diseños únicos de cada comunidad\n` +
        `- **Faldas ceremoniales:** Con patrones geométricos y simbólicos\n` +
        `- **Manteles y tapetes:** Con bordados multicolores\n\n` +
        `**Comunidades textileras:**\n` +
        `- **Zinacantán:** Bordados florales coloridos sobre fondo negro\n` +
        `- **Chamula:** Prendas de lana negra con bordados discretos\n` +
        `- **Tenejapa:** Diseños intrincados en rojo sobre fondo blanco\n` +
        `- **Venustiano Carranza:** Técnica de brocado única\n\n` +
        `**Dónde comprar textiles auténticos:**\n` +
        `- **Cooperativa Sna Jolobil:** Garantía de autenticidad y pago justo a artesanas\n` +
        `- **Mercado de Santo Domingo:** Gran variedad (verifica autenticidad)\n` +
        `- **Centro de Textiles del Mundo Maya:** Exhibición y venta\n` +
        `- **Visitas directas a comunidades:** Experiencia completa`
    },
    
    // Categoría: Atracciones principales
    atracciones: {
      general: `🏞️ **Principales atracciones de Chiapas:**\n\n` +
        `**Naturales:**\n` +
        `- **Cañón del Sumidero:** Impresionantes formaciones rocosas y paseo en lancha\n` +
        `- **Cascadas de Agua Azul:** Caídas de agua turquesa en cascada\n` +
        `- **Lagos de Montebello:** 56 lagos de colores espectaculares\n` +
        `- **El Chiflón:** Cascadas con caída de 120 metros\n` +
        `- **Selva Lacandona:** Una de las últimas selvas primarias de México\n\n` +
        `**Arqueológicas:**\n` +
        `- **Palenque:** Impresionante ciudad maya en la selva\n` +
        `- **Yaxchilán:** Ruinas a orillas del río Usumacinta\n` +
        `- **Bonampak:** Famosa por sus murales mayas\n` +
        `- **Toniná:** Pirámide de 75m de altura\n\n` +
        `**Ciudades y pueblos:**\n` +
        `- **San Cristóbal de las Casas:** Ciudad colonial en los altos\n` +
        `- **Chiapa de Corzo:** Pueblo Mágico con arquitectura colonial\n` +
        `- **San Juan Chamula:** Comunidad indígena con tradiciones únicas\n\n` +
        `Para una experiencia completa, se recomienda al menos 7 días en Chiapas.`,
      san_cristobal: `🏙️ **San Cristóbal de las Casas:**\n\n` +
        `**Principales atracciones:**\n` +
        `1. **Catedral de San Cristóbal:** Fachada amarilla característica, siglo XVI\n` +
        `2. **Templo de Santo Domingo:** Impresionante fachada barroca y mercado de artesanías\n` +
        `3. **Andador Eclesiástico:** Calle peatonal con cafés y tiendas\n` +
        `4. **Museo Na Bolom:** Casa-museo sobre los lacandones\n` +
        `5. **El Arcotete:** Parque natural con arco de piedra natural\n` +
        `6. **Orquídeas Moxviquil:** Jardín botánico con orquídeas locales\n` +
        `7. **Museo del Ámbar:** Historia del ámbar chiapaneco\n` +
        `8. **Mercado Municipal:** Productos locales y gastronomía\n\n` +
        `**Cerca de San Cristóbal:**\n` +
        `- **San Juan Chamula:** Comunidad indígena a 10km\n` +
        `- **Zinacantán:** Pueblo textilero a 12km\n` +
        `- **Cañón del Sumidero:** A 1 hora en carro\n\n` +
        `**Recomendación:** Dedica al menos 3 días a San Cristóbal y sus alrededores.`,
      palenque: `🏛️ **Zona Arqueológica de Palenque:**\n\n` +
        `**Características:**\n` +
        `- Ciudad maya del período Clásico (200-900 d.C.)\n` +
        `- Patrimonio Mundial de la UNESCO desde 1987\n` +
        `- Rodeada de exuberante selva tropical\n` +
        `- Famosa por sus inscripciones jeroglíficas\n\n` +
        `**Estructuras principales:**\n` +
        `1. **Templo de las Inscripciones:** Tumba del rey Pakal\n` +
        `2. **El Palacio:** Complejo residencial y administrativo con torre astronómica\n` +
        `3. **Templo del Sol:** Parte de la Tríada\n` +
        `4. **Templo de la Cruz:** Importante centro ceremonial\n` +
        `5. **Templo de la Cruz Foliada:** Completa la Tríada\n` +
        `6. **Grupo Norte:** Menos visitado pero fascinante\n\n` +
        `**Información práctica:**\n` +
        `- **Horario:** 8:00 a 17:00, todos los días\n` +
        `- **Entrada:** $80 MXN (tarifa general) + $45 MXN (video)\n` +
        `- **Mejor horario:** Temprano en la mañana para evitar calor y multitudes\n` +
        `- **Guías:** Disponibles en la entrada ($500-700 MXN por grupo)\n` +
        `- **Tiempo recomendado:** 3-4 horas mínimo para recorrer el sitio\n\n` +
        `**Consejos:**\n` +
        `- Lleva agua, protector solar, repelente y calzado cómodo\n` +
        `- La temporada seca (nov-abr) ofrece mejores condiciones\n` +
        `- Museo de Sitio (incluido en el boleto) muestra artefactos valiosos`,
      sumidero: `🏞️ **Cañón del Sumidero:**\n\n` +
        `**Características:**\n` +
        `- Formación geológica de paredes de hasta 1,000 metros de altura\n` +
        `- Extensión de 13 km a lo largo del río Grijalva\n` +
        `- Símbolo de Chiapas (aparece en el escudo estatal)\n` +
        `- Más de 300 especies de flora y fauna\n\n` +
        `**Cómo visitarlo:**\n` +
        `1. **Paseo en lancha desde Chiapa de Corzo:** \n` +
        `   - Duración: 2 horas aproximadamente\n` +
        `   - Precio: $250 MXN por persona\n` +
        `   - Horario: 8:00 a 16:00 hrs\n\n` +
        `2. **Miradores panorámicos:** \n` +
        `   - 5 miradores accesibles por carretera desde Tuxtla\n` +
        `   - Entrada: $35 MXN\n\n` +
        `**Atracciones durante el recorrido:**\n` +
        `- Cascada Árbol de Navidad (formación natural)\n` +
        `- Cueva del Silencio\n` +
        `- Cueva de Colores\n` +
        `- Observación de cocodrilos, monos y aves\n\n` +
        `**Recomendaciones:**\n` +
        `- Llevar protector solar, gorra y agua\n` +
        `- Temprano en la mañana ofrece mejor iluminación para fotos\n` +
        `- Combinar con visita al Pueblo Mágico de Chiapa de Corzo`
    },
    
    // Categoría: Comunidades indígenas
    indigenas: {
      general: `👪 **Comunidades indígenas de Chiapas:**\n\n` +
        `Chiapas es uno de los estados con mayor diversidad cultural en México:\n\n` +
        `**Principales grupos étnicos:**\n` +
        `- **Tzotziles:** San Juan Chamula, Zinacantán (cerca de San Cristóbal)\n` +
        `- **Tzeltales:** Tenejapa, Oxchuc, Cancuc\n` +
        `- **Lacandones:** Selva Lacandona (Nahá, Metzabok, Lacanjá)\n` +
        `- **Choles:** Norte de Chiapas, región de Palenque\n` +
        `- **Zoques:** Noroeste de Chiapas\n` +
        `- **Tojolabales:** Región cercana a Comitán\n\n` +
        `**Visitas culturales recomendadas:**\n` +
        `1. **San Juan Chamula:** Iglesia sincrética única (no se permiten fotos dentro)\n` +
        `2. **Zinacantán:** Centro textil importante, visita a talleres familiares\n` +
        `3. **Comunidad Lacandona:** Tours guiados a Lacanjá para conocer su modo de vida\n\n` +
        `**Recomendaciones:**\n` +
        `- Contrata guías locales autorizados para visitas respetuosas\n` +
        `- Pide permiso antes de tomar fotografías\n` +
        `- Compra artesanías directamente a los productores`,
      chamula: `🏛️ **San Juan Chamula:**\n\n` +
        `**Sobre la comunidad:**\n` +
        `- Comunidad tzotzil a 10 km de San Cristóbal\n` +
        `- Autogobierno con usos y costumbres tradicionales\n` +
        `- Sincretismo religioso único (mezcla de catolicismo y creencias prehispánicas)\n\n` +
        `**Puntos de interés:**\n` +
        `1. **Iglesia de San Juan Bautista:** \n` +
        `   - Interior sin bancas, cubierto de pino y velas\n` +
        `   - Rituales de curación con pox (aguardiente local) y Coca-Cola\n` +
        `   - No se permiten fotografías en el interior (respeto)\n\n` +
        `2. **Mercado tradicional:** \n` +
        `   - Jueves y domingos (días principales)\n` +
        `   - Venta de productos locales, textiles y artesanías\n\n` +
        `3. **Cementerio:** Con cruces coloridas y elementos simbólicos\n\n` +
        `**Cómo visitar:**\n` +
        `- **Transporte:** Colectivos desde San Cristóbal ($20 MXN)\n` +
        `- **Entrada a la iglesia:** $25 MXN por persona\n` +
        `- **Guía recomendado:** $200-300 MXN para explicaciones culturales\n\n` +
        `**Importante:**\n` +
        `- Actitud respetuosa (es un sitio religioso activo)\n` +
        `- No tomar fotos sin permiso\n` +
        `- Vestir modestamente\n` +
        `- Evitar comportamientos que puedan considerarse ofensivos`,
      zinacantan: `🧵 **Zinacantán:**\n\n` +
        `**Sobre la comunidad:**\n` +
        `- Pueblo tzotzil a 12 km de San Cristóbal\n` +
        `- Famoso por sus floridos textiles y cultivo de flores\n` +
        `- Nombre significa "Tierra de murciélagos" en náhuatl\n\n` +
        `**Puntos de interés:**\n` +
        `1. **Iglesia de San Lorenzo:** \n` +
        `   - Decoración floral elaborada\n` +
        `   - Mezcla de elementos católicos y mayas\n` +
        `   - Ceremonias coloridas especialmente domingos\n\n` +
        `2. **Talleres textiles familiares:** \n` +
        `   - Demostración de tejido en telar de cintura\n` +
        `   - Explicación de símbolos y técnicas ancestrales\n` +
        `   - Oportunidad de comprar directamente a artesanas\n\n` +
        `3. **Invernaderos:** La comunidad es productora de flores\n\n` +
        `**Cómo visitar:**\n` +
        `- **Transporte:** Colectivos desde San Cristóbal ($15 MXN)\n` +
        `- **Visita a taller familiar:** $20-50 MXN (incluye demostración y bebida tradicional)\n` +
        `- **Tours organizados:** $250-350 MXN desde San Cristóbal (combinado con Chamula)\n\n` +
        `**Características de sus textiles:**\n` +
        `- Fondo negro con bordados multicolores de flores\n` +
        `- Técnica de brocado (hilos integrados durante el tejido)\n` +
        `- Diseños que reflejan su entorno natural\n` +
        `- Prendas como huipiles, rebozos, blusas y bolsas`
    },
    
    // Destinos generales
    destinos: {
      general: `¡Hola! Bienvenido a tu guía virtual de Chiapas. 😊\n\n` +
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
        `O sobre destinos específicos como San Cristóbal, Palenque o el Cañón del Sumidero.`,
      rutas: `🚗 **Rutas recomendadas por Chiapas:**\n\n` +
        `**Ruta 7 días (Completa):**\n` +
        `- Día 1-3: San Cristóbal + comunidades indígenas (Chamula y Zinacantán)\n` +
        `- Día 4: Cañón del Sumidero y Chiapa de Corzo\n` +
        `- Día 5: Traslado a Palenque, visita a Cascadas Agua Azul y Misol-Ha\n` +
        `- Día 6: Zona arqueológica de Palenque\n` +
        `- Día 7: Bonampak y Yaxchilán (opcional)\n\n` +
        `**Ruta 5 días (Esencial):**\n` +
        `- Día 1-2: San Cristóbal y alrededores\n` +
        `- Día 3: Cañón del Sumidero\n` +
        `- Día 4-5: Palenque y Cascadas Agua Azul\n\n` +
        `**Ruta 3 días (Express):**\n` +
        `- Día 1: San Cristóbal y comunidades cercanas\n` +
        `- Día 2: Cañón del Sumidero\n` +
        `- Día 3: Lagos de Montebello o El Chiflón\n\n` +
        `**Ruta Lagos y Selva (7 días):**\n` +
        `- Día 1-2: San Cristóbal\n` +
        `- Día 3: Lagos de Montebello\n` +
        `- Día 4: Cascadas El Chiflón y Comitán\n` +
        `- Día 5-6: Palenque y Cascadas\n` +
        `- Día 7: Bonampak y Yaxchilán\n\n` +
        `**Consejos:**\n` +
        `- Las distancias en Chiapas pueden ser largas por carreteras sinuosas\n` +
        `- Moverse entre San Cristóbal y Palenque toma un día completo (5 horas)\n` +
        `- Considerar tours organizados para optimizar tiempo`
    }
  };

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
      // Procesamiento de la consulta del usuario
      const userQuestion = userMessage.content.toLowerCase();
      let botResponse = "";
      let locationMatches: Attraction[] = [];
      
      // Buscar coincidencias de lugares en la pregunta
      const chiapasLocations = [
        { name: "San Cristóbal de las Casas", location: "Altos de Chiapas", 
          description: "Ciudad colonial en los altos de Chiapas",
          coordinates: { lat: 16.737, lng: -92.6376 },
          triggers: ["san cristóbal", "sancris", "san cristobal", "colonial", "altos"]
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
        },
        { name: "Comitán", location: "Sureste de Chiapas", 
          description: "Ciudad colonial cerca de la frontera con Guatemala",
          coordinates: { lat: 16.2548, lng: -92.1336 },
          triggers: ["comitán", "comitan", "comiteco"]
        },
        { name: "Tuxtla Gutiérrez", location: "Centro de Chiapas", 
          description: "Capital del estado de Chiapas",
          coordinates: { lat: 16.7521, lng: -93.1152 },
          triggers: ["tuxtla", "capital", "gutierrez"]
        },
        { name: "San Juan Chamula", location: "Cerca de San Cristóbal", 
          description: "Comunidad indígena tzotzil con tradiciones únicas",
          coordinates: { lat: 16.7900, lng: -92.6882 },
          triggers: ["chamula", "chamulas", "tzotzil", "indigena"]
        },
        { name: "Zinacantán", location: "Cerca de San Cristóbal", 
          description: "Comunidad indígena famosa por sus textiles",
          coordinates: { lat: 16.7676, lng: -92.7085 },
          triggers: ["zinacantan", "zinacantecos", "textil"]
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
      
      // Buscar respuestas específicas para la consulta
      
      // 1. Museos
      if (userQuestion.includes("museo") || userQuestion.includes("cultural") || userQuestion.includes("exposicion")) {
        if (userQuestion.includes("comitan") || userQuestion.includes("comitán")) {
          botResponse = knowledgeBase.museos.comitan;
        } else if (userQuestion.includes("palenque")) {
          botResponse = knowledgeBase.museos.palenque;
        } else if (userQuestion.includes("tuxtla")) {
          botResponse = knowledgeBase.museos.tuxtla;
        } else {
          botResponse = knowledgeBase.museos.general;
        }
      }
      // 2. Alojamiento
      else if (userQuestion.includes("hotel") || userQuestion.includes("hosped") || userQuestion.includes("aloja") || userQuestion.includes("dormir") || userQuestion.includes("quedar")) {
        if (userQuestion.includes("barato") || userQuestion.includes("económic") || userQuestion.includes("econom") || userQuestion.includes("presupuesto")) {
          botResponse = knowledgeBase.alojamiento.economico;
        } else if (userQuestion.includes("lujo") || userQuestion.includes("cinco estrellas") || userQuestion.includes("5 estrellas") || userQuestion.includes("boutique")) {
          botResponse = knowledgeBase.alojamiento.lujo;
        } else {
          botResponse = knowledgeBase.alojamiento.general;
        }
      }
      // 3. Gastronomía
      else if (userQuestion.includes("comida") || userQuestion.includes("comer") || userQuestion.includes("gastronom") || userQuestion.includes("plato") || userQuestion.includes("restaurant") || userQuestion.includes("tipico") || userQuestion.includes("típico")) {
        if (userQuestion.includes("tipic") || userQuestion.includes("típic") || userQuestion.includes("tradicional")) {
          botResponse = knowledgeBase.gastronomia.comida_tipica;
        } else if (userQuestion.includes("restaurant") || userQuestion.includes("mejor") || userQuestion.includes("lugar") || userQuestion.includes("comer")) {
          botResponse = knowledgeBase.gastronomia.restaurantes;
        } else {
          botResponse = knowledgeBase.gastronomia.general;
        }
      }
      // 4. Transporte
      else if (userQuestion.includes("llegar") || userQuestion.includes("transport") || userQuestion.includes("mover") || userQuestion.includes("autobus") || userQuestion.includes("carro") || userQuestion.includes("avion")) {
        if (userQuestion.includes("avion") || userQuestion.includes("avión") || userQuestion.includes("aeropuerto") || userQuestion.includes("vuelo")) {
          botResponse = knowledgeBase.transporte.aeropuertos;
        } else if (userQuestion.includes("distancia") || userQuestion.includes("tiempo") || userQuestion.includes("lejos") || userQuestion.includes("horas") || userQuestion.includes("kilómetros")) {
          botResponse = knowledgeBase.transporte.distancias;
        } else {
          botResponse = knowledgeBase.transporte.general;
        }
      }
      // 5. Clima
      else if (userQuestion.includes("clima") || userQuestion.includes("llovi") || userQuestion.includes("temporada") || userQuestion.includes("cuando") || userQuestion.includes("mes") || userQuestion.includes("lluvia")) {
        if (userQuestion.includes("mejor") || userQuestion.includes("época") || userQuestion.includes("epoca") || userQuestion.includes("recomend") || userQuestion.includes("temporada")) {
          botResponse = knowledgeBase.clima.mejor_epoca;
        } else {
          botResponse = knowledgeBase.clima.general;
        }
      }
      // 6. Artesanías
      else if (userQuestion.includes("artesania") || userQuestion.includes("comprar") || userQuestion.includes("souvenir") || userQuestion.includes("recuerdo") || userQuestion.includes("textil") || userQuestion.includes("ámbar")) {
        if (userQuestion.includes("textil") || userQuestion.includes("telar") || userQuestion.includes("ropa") || userQuestion.includes("bordado")) {
          botResponse = knowledgeBase.artesanias.textiles;
        } else {
          botResponse = knowledgeBase.artesanias.general;
        }
      }
      // 7. Atracciones específicas
      else if (userQuestion.includes("atraccion") || userQuestion.includes("ver") || userQuestion.includes("visitar") || userQuestion.includes("turistic") || userQuestion.includes("conocer")) {
        if (userQuestion.includes("san cristóbal") || userQuestion.includes("san cristobal") || userQuestion.includes("sancris")) {
          botResponse = knowledgeBase.atracciones.san_cristobal;
        } else if (userQuestion.includes("palenque") || userQuestion.includes("arqueológic") || userQuestion.includes("ruina") || userQuestion.includes("maya")) {
          botResponse = knowledgeBase.atracciones.palenque;
        } else if (userQuestion.includes("sumidero") || userQuestion.includes("cañon") || userQuestion.includes("cañón") || userQuestion.includes("lancha")) {
          botResponse = knowledgeBase.atracciones.sumidero;
        } else {
          botResponse = knowledgeBase.atracciones.general;
        }
      }
      // 8. Comunidades indígenas
      else if (userQuestion.includes("indigen") || userQuestion.includes("comunidad") || userQuestion.includes("chamula") || userQuestion.includes("zinacantan") || userQuestion.includes("tzotzil") || userQuestion.includes("tzeltal")) {
        if (userQuestion.includes("chamula") || userQuestion.includes("san juan")) {
          botResponse = knowledgeBase.indigenas.chamula;
        } else if (userQuestion.includes("zinacantan") || userQuestion.includes("zinacantán")) {
          botResponse = knowledgeBase.indigenas.zinacantan;
        } else {
          botResponse = knowledgeBase.indigenas.general;
        }
      }
      // 9. Rutas y Planificación
      else if (userQuestion.includes("ruta") || userQuestion.includes("itinerario") || userQuestion.includes("dias") || userQuestion.includes("días") || userQuestion.includes("planificar") || userQuestion.includes("recorrido")) {
        botResponse = knowledgeBase.destinos.rutas;
      }
      // 10. Respuesta predeterminada si no hay coincidencias específicas
      else {
        botResponse = knowledgeBase.destinos.general;
      }
      
      // Si no se encontraron coincidencias específicas de ubicación, agregar San Cristóbal por defecto
      if (locationMatches.length === 0) {
        // Buscar ubicaciones mencionadas en la respuesta para el mapa
        chiapasLocations.forEach(location => {
          const normalizedResponse = botResponse.toLowerCase();
          location.triggers.forEach(trigger => {
            if (normalizedResponse.includes(trigger) && 
                !locationMatches.some(match => match.name === location.name)) {
              locationMatches.push({
                name: location.name,
                description: location.description,
                location: location.location,
                coordinates: location.coordinates
              });
            }
          });
        });
        
        // Si aún no hay ubicaciones, usar San Cristóbal como default
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
      }
      
      // Limitar a 3 ubicaciones para evitar sobrecarga visual
      if (locationMatches.length > 3) {
        locationMatches = locationMatches.slice(0, 3);
      }
      
      // Crear el mensaje del bot
      const botMessage: Message = {
        id: generateId(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        attractions: locationMatches
      };

      // Pequeño delay para simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 500));

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