import React from 'react';
import { GoogleMap } from '@/components/maps/GoogleMap';

export function DestinationsSection() {
  // Coordenadas centrales de Chiapas
  const chiapasCenter = {
    lat: 16.7519,
    lng: -92.6189
  };
  
  return (
    <section id="destinos" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-chiapas-green/10 text-chiapas-green px-4 py-1 rounded-full font-accent text-sm mb-4 inline-block">Destinos</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-chiapas-dark">Explora los tesoros de Chiapas</h2>
          <p className="text-lg max-w-3xl mx-auto text-chiapas-gray">Desde las majestuosas ruinas mayas hasta cascadas de ensueño, Chiapas ofrece una diversidad de experiencias para todos los viajeros.</p>
        </div>
        
        <div className="bg-chiapas-light/50 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-2xl font-display font-bold mb-4 text-chiapas-dark">Mapa Interactivo</h3>
          <p className="mb-6 text-chiapas-gray">Explora los destinos más emblemáticos de Chiapas. Selecciona una categoría y haz clic en los marcadores para obtener más información.</p>
          
          <div className="h-[500px]">
            <GoogleMap 
              lat={chiapasCenter.lat}
              lng={chiapasCenter.lng}
              zoom={8}
              height="500px"
              showMultipleLocations={true}
            />
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="/images/San cristobal de las casas.jpg" alt="San Cristóbal de las Casas" className="w-full h-48 object-cover" />
            <div className="p-5">
              <span className="text-xs font-semibold text-chiapas-green bg-chiapas-green/10 px-2 py-1 rounded-full">Pueblo Mágico</span>
              <h3 className="text-xl font-bold mt-2 mb-2">San Cristóbal de las Casas</h3>
              <p className="text-chiapas-gray text-sm mb-3">Ciudad colonial de calles empedradas y coloridas casas que conserva su rica herencia cultural. Explora su catedral, mercados tradicionales y ambiente bohemio.</p>
              <a href="#" className="text-chiapas-green hover:text-chiapas-green/80 font-medium text-sm">Descubrir más →</a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="/images/Palenque.jpg" alt="Zona Arqueológica de Palenque" className="w-full h-48 object-cover" />
            <div className="p-5">
              <span className="text-xs font-semibold text-chiapas-green bg-chiapas-green/10 px-2 py-1 rounded-full">Patrimonio UNESCO</span>
              <h3 className="text-xl font-bold mt-2 mb-2">Zona Arqueológica de Palenque</h3>
              <p className="text-chiapas-gray text-sm mb-3">Impresionante sitio arqueológico maya rodeado de selva tropical. Sus templos, palacios y esculturas revelan el esplendor de esta antigua civilización.</p>
              <a href="#" className="text-chiapas-green hover:text-chiapas-green/80 font-medium text-sm">Descubrir más →</a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="/images/Cañon del sumidero.jpg" alt="Cañón del Sumidero" className="w-full h-48 object-cover" />
            <div className="p-5">
              <span className="text-xs font-semibold text-chiapas-green bg-chiapas-green/10 px-2 py-1 rounded-full">Maravilla Natural</span>
              <h3 className="text-xl font-bold mt-2 mb-2">Cañón del Sumidero</h3>
              <p className="text-chiapas-gray text-sm mb-3">Espectacular formación geológica con paredes que alcanzan hasta 1000 metros de altura. Los recorridos en lancha ofrecen vistas impresionantes y avistamiento de fauna.</p>
              <a href="#" className="text-chiapas-green hover:text-chiapas-green/80 font-medium text-sm">Descubrir más →</a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <a href="#trip-planner" className="inline-flex items-center px-6 py-3 bg-chiapas-green hover:bg-chiapas-green/90 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
            Planifica tu viaje con IA
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
