import { motion, useReducedMotion } from 'motion/react';
import { SERVICES } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionVariants';
import { ArrowRightIcon } from './Icons';

export default function Services() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();

  return (
    <section id="servicos" className="section section--tight">
      <div className="container">
        <motion.div className="services__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="services__eyebrow">Serviços</span>
          <span className="services__rule" aria-hidden="true" />
        </motion.div>

        <motion.div className="services__list" {...staggerContainer(prefersReduced)}>
          {SERVICES.map((service) => (
            <motion.button
              key={service.id}
              type="button"
              className="service-row"
              {...staggerItem(prefersReduced, { y: 10 })}
              onClick={() => openBooking(service.id)}
            >
              <span className="service-row__main">
                <span className="service-row__name">{service.name}</span>
                <span className="service-row__desc">{service.description}</span>
              </span>
              <span className="service-row__meta">
                <span className="service-row__price">R$ {service.price}</span>
                <ArrowRightIcon />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
