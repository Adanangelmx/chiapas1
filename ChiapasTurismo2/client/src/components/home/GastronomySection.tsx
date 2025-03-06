import React from 'react';

export function GastronomySection() {
  return (
    <section id="gastronomia" className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Sabores de Chiapas</h2>
          <p className="text-lg max-w-3xl mx-auto">Una cocina que mezcla tradiciones prehispánicas, influencias coloniales y los abundantes productos de su tierra fértil.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img src="/images/tamales_chiapanecos.webp" alt="Tamales chiapanecos" className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-display text-xl font-bold mb-2">Tamales chiapanecos</h3>
              <p className="mb-2">Envueltos en hojas de plátano, los tamales de chipilín, de bola y juacanes son parte fundamental de la gastronomía local, preparados con masa de maíz y diversos rellenos.</p>
              <span className="text-sm font-accent bg-chiapas-gold/10 text-chiapas-dark px-3 py-1 rounded-full">Platillo tradicional</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img src="/images/Cochito horneado.jpg" alt="Cochito horneado" className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-display text-xl font-bold mb-2">Cochito horneado</h3>
              <p className="mb-2">Carne de cerdo marinada con achiote y especias, envuelta en hojas de plátano y cocida lentamente. Un platillo festivo que se sirve en celebraciones especiales.</p>
              <span className="text-sm font-accent bg-chiapas-red/10 text-chiapas-red px-3 py-1 rounded-full">Festividades</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img src="/images/Café de altura.jpg" alt="Café chiapaneco" className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-display text-xl font-bold mb-2">Café de altura</h3>
              <p className="mb-2">Reconocido internacionalmente, el café chiapaneco se cultiva en las montañas del Soconusco y la Sierra Madre. De aroma intenso y sabor equilibrado, es uno de los mejores del mundo.</p>
              <span className="text-sm font-accent bg-chiapas-green/10 text-chiapas-green px-3 py-1 rounded-full">Producto emblemático</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img src="/images/Pozol.jpg" alt="Pozol" className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-display text-xl font-bold mb-2">Pozol</h3>
              <p className="mb-2">Bebida refrescante preparada con masa de maíz fermentada y cacao. Se sirve frío y es consumido tradicionalmente por comunidades indígenas como alimento energético.</p>
              <span className="text-sm font-accent bg-chiapas-gold/10 text-chiapas-dark px-3 py-1 rounded-full">Bebida ancestral</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-chiapas-light rounded-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h3 className="font-display text-2xl font-bold mb-4">Ruta gastronómica chiapaneca</h3>
              <p className="mb-6">Embárcate en un viaje culinario por los sabores más auténticos de Chiapas. Visita mercados tradicionales, participa en clases de cocina y degusta platillos en restaurantes que preservan recetas centenarias.</p>
              <a href="#" className="inline-flex items-center bg-chiapas-gold hover:bg-chiapas-gold/90 text-chiapas-dark font-accent font-medium py-3 px-8 rounded-lg transition duration-300">
                Descubrir ruta gastronómica <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            <div className="md:w-1/2">
              <img src="/images/Gastronomía chiapaneca.jpg" alt="Gastronomía chiapaneca" className="w-full h-64 object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
