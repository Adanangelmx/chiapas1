import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useMobileMenu } from '@/hooks/use-mobile-menu';

export function Header() {
  const { isOpen, toggleMobileMenu } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY) {
          setIsScrollingDown(true);
        } else {
          setIsScrollingDown(false);
        }
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className="relative">
      {/* Hero Banner */}
      <div className="relative h-screen">
        <img 
          src="/images/Imagen de inicio de página.jpg" 
          alt="Paisaje de Chiapas" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex flex-col justify-center px-6 md:px-12 lg:px-24">
          <nav className={`${
            isScrolled 
              ? 'fixed top-0 left-0 right-0 bg-chiapas-dark/90 backdrop-blur-sm z-50 shadow-lg transition-all duration-300' 
              : 'absolute top-0 left-0 right-0'
            } ${
              isScrollingDown && isScrolled 
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-100'
            } p-6 md:p-8 flex justify-between items-center transition-opacity duration-300`}
          >
            <div className="flex items-center">
              <svg 
                width="50" height="50" 
                viewBox="0 0 50 50" 
                className="h-12 md:h-16"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="50" height="50" rx="6" fill="#00796B" />
                <path d="M15 15H35M15 25H35M15 35H35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 40C33.2843 40 40 33.2843 40 25C40 16.7157 33.2843 10 25 10C16.7157 10 10 16.7157 10 25C10 33.2843 16.7157 40 25 40Z" stroke="white" strokeWidth="2" />
              </svg>
              <span className="ml-3 text-white font-display text-xl md:text-2xl font-bold">Chiapas Mágico</span>
            </div>
                
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white text-2xl" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars"></i>
            </button>
                
            {/* Desktop navigation */}
            <ul className="hidden md:flex space-x-8 text-white font-accent">
              <li><a href="#destinos" className="hover:text-chiapas-gold transition duration-300">Destinos</a></li>
              <li><a href="#cultura" className="hover:text-chiapas-gold transition duration-300">Cultura</a></li>
              <li><a href="#naturaleza" className="hover:text-chiapas-gold transition duration-300">Naturaleza</a></li>
              <li><a href="#gastronomia" className="hover:text-chiapas-gold transition duration-300">Gastronomía</a></li>
              <li><a href="#planifica" className="hover:text-chiapas-gold transition duration-300">Planifica tu viaje</a></li>
              <li>
                <Link href="/asistente" className="bg-chiapas-gold/90 text-chiapas-dark px-4 py-1 rounded-full hover:bg-chiapas-gold transition duration-300 inline-block">
                  Asistente de Viaje 🤖
                </Link>
              </li>
            </ul>
          </nav>
                
          {/* Mobile menu (hidden by default) */}
          <div className={`md:hidden absolute top-20 left-0 right-0 bg-black/90 z-50 ${isOpen ? 'block' : 'hidden'}`} id="mobileMenu">
            <ul className="py-4 px-6 space-y-4 text-white font-accent">
              <li><a href="#destinos" className="block hover:text-chiapas-gold transition duration-300">Destinos</a></li>
              <li><a href="#cultura" className="block hover:text-chiapas-gold transition duration-300">Cultura</a></li>
              <li><a href="#naturaleza" className="block hover:text-chiapas-gold transition duration-300">Naturaleza</a></li>
              <li><a href="#gastronomia" className="block hover:text-chiapas-gold transition duration-300">Gastronomía</a></li>
              <li><a href="#planifica" className="block hover:text-chiapas-gold transition duration-300">Planifica tu viaje</a></li>
              <li>
                <Link href="/asistente" className="block py-2 px-4 bg-chiapas-gold/80 text-chiapas-dark rounded-lg font-medium text-center mt-4 inline-block w-full">
                  Tu Asistente de Viaje 🤖
                </Link>
              </li>
            </ul>
          </div>
                
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">Chiapas, un mundo por descubrir</h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-3xl mx-auto">Explora la tierra de magia ancestral, naturaleza exuberante y tradiciones milenarias en el sureste mexicano.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#destinos" className="bg-chiapas-green hover:bg-opacity-90 text-white font-accent font-medium py-3 px-8 rounded-lg transition duration-300 text-lg">Descubrir destinos</a>
              <a href="#planifica" className="bg-white hover:bg-opacity-90 text-chiapas-dark font-accent font-medium py-3 px-8 rounded-lg transition duration-300 text-lg">Planificar viaje</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
