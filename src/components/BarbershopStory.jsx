import { motion, useReducedMotion } from 'motion/react';
import { SITE, IMAGES } from '../config/site';
import { fadeUp, fadeSide } from '../lib/motionVariants';
import Image from './Image';

export default function BarbershopStory() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="barbearia" className="section section--panel story">
      <div className="container story__grid">
        <motion.div className="story__media" {...fadeSide(prefersReduced, { x: -12 })}>
          <Image src={IMAGES.barbershop} alt={`Ambiente interno da ${SITE.name}`} />
        </motion.div>

        <motion.div className="story__content" {...fadeUp(prefersReduced, { y: 10, delay: 0.06 })}>
          <span className="story__eyebrow">A barbearia</span>
          <p className="story__text">
            Um espaço feito pra quem gosta de corte bem feito, atendimento tranquilo e horário marcado sem
            enrolação.
          </p>
          <div className="story__stats">
            {SITE.stats.map((stat) => (
              <div key={stat.label} className="story__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
