import React from 'react';
import { DirectChatbot } from '@/components/chat/DirectChatbot';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocation } from 'wouter';

export default function TravelAssistant() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const question = searchParams.get('q') || searchParams.get('query') || '';
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-4">
        {/* Navegación superior */}
        <div className="flex justify-between items-center px-4 mb-4 border-b pb-3 max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center mr-3 border-2 border-amber-500/50">
              <span className="text-amber-400 font-bold">M</span>
            </div>
            <span className="font-medium">Chiapas Mágico</span>
          </div>
          
          <div className="flex items-center gap-5 text-sm">
            <span>Destinos</span>
            <span>Cultura</span>
            <span>Naturaleza</span>
            <span>Gastronomía</span>
            <span>Planifica tu visita</span>
            <span className="font-medium">Asistente de Viaje 🇲🇽</span>
          </div>
        </div>
      
        {/* Área principal */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center my-2">
            <div className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-800 text-xs font-medium px-4 py-1.5 rounded-full border border-amber-500/30 shadow-sm">
              <span className="text-emerald-700">🏞️ ASISTENTE</span> <span className="text-amber-700">VIRTUAL MAYA</span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-emerald-800">
              <span className="text-amber-600">Maya</span>Guía - Tu Guía Virtual
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-8">
              Descubre los secretos de la tierra maya con nuestro asistente virtual especializado 
              en Chiapas. Recibe recomendaciones personalizadas para tu aventura.
            </p>
          </div>
          
          {/* Componente de guía turístico (VERSIÓN 2.0 - MEJORADA) */}
          <div className="mb-10">
            <DirectChatbot initialQuery={question} />
          </div>
          
          <div className="mt-5 text-center pb-6">
            <p className="text-gray-500 text-xs max-w-xl mx-auto">
              <span className="text-amber-600 font-medium">MayaGuía</span>: La información proporcionada tiene fines informativos. 
              Recomendamos verificar los detalles específicos con proveedores locales antes de tu viaje.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}