import { motion, useReducedMotion } from 'motion/react';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motionVariants';

const FEATURES = [
  'Responsive Design',
  'Services Showcase',
  'Barber Selection',
  'Date & Time Selection',
  'Booking Flow',
  'WhatsApp Integration',
  'Location & Contact',
];

export default function Features() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section pf-section--panel">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">06</span>
          <span className="pf-eyebrow">Features</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <motion.ul className="pf-features" {...staggerContainer(prefersReduced, { staggerChildren: 0.05 })}>
          {FEATURES.map((feature, i) => (
            <motion.li key={feature} className="pf-features__item" {...staggerItem(prefersReduced, { y: 8 })}>
              <span className="pf-features__n">{String(i + 1).padStart(2, '0')}</span>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
