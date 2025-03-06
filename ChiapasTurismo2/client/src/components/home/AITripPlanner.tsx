import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { MapPin, Route, Navigation } from 'lucide-react';

// Definición de gtag para analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
  }
}

// Definiciones de tipo mejoradas con descripciones para SEO
interface TripFormData {
  experienceType: string; // Tipo de experiencia: aventura, cultural, etc.
  duration: string;       // Duración del viaje en días
  destinations: string;   // Destinos específicos en Chiapas
  budget: string;         // Presupuesto aproximado para el viaje
}

interface AIResponse {
  itinerary: {
    title: string;
    seasonInfo?: {
      bestTime: string;
      currentSeason: string;
      weatherTips: string;
    };
    days: Array<{
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
    }>;
    recommendations: string[];
    hiddenGems?: string[];
    totalBudgetEstimate?: {
      accommodation: string;
      food: string;
      transportation: string;
      activities: string;
      total: string;
    };
  };
}

export function AITripPlanner() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TripFormData>({
    experienceType: 'aventura',
    duration: '4-7',
    destinations: '',
    budget: 'moderado'
  });
  const [itinerary, setItinerary] = useState<AIResponse['itinerary'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  // Función auxiliar para determinar coordenadas aproximadas de lugares en Chiapas
  const getApproximateCoordinates = (locationName: string): {lat: number, lng: number} => {
    const locations: Record<string, {lat: number, lng: number}> = {
      'San Cristóbal': {lat: 16.7370, lng: -92.6376},
      'Palenque': {lat: 17.4838, lng: -92.0389},
      'Sumidero': {lat: 16.8167, lng: -93.0833},
      'Agua Azul': {lat: 17.2506, lng: -92.1167},
      'Montebello': {lat: 16.1111, lng: -91.6667},
      'Chiapa de Corzo': {lat: 16.7064, lng: -93.0145},
      'Misol-Ha': {lat: 17.3750, lng: -92.0057},
      'Toniná': {lat: 16.9391, lng: -92.0056},
      'Tuxtla': {lat: 16.7512, lng: -93.1151},
      'Comitán': {lat: 16.2511, lng: -92.1336},
      'Ocosingo': {lat: 16.9072, lng: -92.0964},
      'Selva Lacandona': {lat: 16.6025, lng: -91.0001}
    };
    
    // Buscar coincidencias parciales en el nombre del lugar
    for (const [key, coords] of Object.entries(locations)) {
      if (locationName.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }
    
    // Si no hay coincidencia, devolver coordenadas centrales de Chiapas
    return {lat: 16.5, lng: -92.5};
  };
  
  // Función para determinar categoría basada en la descripción
  const getCategoryFromDescription = (description: string): 'naturaleza' | 'cultural' | 'gastronomia' | 'artesanias' | 'arqueologia' => {
    description = description.toLowerCase();
    
    if (description.includes('selva') || description.includes('cascada') || description.includes('parque') || 
        description.includes('río') || description.includes('montaña') || description.includes('lago')) {
      return 'naturaleza';
    }
    
    if (description.includes('museo') || description.includes('iglesia') || description.includes('colonial') || 
        description.includes('tradición') || description.includes('festival')) {
      return 'cultural';
    }
    
    if (description.includes('comida') || description.includes('restaurante') || description.includes('gastronóm') || 
        description.includes('platillo') || description.includes('mercado')) {
      return 'gastronomia';
    }
    
    if (description.includes('arqueológic') || description.includes('maya') || description.includes('ruina') || 
        description.includes('zona arqueológic')) {
      return 'arqueologia';
    }
    
    if (description.includes('artesaní') || description.includes('textil') || description.includes('taller') || 
        description.includes('ámbar') || description.includes('artesano')) {
      return 'artesanias';
    }
    
    // Categoría por defecto
    return 'cultural';
  };

  // Manejo de cambios en inputs y selecciones
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error si el usuario está corrigiendo entradas
    if (formError) {
      setFormError(null);
    }
  };

  // Generación de itinerario con validación
  const generateItinerary = async () => {
    try {
      // Validación básica
      if (!formData.experienceType || !formData.duration || !formData.budget) {
        setFormError('Por favor completa todos los campos requeridos');
        return;
      }
      
      setIsLoading(true);
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
      setItinerary(data.itinerary);
      setIsLoading(false);
      
      // Desplazar la página al itinerario generado
      setTimeout(() => {
        if (itineraryRef.current) {
          itineraryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Registro de analytics (si existiera)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_itinerary', {
          'event_category': 'engagement',
          'event_label': formData.experienceType,
          'value': 1
        });
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error en el planificador',
        description: 'No se pudo generar el itinerario. Por favor intenta nuevamente en unos minutos.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const downloadItinerary = (format = 'pdf') => {
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
      // Formato PDF (nuevo)
      const element = itineraryRef.current;
      if (!element) return;

      // Crear un estilo temporal para mejor presentación en PDF
      const originalStyle = element.style.cssText;
      element.style.cssText = `
        background-color: white;
        color: black;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px;
        margin: 0 auto;
      `;

      html2canvas(element, { 
        scale: 2,
        backgroundColor: "#ffffff"
      }).then(canvas => {
        // Restaurar estilo original
        element.style.cssText = originalStyle;

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

  // Componente de itinerario que se muestra después de generarlo
  const ItineraryDisplay = () => {
    if (!itinerary) return null;
    
    return (
      <div 
        ref={itineraryRef} 
        className="bg-white rounded-xl shadow-lg p-8 mt-8 max-w-4xl mx-auto"
        itemScope 
        itemType="https://schema.org/TouristTrip"
      >
        <h3 
          className="text-2xl md:text-3xl font-bold mb-4 text-center text-chiapas-dark" 
          itemProp="name"
        >
          {itinerary.title}
        </h3>
        
        {itinerary.seasonInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Información de temporada</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700">Mejor época para visitar</p>
                <p className="text-blue-900">{itinerary.seasonInfo.bestTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Temporada actual</p>
                <p className="text-blue-900">{itinerary.seasonInfo.currentSeason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Consejos de clima</p>
                <p className="text-blue-900">{itinerary.seasonInfo.weatherTips}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          {itinerary.days.map((day, index) => (
            <div 
              key={`day-${index}`} 
              className="border-b border-gray-200 pb-6 mb-6 last:border-0"
              itemProp="itinerary"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <div 
                className="flex items-center mb-3"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <div className="bg-chiapas-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  {day.day}
                </div>
                <h4 className="text-xl font-bold text-chiapas-dark" itemProp="name">{day.title}</h4>
              </div>
              
              <p className="mb-4 text-gray-700" itemProp="description">{day.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {day.accommodation && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-chiapas-dark mb-2">Alojamiento</h5>
                    <p className="text-sm text-gray-700"><span className="font-medium">Lugar:</span> {day.accommodation.name}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Tipo:</span> {day.accommodation.type}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Precio:</span> {day.accommodation.priceRange}</p>
                  </div>
                )}
                
                {day.transportation && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-chiapas-dark mb-2">Transporte</h5>
                    <p className="text-sm text-gray-700"><span className="font-medium">Tipo:</span> {day.transportation.type}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Duración:</span> {day.transportation.duration}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Costo:</span> {day.transportation.cost}</p>
                  </div>
                )}
                
                {day.meals && day.meals.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-chiapas-dark mb-2">Comidas recomendadas</h5>
                    <div className="space-y-2">
                      {day.meals.map((meal, i) => (
                        <div key={`meal-${i}`} className="text-sm">
                          <p className="font-medium text-chiapas-dark">{meal.type}</p>
                          <p className="text-gray-700">{meal.recommendation} - {meal.dish}</p>
                          <p className="text-gray-600 text-xs">{meal.priceRange}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-bold text-chiapas-dark mb-3 border-b border-gray-200 pb-2">Recomendaciones adicionales</h4>
            <ul className="list-disc pl-5 space-y-1">
              {itinerary.recommendations.map((rec, i) => (
                <li key={`rec-${i}`} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
          
          {itinerary.hiddenGems && itinerary.hiddenGems.length > 0 && (
            <div>
              <h4 className="font-bold text-chiapas-dark mb-3 border-b border-gray-200 pb-2">Lugares poco conocidos</h4>
              <ul className="list-disc pl-5 space-y-1">
                {itinerary.hiddenGems.map((gem, i) => (
                  <li key={`gem-${i}`} className="text-gray-700">{gem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {itinerary.totalBudgetEstimate && (
          <div className="bg-amber-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-amber-800 mb-3 text-center">Estimación de presupuesto total</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm font-medium text-amber-700">Alojamiento</p>
                <p className="text-amber-900 font-bold">{itinerary.totalBudgetEstimate.accommodation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Comidas</p>
                <p className="text-amber-900 font-bold">{itinerary.totalBudgetEstimate.food}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Transporte</p>
                <p className="text-amber-900 font-bold">{itinerary.totalBudgetEstimate.transportation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Actividades</p>
                <p className="text-amber-900 font-bold">{itinerary.totalBudgetEstimate.activities}</p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-amber-100 p-2 rounded">
                <p className="text-sm font-medium text-amber-800">TOTAL</p>
                <p className="text-amber-900 font-bold text-lg">{itinerary.totalBudgetEstimate.total}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Mapa del itinerario - Visualización del recorrido */}
        <div className="mt-8 mb-6">
          <h4 className="font-bold text-chiapas-dark mb-4 text-center flex items-center justify-center">
            <Route className="h-5 w-5 mr-2 text-chiapas-green" />
            Visualiza tu ruta de viaje
          </h4>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <GoogleMap 
              lat={16.7370} // Centro aproximado de Chiapas (San Cristóbal)
              lng={-92.6376}
              zoom={8}
              showMultipleLocations={true}
              locations={itinerary.days.map((day, index) => {
                // Extraer nombre del lugar del título del día
                const locationName = day.title.split(' - ')[1] || day.title;
                // Asignar coordenadas aproximadas basadas en lugares conocidos de Chiapas
                // Esto es una simplificación - en un caso real se usarían coordenadas reales
                const coordinates = getApproximateCoordinates(locationName);
                
                return {
                  id: `day-${day.day}`,
                  name: `Día ${day.day}: ${locationName}`,
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                  description: day.description.substring(0, 120) + '...',
                  category: getCategoryFromDescription(day.description),
                };
              })}
              height="400px"
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            * Esta visualización es aproximada y muestra los principales puntos de tu itinerario.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Este itinerario fue generado el {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} y puede estar sujeto a cambios según disponibilidad y condiciones climáticas.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="trip-planner" 
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-chiapas-light to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Contenido SEO oculto para motores de búsqueda */}
        <div className="sr-only">
          <h2>Planificador de Viajes a Chiapas - Crea tu Itinerario Personalizado</h2>
          <p>
            Utiliza nuestra herramienta gratuita impulsada por IA para crear un itinerario de viaje personalizado 
            a Chiapas. Incluye recomendaciones de alojamiento, gastronomía, transporte y actividades adaptadas 
            a tu presupuesto y preferencias.
          </p>
          <p>
            Destinos populares: San Cristóbal de las Casas, Palenque, Cañón del Sumidero, 
            Cascadas de Agua Azul, Lagos de Montebello, Selva Lacandona.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-2">
              <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                IMPULSADO POR IA
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-2 text-chiapas-dark">Planifica tu viaje a Chiapas</h2>
            <p className="text-center text-chiapas-gray mb-8 max-w-2xl mx-auto">
              Nuestro asistente con inteligencia artificial creará un itinerario personalizado según tus preferencias e intereses.
            </p>
            
            {!itinerary ? (
              <div className="bg-chiapas-light/50 rounded-xl p-6 md:p-8 border border-chiapas-green/10">
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
                    {formError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label htmlFor="experienceType" className="block text-sm font-medium text-chiapas-dark">
                      ¿Qué tipo de experiencia buscas?
                    </label>
                    <select 
                      id="experienceType"
                      name="experienceType" 
                      value={formData.experienceType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chiapas-green focus:ring-chiapas-green text-base"
                      aria-label="Selecciona el tipo de experiencia"
                    >
                      <option value="aventura">Aventura y naturaleza</option>
                      <option value="cultural">Cultura e historia</option>
                      <option value="relajación">Relajación y bienestar</option>
                      <option value="familiar">Viaje familiar</option>
                      <option value="gastronómica">Experiencia gastronómica</option>
                      <option value="completa">Experiencia completa</option>
                    </select>
                    
                    <label htmlFor="duration" className="block text-sm font-medium text-chiapas-dark">
                      ¿Cuánto tiempo planeas quedarte?
                    </label>
                    <select 
                      id="duration"
                      name="duration" 
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chiapas-green focus:ring-chiapas-green text-base"
                      aria-label="Selecciona la duración del viaje"
                    >
                      <option value="1-3">1-3 días (escapada corta)</option>
                      <option value="4-7">4-7 días (semana)</option>
                      <option value="8-14">8-14 días (vacaciones)</option>
                      <option value="15+">15+ días (experiencia inmersiva)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label htmlFor="destinations" className="block text-sm font-medium text-chiapas-dark">
                      ¿Tienes destinos específicos en mente? (opcional)
                    </label>
                    <input 
                      id="destinations"
                      type="text" 
                      name="destinations" 
                      value={formData.destinations}
                      onChange={handleInputChange}
                      placeholder="Ej: San Cristóbal, Palenque, Cañón del Sumidero..."
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chiapas-green focus:ring-chiapas-green text-base"
                      aria-label="Ingresa destinos específicos (opcional)"
                    />
                    
                    <label htmlFor="budget" className="block text-sm font-medium text-chiapas-dark">
                      ¿Cuál es tu presupuesto aproximado?
                    </label>
                    <select 
                      id="budget"
                      name="budget" 
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chiapas-green focus:ring-chiapas-green text-base"
                      aria-label="Selecciona tu presupuesto"
                    >
                      <option value="económico">Económico (mochilero)</option>
                      <option value="moderado">Moderado (turista promedio)</option>
                      <option value="premium">Premium (experiencia de lujo)</option>
                      <option value="mixto">Mixto (combinación de opciones)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={generateItinerary}
                    disabled={isLoading}
                    className="px-6 py-3 bg-chiapas-green hover:bg-chiapas-green/90 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                    aria-label="Generar itinerario personalizado"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando itinerario...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Crear itinerario personalizado
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-6 bg-chiapas-green/5 rounded-lg p-4 text-sm text-chiapas-dark">
                  <h3 className="font-bold mb-2">¿Por qué usar nuestro planificador?</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Itinerarios personalizados según tus intereses y presupuesto</li>
                    <li>Recomendaciones de alojamiento adaptadas a tu presupuesto</li>
                    <li>Sugerencias gastronómicas para probar lo mejor de Chiapas</li>
                    <li>Opciones de transporte y detalles logísticos</li>
                    <li>Incluye lugares poco conocidos fuera de las rutas turísticas típicas</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-2 justify-end mb-6">
                  <button 
                    onClick={() => downloadItinerary('pdf')}
                    className="flex items-center justify-center text-sm bg-chiapas-gold/80 hover:bg-chiapas-gold text-black font-medium rounded px-4 py-2 transition-colors"
                    aria-label="Descargar itinerario en formato PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Descargar PDF
                  </button>
                  <button 
                    onClick={() => downloadItinerary('md')}
                    className="flex items-center justify-center text-sm bg-white hover:bg-chiapas-light/30 border border-gray-300 rounded px-4 py-2 transition-colors"
                    aria-label="Descargar itinerario en formato Markdown"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                    Descargar Markdown
                  </button>
                  <button 
                    onClick={() => setItinerary(null)}
                    className="flex items-center justify-center text-sm bg-white hover:bg-gray-100 border border-gray-300 rounded px-4 py-2 transition-colors"
                    aria-label="Crear un nuevo itinerario"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Crear nuevo itinerario
                  </button>
                </div>
                
                <ItineraryDisplay />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}