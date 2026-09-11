import { motion, useReducedMotion } from 'motion/react';
import { SITE, IMAGES, STATS } from '../config/site';
import { fadeUp, fadeSide } from '../lib/motionVariants';
import Image from './Image';

export default function BarbershopStory() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="barbearia" className="section section--panel story">
      <div className="container">
        <motion.div className="services__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="section-index">02</span>
          <span className="services__eyebrow">A barbearia</span>
          <span className="services__rule" aria-hidden="true" />
        </motion.div>

        <div className="story__grid">
          <motion.div className="story__photo" {...fadeSide(prefersReduced, { x: -12 })}>
            <div className="story__media">
              <Image src={IMAGES.barbershop} alt={`Ambiente interno da ${SITE.name}`} />
            </div>
            <span className="story__tag">Desde {SITE.establishedYear}</span>
          </motion.div>

          <motion.div className="story__content" {...fadeUp(prefersReduced, { y: 10, delay: 0.06 })}>
            <p className="story__text">
              Um espaço feito pra quem gosta de corte bem feito, atendimento tranquilo e horário marcado sem
              enrolação.
            </p>
            <div className="story__stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="story__stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
