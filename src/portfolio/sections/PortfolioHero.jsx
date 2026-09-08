import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from '../../lib/motionVariants';
import { NobreMark } from '../../components/Icons';

export default function PortfolioHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-hero">
      <div className="pf-hero__grid" aria-hidden="true" />
      <div className="container pf-hero__inner">
        <motion.div className="pf-hero__top" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">00</span>
          <span className="pf-eyebrow">Sike Sites — Case Study</span>
          <span className="pf-eyebrow pf-eyebrow--muted">2026</span>
        </motion.div>

        <div className="pf-hero__main">
          <motion.div className="pf-hero__titleblock" {...fadeUp(prefersReduced, { y: 28, delay: 0.08 })}>
            <NobreMark className="pf-hero__mark" width={36} height={36} />
            <h1 className="pf-hero__title">
              Nobre
              <span>Barbershop</span>
            </h1>
          </motion.div>

          <motion.div className="pf-hero__side" {...fadeUp(prefersReduced, { y: 16, delay: 0.24 })}>
            <p className="pf-hero__kicker">Web Design • Booking Experience</p>
            <p className="pf-hero__desc">
              Uma experiência digital criada para transformar a presença online de uma barbearia em
              uma jornada simples de descoberta e agendamento.
            </p>
            <div className="pf-hero__foot">
              <span className="pf-hero__foot-label">Designed &amp; Developed by</span>
              <span className="pf-hero__foot-brand">Sike Sites</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
