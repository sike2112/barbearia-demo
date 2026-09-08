import { useEffect } from 'react';
import './portfolio.css';
import PortfolioHero from './sections/PortfolioHero';
import ProjectOverview from './sections/ProjectOverview';
import WebsiteShowcase from './sections/WebsiteShowcase';
import ServicesExperience from './sections/ServicesExperience';
import BookingExperience from './sections/BookingExperience';
import MobileExperience from './sections/MobileExperience';
import Features from './sections/Features';
import FinalPresentation from './sections/FinalPresentation';

/**
 * Case study / apresentação do projeto NOBRE para o portfólio da Sike Sites.
 * Rota isolada (/portfolio) — não compartilha estado, contexto de agendamento
 * ou lógica com o site principal (src/App.jsx). Os previews do site real são
 * feitos via iframe same-origin, sempre não-interativos.
 */
export default function PortfolioPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Nobre Barbershop — Case Study | Sike Sites';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="pf-page">
      <a href="/" className="pf-back">
        ← Site principal
      </a>

      <main>
        <PortfolioHero />
        <ProjectOverview />
        <WebsiteShowcase />
        <ServicesExperience />
        <BookingExperience />
        <MobileExperience />
        <Features />
        <FinalPresentation />
      </main>
    </div>
  );
}
