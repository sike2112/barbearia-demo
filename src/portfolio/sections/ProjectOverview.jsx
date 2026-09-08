import { motion, useReducedMotion } from 'motion/react';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motionVariants';

const FIELDS = [
  { n: '01', label: 'Project', value: 'Nobre Barbearia' },
  { n: '02', label: 'Category', value: 'Barbershop' },
  { n: '03', label: 'Services', value: 'Web Design, Front-End Development, Booking Experience' },
  { n: '04', label: 'Platform', value: 'Responsive Web' },
];

export default function ProjectOverview() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">01</span>
          <span className="pf-eyebrow">Project Overview</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <div className="pf-overview">
          <motion.dl className="pf-overview__fields" {...staggerContainer(prefersReduced, { staggerChildren: 0.06 })}>
            {FIELDS.map((field) => (
              <motion.div className="pf-overview__row" key={field.label} {...staggerItem(prefersReduced, { y: 12 })}>
                <span className="pf-overview__n">{field.n}</span>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.p className="pf-overview__text" {...fadeUp(prefersReduced, { y: 12, delay: 0.2 })}>
            O projeto foi pensado para organizar serviços, profissionais e agendamentos em uma
            experiência simples e responsiva — do primeiro acesso até o envio da solicitação de
            horário pelo WhatsApp.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
