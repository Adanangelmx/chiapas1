import React from 'react';

export function CultureSection() {
  return (
    <section id="cultura" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-chiapas-light">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">La rica herencia cultural</h2>
            <p className="text-lg mb-6">Chiapas es un mosaico cultural donde conviven las tradiciones milenarias de sus pueblos originarios con expresiones modernas. Cada comunidad conserva su identidad a través de su lengua, vestimenta, artesanías y rituales.</p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-chiapas-gold/20 p-3 rounded-full mr-4">
                  <i className="fas fa-paint-brush text-chiapas-gold"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Artesanías tradicionales</h3>
                  <p>Desde textiles multicolores hasta ámbar, lacas, alfarería y talla en madera. Cada pieza refleja el profundo conocimiento ancestral y la cosmovisión maya.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-chiapas-gold/20 p-3 rounded-full mr-4">
                  <i className="fas fa-music text-chiapas-gold"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Festividades y tradiciones</h3>
                  <p>Vibrantes celebraciones como la Fiesta Grande de Chiapa de Corzo, el Carnaval Zoque y las ceremonias sincréticas que mezclan elementos prehispánicos y católicos.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-chiapas-gold/20 p-3 rounded-full mr-4">
                  <i className="fas fa-language text-chiapas-gold"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Diversidad lingüística</h3>
                  <p>Hogar de 12 de las 62 lenguas indígenas reconocidas en México, incluyendo tzotzil, tzeltal, ch'ol, tojolabal y zoque, manteniendo vivo el patrimonio intangible.</p>
                </div>
              </div>
            </div>
            
            <a href="#" className="inline-flex items-center bg-chiapas-red hover:bg-chiapas-red/90 text-white font-accent font-medium py-3 px-8 rounded-lg transition duration-300">
              Explorar más sobre la cultura <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
          
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/artesanias chiapanecas.JPG" alt="Artesanías chiapanecas" className="w-full h-60 object-cover rounded-lg shadow-lg" />
              <img src="/images/Danzantes tradicionales.jpg" alt="Danzantes tradicionales" className="w-full h-60 object-cover rounded-lg shadow-lg" />
              <img src="/images/Tejido tradicional.jpg" alt="Tejido tradicional" className="w-full h-60 object-cover rounded-lg shadow-lg" />
              <img src="/images/Mujer chiapaneca.JPG" alt="Mujer indígena chiapaneca" className="w-full h-60 object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
