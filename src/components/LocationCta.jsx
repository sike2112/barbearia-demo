import { motion, useReducedMotion } from 'motion/react';
import { SITE } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { fadeUp } from '../lib/motionVariants';
import { ArrowRightIcon } from './Icons';

export default function LocationCta() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();

  return (
    <section id="contato" className="section section--panel cta-final">
      <div className="container">
        <motion.div className="cta-final__main" {...fadeUp(prefersReduced, { y: 14 })}>
          <h2 className="cta-final__headline">
            Seu horário.
            <br />
            Do seu jeito.
          </h2>
          <div className="cta-final__actions">
            <button type="button" className="btn btn--light" onClick={() => openBooking()}>
              Agendar horário
            </button>
            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
              Falar no WhatsApp
              <ArrowRightIcon />
            </a>
          </div>
        </motion.div>

        <motion.div className="cta-final__bar" {...fadeUp(prefersReduced, { y: 10, delay: 0.1 })}>
          <div className="cta-final__location">
            <span className="cta-final__label">
              {SITE.brand} — {SITE.city}, {SITE.state}
            </span>
            <span className="cta-final__address">
              {SITE.address.line1}, {SITE.address.line2}
            </span>
          </div>

          <div className="location__hours">
            {SITE.openingHours.map((row) => (
              <span key={row.days}>
                {row.days} {row.time}
              </span>
            ))}
          </div>

          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="cta-final__map">
            Como chegar
            <ArrowRightIcon />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
