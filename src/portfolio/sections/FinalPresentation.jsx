import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from '../../lib/motionVariants';
import { NobreMark } from '../../components/Icons';

export default function FinalPresentation() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-final">
      <span className="pf-final__watermark" aria-hidden="true">
        Sike Sites
      </span>

      <div className="container pf-final__inner">
        <motion.div className="pf-final__project" {...fadeUp(prefersReduced, { y: 14 })}>
          <div className="pf-final__title">
            <NobreMark className="pf-hero__mark" width={22} height={22} />
            <h2>
              Nobre
              <span>Barbershop</span>
            </h2>
          </div>
          <p className="pf-final__tagline">A digital experience designed for modern barbershops.</p>
        </motion.div>

        <motion.div className="pf-final__credit" {...fadeUp(prefersReduced, { y: 16, delay: 0.12 })}>
          <span className="pf-final__credit-label">Designed &amp; Developed by</span>
          <span className="pf-final__credit-brand">Sike Sites</span>
          <span className="pf-final__credit-sub">Web Design • Development</span>
          <span className="pf-final__handle">@sikesites</span>
        </motion.div>
      </div>
    </section>
  );
}
