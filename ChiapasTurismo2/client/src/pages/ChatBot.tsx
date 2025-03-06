import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WorkingChatbot } from '@/components/chat/WorkingChatbot';
import { useLocation } from 'wouter';

export default function ChatBot() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = searchParams.get('query') || '';
  
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-chiapas-light/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="px-4 py-2 rounded-full bg-chiapas-gold/20 text-chiapas-dark text-sm font-medium mb-4 inline-block">
              CHIAPAS VIRTUAL
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">Chat con Asistente Turístico</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Nuestro asistente virtual te ayudará a planificar tu viaje a Chiapas.
              Pregúntale sobre destinos, rutas, gastronomía, hospedaje o cualquier duda que tengas.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="rounded-xl p-4 bg-white/50 backdrop-blur-sm shadow-sm border border-chiapas-gold/10 mb-4">
              <h3 className="text-sm font-medium mb-2">Asistente de Viajes de Chiapas</h3>
              <p className="text-xs text-chiapas-dark/70">
                Este asistente inteligente contiene información actualizada sobre Chiapas.
                Puede responder preguntas detalladas sobre cualquier aspecto de Chiapas, incluyendo rutas, atracciones, 
                gastronomía, cultura, hospedaje y recomendaciones personalizadas.
              </p>
            </div>
            <WorkingChatbot initialQuery={initialQuery} />
          </div>
          
          <div className="rounded-xl p-6 bg-white shadow border border-chiapas-gold/10 mt-8">
            <h2 className="text-xl font-bold mb-4 text-chiapas-dark">¿Cómo usar nuestro asistente virtual?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-chiapas-gold/20 flex items-center justify-center mb-3">
                  <span className="text-xl">1️⃣</span>
                </div>
                <h3 className="font-bold mb-2">Haz tu pregunta</h3>
                <p className="text-sm text-chiapas-dark/70">
                  Escribe cualquier duda sobre Chiapas, sus atracciones, 
                  gastronomía, cultura o consejos de viaje.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-chiapas-gold/20 flex items-center justify-center mb-3">
                  <span className="text-xl">2️⃣</span>
                </div>
                <h3 className="font-bold mb-2">Recibe información</h3>
                <p className="text-sm text-chiapas-dark/70">
                  Nuestro asistente responderá con datos verificados
                  y recomendaciones personalizadas.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-chiapas-gold/20 flex items-center justify-center mb-3">
                  <span className="text-xl">3️⃣</span>
                </div>
                <h3 className="font-bold mb-2">Explora los mapas</h3>
                <p className="text-sm text-chiapas-dark/70">
                  Visualiza las ubicaciones recomendadas en mapas 
                  interactivos para planificar mejor tu viaje.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}