import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IntroSection } from '@/components/home/IntroSection';
import { DestinationsSection } from '@/components/home/DestinationsSection';
import { CultureSection } from '@/components/home/CultureSection';
import { NatureSection } from '@/components/home/NatureSection';
import { GastronomySection } from '@/components/home/GastronomySection';
import { AITripPlanner } from '@/components/home/AITripPlanner';
import { AITourGuide } from '@/components/home/AITourGuide';
import { SubscriptionSection } from '@/components/home/SubscriptionSection';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const smoothScroll = (e: Event, targetId: string) => {
      e.preventDefault();
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href) {
          smoothScroll(e, href);
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href) {
            smoothScroll(e, href);
          }
        });
      });
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <IntroSection />
        {/* Incluimos el ChatGuide justo después de la intro para destacar la IA */}
        <AITourGuide />
        <DestinationsSection />
        <CultureSection />
        <NatureSection />
        <GastronomySection />
        <AITripPlanner />
        <SubscriptionSection />
      </main>
      <Footer />
    </>
  );
}
