import React from 'react';

export function NatureSection() {
  return (
    <section id="naturaleza" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative" style={{backgroundImage: `url('/images/Selva lacandona.jpg')`}}>
      <div className="absolute inset-0 bg-chiapas-dark/70"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">Paraíso natural</h2>
          <p className="text-lg max-w-3xl mx-auto text-white/90">Chiapas alberga una extraordinaria biodiversidad con ecosistemas que van desde selvas tropicales hasta bosques de niebla, cascadas y ríos de aguas cristalinas.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 text-white">
            <div className="w-16 h-16 bg-chiapas-green rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-tree text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center">Selva Lacandona</h3>
            <p className="text-white/90 text-center">Una de las zonas con mayor biodiversidad de México. Hogar de jaguares, monos aulladores, tucanes y miles de especies de plantas, muchas aún sin clasificar.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 text-white">
            <div className="w-16 h-16 bg-chiapas-green rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-water text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center">Ríos y cascadas</h3>
            <p className="text-white/90 text-center">Sistemas fluviales que crean espectaculares caídas de agua como Agua Azul, Misol-Ha y El Chiflón, con piscinas naturales de aguas turquesas.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 text-white">
            <div className="w-16 h-16 bg-chiapas-green rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-mountain text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-center">Reservas naturales</h3>
            <p className="text-white/90 text-center">Áreas protegidas como El Triunfo, Montes Azules y La Encrucijada, vitales para la conservación de especies amenazadas y ecosistemas únicos.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center bg-chiapas-green hover:bg-chiapas-green/90 text-white font-accent font-medium py-3 px-8 rounded-lg transition duration-300">
            Descubrir experiencias ecoturísticas <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
