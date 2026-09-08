import { motion, useReducedMotion } from 'motion/react';
import { SERVICES } from '../../config/site';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motionVariants';

export default function ServicesExperience() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">03</span>
          <span className="pf-eyebrow">Services Presentation</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <motion.ul className="pf-services" {...staggerContainer(prefersReduced, { staggerChildren: 0.04 })}>
          {SERVICES.map((service, i) => (
            <motion.li key={service.id} className="pf-services__row" {...staggerItem(prefersReduced, { y: 10 })}>
              <span className="pf-services__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pf-services__name">{service.name}</span>
              <span className="pf-services__price">R$ {service.price}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p className="pf-services__note" {...fadeUp(prefersReduced, { y: 10, delay: 0.14 })}>
          Informação clara. Menos passos até o agendamento.
        </motion.p>
      </div>
    </section>
  );
}
