import { motion, useReducedMotion } from 'motion/react';
import { fadeUp, staggerContainer, staggerItem } from '../../lib/motionVariants';
import { ServiceStepPreview, ScheduleStepPreview, ReviewStepPreview } from '../components/BookingPreview';

const STEPS = [
  { n: '01', title: 'Escolha o serviço', desc: 'Corte, barba ou pacotes combinados — descrição e valor visíveis de cara.', highlighted: true },
  { n: '02', title: 'Escolha o profissional', desc: 'Preferência por um barbeiro específico ou "qualquer profissional".' },
  { n: '03', title: 'Escolha data e horário', desc: 'Uma data e horário para enviar a solicitação de agendamento.', highlighted: true },
  { n: '04', title: 'Informe seus dados', desc: 'Nome e telefone, direto, sem cadastro ou senha.' },
  { n: '05', title: 'Revise o agendamento', desc: 'Resumo completo antes de qualquer envio.' },
  { n: '06', title: 'Envie a solicitação pelo WhatsApp', desc: 'A confirmação final acontece pela barbearia, na conversa.', highlighted: true },
];

export default function BookingExperience() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="pf-section pf-section--panel pf-booking">
      <div className="container">
        <motion.div className="pf-section__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="pf-index">04</span>
          <span className="pf-eyebrow">Booking Experience</span>
          <span className="pf-rule" aria-hidden="true" />
        </motion.div>

        <motion.p className="pf-booking__lead" {...fadeUp(prefersReduced, { y: 12, delay: 0.04 })}>
          Não é apenas um site bonito: existe um fluxo funcional de agendamento, pensado passo a passo.
        </motion.p>

        <div className="pf-booking__layout">
          <motion.ol className="pf-booking__steps" {...staggerContainer(prefersReduced, { staggerChildren: 0.05 })}>
            {STEPS.map((step) => (
              <motion.li
                key={step.n}
                className={`pf-booking__step ${step.highlighted ? 'is-highlighted' : ''}`}
                {...staggerItem(prefersReduced, { y: 10 })}
              >
                <span className="pf-booking__step-n">{step.n}</span>
                <span className="pf-booking__step-body">
                  <span className="pf-booking__step-title">{step.title}</span>
                  <span className="pf-booking__step-desc">{step.desc}</span>
                </span>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div className="pf-booking__previews" {...staggerContainer(prefersReduced, { staggerChildren: 0.08 })}>
            <motion.div {...staggerItem(prefersReduced, { y: 14 })}>
              <ServiceStepPreview />
            </motion.div>
            <motion.div {...staggerItem(prefersReduced, { y: 14 })}>
              <ScheduleStepPreview />
            </motion.div>
            <motion.div {...staggerItem(prefersReduced, { y: 14 })}>
              <ReviewStepPreview />
            </motion.div>
          </motion.div>
        </div>

        <motion.p className="pf-booking__disclaimer" {...fadeUp(prefersReduced, { y: 8, delay: 0.1 })}>
          Solicitação de horário, sem bloqueio automático de agenda — a confirmação acontece pelo WhatsApp.
        </motion.p>
      </div>
    </section>
  );
}
