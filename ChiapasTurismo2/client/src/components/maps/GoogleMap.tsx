import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: 'naturaleza' | 'cultural' | 'gastronomia' | 'artesanias' | 'arqueologia';
  imageUrl?: string;
}

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  height?: string;
  showMultipleLocations?: boolean;
  locations?: MapLocation[];
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Iconos SVG codificados como URI para los marcadores
const CATEGORY_ICONS = {
  naturaleza: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#2E7D32"/>
      <path d="M9 12L11 14L15 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 5.5C8 5.5 9.5 7 12 7C14.5 7 16 5.5 16 5.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 7V19" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M8 11C8 11 9.5 13 12 13C14.5 13 16 11 16 11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  cultural: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#7B1FA2"/>
      <rect x="9" y="9" width="6" height="6" stroke="#FFFFFF" stroke-width="2" rx="1"/>
      <path d="M12 6V9" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M12 15V18" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M6 12H9" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M15 12H18" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `),
  gastronomia: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#F57C00"/>
      <path d="M6 10C6 10 8 6 12 6C16 6 18 10 18 10" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M6 12C6 12 8 16 12 16C16 16 18 12 18 12" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="9" y1="9" x2="9" y2="15" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="15" y1="9" x2="15" y2="15" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `),
  artesanias: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#C2185B"/>
      <path d="M8 8L16 16" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M16 8L8 16" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `),
  arqueologia: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#795548"/>
      <path d="M6 18L18 18" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M7 14L17 14" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M8 10L16 10" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M12 6L12 18" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `),
  default: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#1976D2"/>
      <circle cx="12" cy="10" r="3" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M12 13V17" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M9 17H15" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
  `)
};

const DEFAULT_CHIAPAS_LOCATIONS: MapLocation[] = [
  {
    id: 'sumidero',
    name: 'Cañón del Sumidero',
    lat: 16.8167,
    lng: -93.0833,
    description: 'Impresionante formación geológica con paredes que alcanzan los 1000 metros de altura. Este parque nacional ofrece recorridos en lancha para admirar la majestuosidad del cañón.',
    category: 'naturaleza',
    imageUrl: '/images/Cañon del sumidero.jpg'
  },
  {
    id: 'sancristobal',
    name: 'San Cristóbal de las Casas',
    lat: 16.7370,
    lng: -92.6376,
    description: 'Ciudad colonial con una rica herencia cultural. Sus calles empedradas, coloridas fachadas y mercados tradicionales ofrecen una experiencia única.',
    category: 'cultural',
    imageUrl: '/images/San cristobal de las casas.jpg'
  },
  {
    id: 'palenque',
    name: 'Zona Arqueológica de Palenque',
    lat: 17.4838,
    lng: -92.0389,
    description: 'Uno de los sitios arqueológicos mayas más impresionantes, rodeado de exuberante selva. Su arquitectura y relieves tallados muestran el esplendor de esta antigua civilización.',
    category: 'arqueologia',
    imageUrl: '/images/Palenque.jpg'
  },
  {
    id: 'aguaazul',
    name: 'Cascadas de Agua Azul',
    lat: 17.2506,
    lng: -92.1167,
    description: 'Serie de cascadas de agua turquesa, creadas por el río Xanil. Sus piscinas naturales permiten nadar en un entorno paradisíaco.',
    category: 'naturaleza',
    imageUrl: '/images/Cascadas de Agua Azu.jpg'
  },
  {
    id: 'montebello',
    name: 'Lagos de Montebello',
    lat: 16.1111,
    lng: -91.6667,
    description: 'Conjunto de lagos multicolores ubicados en un parque nacional con bosques de pino y encino. Cada lago presenta una tonalidad única de azul y verde.',
    category: 'naturaleza',
    imageUrl: '/images/Lagos de Montebello.jpg'
  },
  {
    id: 'chiapa',
    name: 'Chiapa de Corzo',
    lat: 16.7064,
    lng: -93.0145,
    description: 'Pueblo colonial conocido por su hermosa fuente mudéjar y por la Fiesta Grande, donde se realizan los tradicionales bailes de los Parachicos.',
    category: 'cultural',
    imageUrl: '/images/Chiapa de Corzo.jpg'
  },
  {
    id: 'misol',
    name: 'Cascada Misol-Ha',
    lat: 17.3750,
    lng: -92.0057,
    description: 'Espectacular caída de agua de 35 metros que desemboca en una piscina natural. Es posible caminar detrás de la cascada para obtener una vista única.',
    category: 'naturaleza',
    imageUrl: '/images/Misol-Ha.jpg'
  },
  {
    id: 'tonina',
    name: 'Zona Arqueológica de Toniná',
    lat: 16.9391,
    lng: -92.0056,
    description: 'Sitio arqueológico con una gran acrópolis en forma de laberinto que se eleva 80 metros sobre la plaza principal.',
    category: 'arqueologia',
    imageUrl: '/images/Tonina.jpg'
  }
];

export function GoogleMap({ 
  lat, 
  lng, 
  zoom = 14, 
  title = 'Ubicación', 
  height = '250px',
  showMultipleLocations = false,
  locations = DEFAULT_CHIAPAS_LOCATIONS
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const uniqueId = `map-${Math.random().toString(36).substring(2, 9)}`;
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('todos');
  
  // Filtrar ubicaciones por categoría
  const filteredLocations = currentCategory === 'todos' 
    ? locations 
    : locations.filter(loc => loc.category === currentCategory);

  useEffect(() => {
    // Cargar Google Maps API una vez
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        // La API se ha cargado, ahora inicializamos todos los mapas existentes
        const mapElements = document.querySelectorAll('[id^="map-"]');
        mapElements.forEach(mapElement => {
          if (mapElement.getAttribute('data-initialized') !== 'true') {
            initializeMap(mapElement as HTMLElement);
          }
        });
      };
      
      document.head.appendChild(script);
    } else {
      // Si la API ya está cargada, simplemente inicializar este mapa
      if (mapRef.current && mapRef.current.getAttribute('data-initialized') !== 'true') {
        initializeMap(mapRef.current);
      }
    }
    
    function initializeMap(element: HTMLElement) {
      if (!element) return;
      
      const lat = parseFloat(element.getAttribute('data-lat') || '0');
      const lng = parseFloat(element.getAttribute('data-lng') || '0');
      const zoom = parseInt(element.getAttribute('data-zoom') || '14');
      
      const mapOptions = {
        center: { lat, lng },
        zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        zoomControl: true,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      const map = new window.google.maps.Map(element, mapOptions);
      
      if (showMultipleLocations) {
        // Añadir múltiples marcadores
        const bounds = new window.google.maps.LatLngBounds();
        const infowindow = new window.google.maps.InfoWindow();
        
        filteredLocations.forEach((location) => {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            title: location.name,
            icon: {
              url: getCategoryIcon(location.category),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
              labelOrigin: new window.google.maps.Point(16, 40)
            },
            animation: window.google.maps.Animation.DROP
          });
          
          bounds.extend(marker.getPosition());
          
          marker.addListener('click', () => {
            setSelectedLocation(location);
            
            // Contenido mejorado para el infowindow
            const content = `
              <div style="padding: 12px; max-width: 250px; text-align: center; font-family: 'Arial', sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1e293b; font-weight: bold;">${location.name}</h3>
                <p style="font-size: 13px; line-height: 1.4; margin: 0; color: #475569;">${location.description.substring(0, 100)}${location.description.length > 100 ? '...' : ''}</p>
                <div style="margin-top: 10px;">
                  <a href="#" style="color: #059669; text-decoration: none; font-size: 13px; font-weight: medium;" 
                     onclick="document.getElementById('${uniqueId}').dispatchEvent(new CustomEvent('select-location', {detail: '${location.id}'})); return false;">
                    Ver más detalles
                  </a>
                </div>
              </div>
            `;
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
          });
        });
        
        // Añadir event listener personalizado
        element.addEventListener('select-location', (e: any) => {
          const locationId = e.detail;
          const location = locations.find(loc => loc.id === locationId);
          if (location) {
            setSelectedLocation(location);
          }
        });
        
        // Ajustar el mapa para mostrar todos los marcadores
        if (filteredLocations.length > 1) {
          map.fitBounds(bounds);
        } else if (filteredLocations.length === 1) {
          map.setCenter({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
          map.setZoom(10);
        }
      } else {
        // Añadir un solo marcador
        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title,
          icon: {
            url: CATEGORY_ICONS.default,
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          }
        });
      }
      
      // Marcar como inicializado
      element.setAttribute('data-initialized', 'true');
    }
  }, [lat, lng, zoom, title, showMultipleLocations, currentCategory, filteredLocations]);
  
  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'naturaleza':
        return CATEGORY_ICONS.naturaleza;
      case 'cultural':
        return CATEGORY_ICONS.cultural;
      case 'gastronomia':
        return CATEGORY_ICONS.gastronomia;
      case 'artesanias':
        return CATEGORY_ICONS.artesanias;
      case 'arqueologia':
        return CATEGORY_ICONS.arqueologia;
      default:
        return CATEGORY_ICONS.default;
    }
  }
  
  return (
    <div ref={mapContainerRef} className="w-full">
      {showMultipleLocations && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => setCurrentCategory('todos')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'todos' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setCurrentCategory('naturaleza')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'naturaleza' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Naturaleza
          </button>
          <button 
            onClick={() => setCurrentCategory('cultural')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'cultural' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Cultural
          </button>
          <button 
            onClick={() => setCurrentCategory('arqueologia')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'arqueologia' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Arqueología
          </button>
          <button 
            onClick={() => setCurrentCategory('gastronomia')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'gastronomia' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Gastronomía
          </button>
          <button 
            onClick={() => setCurrentCategory('artesanias')}
            className={`px-3 py-1 text-sm rounded-full ${currentCategory === 'artesanias' ? 'bg-chiapas-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Artesanías
          </button>
        </div>
      )}
      
      <div
        ref={mapRef}
        id={uniqueId}
        className="rounded-lg shadow-md overflow-hidden"
        style={{ height, width: '100%' }}
        data-lat={lat}
        data-lng={lng}
        data-zoom={zoom}
      ></div>
      
      {showMultipleLocations && selectedLocation && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md transform transition-transform duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {selectedLocation.imageUrl && (
              <img 
                src={selectedLocation.imageUrl} 
                alt={selectedLocation.name} 
                className="w-full md:w-1/3 rounded-md object-cover h-48 md:h-auto"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-chiapas-dark mr-2">{selectedLocation.name}</h3>
                {getCategoryBadge(selectedLocation.category)}
              </div>
              <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
              <div className="flex gap-3">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-chiapas-green hover:text-chiapas-green/80 font-medium"
                >
                  Ver en Google Maps
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <button 
                  onClick={() => window.open(`#trip-planner`, '_self')}
                  className="text-chiapas-gold hover:text-chiapas-gold/80 font-medium inline-flex items-center"
                >
                  Planear visita
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Función para obtener el badge según la categoría
function getCategoryBadge(category: string) {
  const badges = {
    naturaleza: {
      bg: 'bg-[#2E7D32]/10',
      text: 'text-[#2E7D32]',
      label: 'Naturaleza'
    },
    cultural: {
      bg: 'bg-[#7B1FA2]/10',
      text: 'text-[#7B1FA2]',
      label: 'Cultural'
    },
    gastronomia: {
      bg: 'bg-[#F57C00]/10',
      text: 'text-[#F57C00]',
      label: 'Gastronomía'
    },
    artesanias: {
      bg: 'bg-[#C2185B]/10',
      text: 'text-[#C2185B]',
      label: 'Artesanías'
    },
    arqueologia: {
      bg: 'bg-[#795548]/10',
      text: 'text-[#795548]',
      label: 'Arqueología'
    }
  };

  const badge = badges[category as keyof typeof badges] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: 'Punto de interés'
  };

  return (
    <span className={`${badge.bg} ${badge.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
      {badge.label}
    </span>
  );
}