import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionSection() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically make an API call to subscribe the user
    console.log(`Subscribing email: ${email}`);
    
    toast({
      title: "¡Suscripción exitosa!",
      description: "Gracias por suscribirte a nuestro boletín",
    });
    
    setEmail('');
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-chiapas-gold/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Mantente informado</h2>
        <p className="text-lg mb-8">Suscríbete para recibir novedades, promociones especiales y consejos para tu próximo viaje a Chiapas.</p>
        
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="flex-grow bg-white border border-chiapas-gold/30 rounded-lg p-3" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-chiapas-green hover:bg-chiapas-green/90 text-white font-accent font-medium py-3 px-8 rounded-lg transition duration-300 whitespace-nowrap"
            >
              Suscribirme
            </button>
          </div>
        </form>
        
        <p className="text-sm text-chiapas-dark/70 mt-4">Respetamos tu privacidad. Puedes darte de baja en cualquier momento.</p>
      </div>
    </section>
  );
}
