import { Link } from 'wouter';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para procesar la suscripción
    if (email) {
      setSubscribed(true);
      setEmail('');
      
      // Reset después de 5 segundos para permitir nuevas suscripciones
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };
  
  return (
    <footer className="bg-gradient-to-br from-chiapas-dark to-chiapas-dark/90 text-white pt-16 pb-8 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-chiapas-green/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-chiapas-green/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <div className="bg-chiapas-green p-3 rounded-lg shadow-lg">
                <svg 
                  width="36" 
                  height="36" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                  />
                  <path 
                    d="M9 6.5C9 6.5 15 10.5 15 12C15 13.5 9 17.5 9 17.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <span className="text-white font-display text-xl font-bold">Chiapas Mágico</span>
                <p className="text-white/70 text-xs">Descubre el sur de México</p>
              </div>
            </div>
            <p className="text-white/70 mb-6 text-sm">Tu portal para descubrir la magia, naturaleza y cultura de Chiapas. Planifica tu viaje, conoce nuestros destinos y vive experiencias únicas en uno de los estados más diversos de México.</p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-6">
              <h3 className="font-display font-bold text-white mb-3 text-sm">¡Mantente informado!</h3>
              {subscribed ? (
                <div className="bg-chiapas-green/20 text-white p-3 rounded-md text-sm">
                  ¡Gracias por suscribirte! Pronto recibirás noticias sobre Chiapas.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico" 
                    className="bg-white/20 border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-chiapas-green"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-chiapas-green hover:bg-chiapas-green/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Suscribirme al newsletter
                  </button>
                </form>
              )}
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-chiapas-green hover:text-white transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-chiapas-green hover:text-white transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-chiapas-green hover:text-white transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-chiapas-green hover:text-white transition duration-300">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
                
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-lg mb-4 border-b border-white/10 pb-2">Descubre</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Inicio
              </a></li>
              <li><a href="#destinos" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Destinos
              </a></li>
              <li><a href="#cultura" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Cultura
              </a></li>
              <li><a href="#naturaleza" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Naturaleza
              </a></li>
              <li><a href="#gastronomia" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Gastronomía
              </a></li>
              <li><a href="#trip-planner" className="hover:text-chiapas-green transition duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Planifica tu viaje
              </a></li>
            </ul>
          </div>
                
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-lg mb-4 border-b border-white/10 pb-2">Destinos populares</h3>
            <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
              <div>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    San Cristóbal
                  </a></li>
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Palenque
                  </a></li>
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Cañón del Sumidero
                  </a></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Agua Azul
                  </a></li>
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Lagos de Montebello
                  </a></li>
                  <li><a href="#" className="hover:text-chiapas-green transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Chiapa de Corzo
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
                
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-lg mb-4 border-b border-white/10 pb-2">Contáctanos</h3>
            <ul className="space-y-4 text-white/80 text-sm">
              <li className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Dirección</p>
                  <p className="text-white/70">Tuxtla Gutiérrez, Chiapas, México</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Email</p>
                  <p className="text-white/70">info@chiapasmagico.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Teléfono</p>
                  <p className="text-white/70">+52 (961) 123-4567</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
            
        <hr className="border-white/10 mb-8" />
            
        <div className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
          <p className="mb-4 md:mb-0">© {new Date().getFullYear()} Chiapas Mágico. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#" className="hover:text-chiapas-green transition duration-300">Política de privacidad</a>
            <a href="#" className="hover:text-chiapas-green transition duration-300">Términos y condiciones</a>
            <a href="#" className="hover:text-chiapas-green transition duration-300">Mapa del sitio</a>
            <a href="#" className="hover:text-chiapas-green transition duration-300">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
