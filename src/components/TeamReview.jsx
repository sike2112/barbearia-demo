import { motion, useReducedMotion } from 'motion/react';
import { TEAM, FEATURED_REVIEW } from '../config/site';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionVariants';

export default function TeamReview() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="equipe" className="section section--tight">
      <div className="container">
        <motion.div className="services__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="section-index">03</span>
          <span className="services__eyebrow">Equipe</span>
          <span className="services__rule" aria-hidden="true" />
        </motion.div>

        <div className="team-review">
          <motion.ul className="team-list" {...staggerContainer(prefersReduced)}>
            {TEAM.map((member, index) => (
              <motion.li key={member.id} className="team-member" {...staggerItem(prefersReduced, { y: 10 })}>
                <span className="team-member__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="team-member__info">
                  <span className="team-member__name">
                    {member.first} <span className="team-member__last">{member.last}</span>
                  </span>
                  <span className="team-member__specialty">{member.specialty}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="team-review__review" {...fadeUp(prefersReduced, { y: 10, delay: 0.1 })}>
            <span className="team-review__quote" aria-hidden="true">
              &ldquo;
            </span>
            <span className="review-stars" aria-label={`${FEATURED_REVIEW.rating} de 5 estrelas`}>
              {'★'.repeat(FEATURED_REVIEW.rating)}
              {'☆'.repeat(5 - FEATURED_REVIEW.rating)}
            </span>
            <p>{FEATURED_REVIEW.text}</p>
            <div className="team-review__foot">
              <span className="team-review__author">{FEATURED_REVIEW.author}</span>
              <span className="team-review__demo-tag">Depoimento ilustrativo</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
