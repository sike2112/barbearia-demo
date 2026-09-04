import { motion, useReducedMotion } from 'motion/react';
import { TEAM, FEATURED_REVIEW } from '../config/site';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionVariants';

export default function TeamReview() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="equipe" className="section section--tight">
      <div className="container team-review">
        <div className="team-review__team">
          <span className="services__eyebrow">Quem faz</span>
          <motion.ul className="team-list-compact" {...staggerContainer(prefersReduced)}>
            {TEAM.map((member) => (
              <motion.li key={member.id} {...staggerItem(prefersReduced, { y: 8 })}>
                <strong>
                  {member.first} {member.last}
                </strong>
                <span>{member.specialty}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div className="team-review__review" {...fadeUp(prefersReduced, { y: 10, delay: 0.1 })}>
          <span className="review-stars" aria-label={`${FEATURED_REVIEW.rating} de 5 estrelas`}>
            {'★'.repeat(FEATURED_REVIEW.rating)}
            {'☆'.repeat(5 - FEATURED_REVIEW.rating)}
          </span>
          <p>&ldquo;{FEATURED_REVIEW.text}&rdquo;</p>
          <span className="team-review__author">— {FEATURED_REVIEW.author}</span>
        </motion.div>
      </div>
    </section>
  );
}
