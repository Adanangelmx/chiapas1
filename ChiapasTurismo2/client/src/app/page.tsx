import { VirtualAssistant } from '@/components/home/VirtualAssistant';

// ... existing code ...

      {/* Asistente Virtual */}
      <section className="py-16 md:py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tu Guía Virtual de Chiapas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre todo sobre Chiapas con nuestro asistente virtual. Pregunta sobre destinos, 
              gastronomía, cultura o cualquier aspecto de tu viaje.
            </p>
          </div>
          
          <VirtualAssistant />
        </div>
      </section>

      {/* Resto del contenido */}
// ... existing code ... 