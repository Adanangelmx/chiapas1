import React from 'react';
import { testimonials } from '@/lib/testimonials';

export function TestimonialsSection() {
  // Helper function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Experiencias de viajeros</h2>
          <p className="text-lg max-w-3xl mx-auto">Descubre lo que otros visitantes han vivido en su paso por Chiapas y déjate inspirar por sus historias.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.photo} 
                  alt={`Foto de ${testimonial.name}`} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-chiapas-gold" 
                />
                <div>
                  <h3 className="font-accent font-medium">{testimonial.name}</h3>
                  <div className="flex text-chiapas-gold">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="italic text-chiapas-dark/80">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
