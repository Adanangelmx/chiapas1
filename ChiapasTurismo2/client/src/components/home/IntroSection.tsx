import React from 'react';

export function IntroSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-chiapas-light relative overflow-hidden">
      {/* Elemento decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-chiapas-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-chiapas-dark">
              <span className="text-chiapas-green">Chiapas</span>, tierra de maravillas
            </h2>
            <p className="text-lg mb-6">Ubicado en el sureste mexicano, Chiapas es un estado de contrastes y abundancia natural. Sus paisajes van desde selvas tropicales hasta montañas brumosas, albergando una biodiversidad única y una herencia cultural milenaria.</p>
            <p className="text-lg mb-8">Cuna de la civilización maya, Chiapas conserva vestigios arqueológicos impresionantes, tradiciones vivas y una gastronomía exquisita que refleja su historia y la riqueza de su tierra.</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-chiapas-green/10 text-chiapas-green px-4 py-2 rounded-full font-accent text-sm">Patrimonio mundial</span>
              <span className="bg-chiapas-green/10 text-chiapas-green px-4 py-2 rounded-full font-accent text-sm">Pueblos mágicos</span>
              <span className="bg-chiapas-green/10 text-chiapas-green px-4 py-2 rounded-full font-accent text-sm">Cultura maya</span>
              <span className="bg-chiapas-green/10 text-chiapas-green px-4 py-2 rounded-full font-accent text-sm">Reservas naturales</span>
            </div>
            
            {/* Botón de llamada a la acción */}
            <a 
              href="#trip-planner" 
              className="inline-flex items-center gap-2 bg-chiapas-green hover:bg-chiapas-green/90 transition-colors text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
            >
              Planifica tu viaje ahora
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <img 
              src="/images/Cañon del sumidero.jpg" 
              alt="Cañón del Sumidero" 
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform hover:scale-105 duration-300" 
              loading="lazy"
            />
            <img 
              src="/images/San cristobal de las casas.jpg" 
              alt="San Cristóbal de las Casas" 
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform hover:scale-105 duration-300" 
              loading="lazy"
            />
            <img 
              src="/images/Selva lacandona.jpg" 
              alt="Selva Lacandona" 
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform hover:scale-105 duration-300" 
              loading="lazy"
            />
            <img 
              src="/images/Cascadas de Agua Azu.jpg" 
              alt="Cascadas de Agua Azul" 
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform hover:scale-105 duration-300" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
