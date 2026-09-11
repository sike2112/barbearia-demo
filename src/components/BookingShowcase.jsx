import { motion, useReducedMotion } from 'motion/react';
import { SERVICES } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionVariants';
import { WhatsappIcon } from './Icons';

const STEPS = [
  { n: '01', title: 'Escolha o serviço', desc: 'Corte, barba ou um dos pacotes combinados.' },
  { n: '02', title: 'Escolha o profissional', desc: 'Um barbeiro específico ou "qualquer um".' },
  { n: '03', title: 'Selecione data e horário', desc: 'De acordo com o funcionamento da casa.' },
  { n: '04', title: 'Confirme pelo WhatsApp', desc: 'Envie a solicitação direto na conversa.' },
];

// Serviço usado como exemplo no preview ilustrativo abaixo — dado real da
// configuração (não é uma seleção do usuário).
const previewService = SERVICES[2];

export default function BookingShowcase() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();

  return (
    <section id="agendamento" className="section booking-showcase">
      <div className="container">
        <motion.div className="services__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="section-index">04</span>
          <span className="services__eyebrow">Como agendar</span>
          <span className="services__rule" aria-hidden="true" />
        </motion.div>

        <motion.p className="booking-showcase__lead" {...fadeUp(prefersReduced, { y: 10, delay: 0.04 })}>
          Da escolha do serviço até o envio, o agendamento acontece em poucos passos — sem cadastro
          e sem senha.
        </motion.p>

        <motion.ol
          className="booking-showcase__steps"
          {...staggerContainer(prefersReduced, { staggerChildren: 0.08 })}
        >
          {STEPS.map((step) => (
            <motion.li key={step.n} className="booking-step" {...staggerItem(prefersReduced, { y: 12 })}>
              <span className="booking-step__n">{step.n}</span>
              <span className="booking-step__title">{step.title}</span>
              <span className="booking-step__desc">{step.desc}</span>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div className="booking-showcase__previews" {...fadeUp(prefersReduced, { y: 14, delay: 0.1 })}>
          <div className="booking-mini" aria-hidden="true">
            <span className="booking-mini__label">Serviço</span>
            <div className="booking-list">
              <div className="booking-option is-selected">
                <span className="booking-option__main">
                  <span className="booking-option__name">{previewService.name}</span>
                  <span className="booking-option__desc">{previewService.description}</span>
                </span>
                <span className="booking-option__price">R$ {previewService.price}</span>
              </div>
            </div>
          </div>

          <div className="booking-mini" aria-hidden="true">
            <span className="booking-mini__label">Confirmação</span>
            <div className="booking-mini__whatsapp">
              <WhatsappIcon />
              <span>Solicitação enviada por WhatsApp</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="booking-showcase__foot" {...fadeUp(prefersReduced, { y: 8, delay: 0.14 })}>
          <p className="booking-showcase__note">
            O horário escolhido é uma solicitação — a confirmação final acontece diretamente com a
            barbearia, pelo WhatsApp.
          </p>
          <button type="button" className="btn btn--outline" onClick={() => openBooking()}>
            Agendar horário
          </button>
        </motion.div>
      </div>
    </section>
  );
}
