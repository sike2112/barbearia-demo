import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from '../../lib/motionVariants';
import PhoneFrame from '../components/PhoneFrame';
import { ServiceStepPreview } from '../components/BookingPreview';

export default function MobileExperience() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">05</span>
          <span className="pf-eyebrow">Mobile First Experience</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <motion.p className="pf-mobile__lead" {...fadeUp(prefersReduced, { y: 10, delay: 0.04 })}>
          A maior parte dos clientes chega pelo celular — por isso cada etapa foi desenhada primeiro
          para a tela pequena.
        </motion.p>

        <div className="pf-mobile__row">
          <motion.div {...fadeUp(prefersReduced, { y: 16, delay: 0.08 })}>
            <PhoneFrame scrollTo={0} label="Home" />
          </motion.div>
          <motion.div {...fadeUp(prefersReduced, { y: 16, delay: 0.14 })}>
            <PhoneFrame scrollTo={340} label="Serviços" />
          </motion.div>
          <motion.div {...fadeUp(prefersReduced, { y: 16, delay: 0.2 })}>
            <PhoneFrame label="Agendamento">
              <ServiceStepPreview />
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
