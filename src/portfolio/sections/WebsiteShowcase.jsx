import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from '../../lib/motionVariants';
import BrowserFrame from '../components/BrowserFrame';
import PhoneFrame from '../components/PhoneFrame';

export default function WebsiteShowcase() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section pf-section--panel">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">02</span>
          <span className="pf-eyebrow">Website Showcase</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <motion.span className="pf-tag" {...fadeUp(prefersReduced, { y: 8, delay: 0.04 })}>
          Desktop Experience
        </motion.span>

        <motion.div className="pf-showcase__stage" {...fadeUp(prefersReduced, { y: 22, delay: 0.1 })}>
          <BrowserFrame scrollTo={0} className="pf-showcase__browser" />
          <div className="pf-showcase__phone">
            <span className="pf-tag pf-tag--phone">Fully Responsive</span>
            <PhoneFrame scrollTo={0} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
