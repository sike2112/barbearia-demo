import { motion, useReducedMotion } from 'motion/react';
import { SITE } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { fadeUp } from '../lib/motionVariants';
import { ArrowRightIcon } from './Icons';

export default function LocationCta() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();

  return (
    <section id="contato" className="section section--panel location">
      <motion.div className="container location__inner" {...fadeUp(prefersReduced, { y: 10 })}>
        <div className="location__info">
          <span className="services__eyebrow">
            {SITE.brand} — {SITE.city}, {SITE.state}
          </span>
          <p className="location__address">
            {SITE.address.line1}
            <br />
            {SITE.address.line2}
          </p>
          <div className="location__hours">
            {SITE.openingHours.map((row) => (
              <span key={row.days}>
                {row.days} {row.time}
              </span>
            ))}
          </div>
        </div>

        <div className="location__actions">
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            Como chegar
            <ArrowRightIcon />
          </a>
          <button type="button" className="btn btn--light" onClick={() => openBooking()}>
            Agendar horário
          </button>
        </div>
      </motion.div>
    </section>
  );
}
