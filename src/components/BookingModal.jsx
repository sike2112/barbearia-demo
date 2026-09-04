import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SITE, SERVICES, TEAM, BOOKING_CONFIG } from '../config/site';
import { generateAvailableDates, generateTimeSlots, formatDateShort, formatDateLong, formatTime } from '../lib/booking';
import { CloseIcon, ArrowRightIcon } from './Icons';

const STEP_LABELS = ['Serviço', 'Barbeiro', 'Data', 'Horário', 'Seus dados', 'Resumo'];
const EASE = [0.16, 1, 0.3, 1];

function emptyState(initialServiceId) {
  return {
    step: initialServiceId ? 2 : 1,
    serviceId: initialServiceId,
    barberId: null,
    date: null,
    time: null,
    name: '',
    phone: '',
  };
}

export default function BookingModal({ isOpen, initialServiceId, onClose }) {
  const prefersReduced = useReducedMotion();
  const [state, setState] = useState(() => emptyState(initialServiceId));
  const dialogRef = useRef(null);

  const dates = useMemo(() => generateAvailableDates(BOOKING_CONFIG), []);
  const timeSlots = useMemo(() => (state.date ? generateTimeSlots(state.date, BOOKING_CONFIG) : []), [state.date]);

  const service = SERVICES.find((s) => s.id === state.serviceId) || null;
  const barber = state.barberId === 'any' ? { first: 'Qualquer', last: 'profissional' } : TEAM.find((b) => b.id === state.barberId) || null;

  useEffect(() => {
    if (isOpen) setState(emptyState(initialServiceId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.classList.add('no-scroll');
    const firstFocusable = dialogRef.current?.querySelector('button, input, a');
    firstFocusable?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goTo = (step) => setState((s) => ({ ...s, step }));
  const back = () => goTo(state.step - 1);

  // Mesma função de finalização para mobile e desktop — sem lógica diferente
  // por dispositivo. O número vem sempre da mesma configuração central.
  const confirmAndSendWhatsapp = () => {
    const lines = [
      'Olá! Gostaria de solicitar um agendamento:',
      '',
      `Nome: ${state.name}`,
      `Serviço: ${service?.name ?? '-'}`,
      `Barbeiro: ${barber ? `${barber.first} ${barber.last}` : '-'}`,
      `Data: ${state.date ? formatDateShort(state.date).split(' ').slice(1).join(' ') : '-'}`,
      `Horário: ${state.time ? formatTime(state.time) : '-'}`,
      `Valor: R$ ${service?.price ?? '-'}`,
    ];
    if (state.phone.trim()) lines.push(`Telefone: ${state.phone.trim()}`);
    const mensagem = lines.join('\n');

    const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(mensagem)}`;

    // eslint-disable-next-line no-console
    console.log('WhatsApp URL final:', whatsappUrl);

    window.location.href = whatsappUrl;
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="booking-backdrop"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="booking-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          ref={dialogRef}
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <div className="booking-modal__head">
            <div>
              <p className="booking-modal__step-label">
                Passo {state.step} de 6 — {STEP_LABELS[state.step - 1]}
              </p>
              <h2 id="booking-title" className="booking-modal__title">
                Agendar horário
              </h2>
            </div>
            <button type="button" className="booking-modal__close" aria-label="Fechar" onClick={onClose}>
              <CloseIcon width={20} height={20} />
            </button>
          </div>

          <div className="booking-modal__progress">
            <div className="booking-modal__progress-bar" style={{ width: `${(state.step / 6) * 100}%` }} />
          </div>

          <div className="booking-modal__body">
            {state.step === 1 && (
              <div className="booking-list">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`booking-option ${state.serviceId === s.id ? 'is-selected' : ''}`}
                    onClick={() => setState((prev) => ({ ...prev, serviceId: s.id }))}
                  >
                    <span className="booking-option__main">
                      <span className="booking-option__name">{s.name}</span>
                      <span className="booking-option__desc">{s.description}</span>
                    </span>
                    <span className="booking-option__price">R$ {s.price}</span>
                  </button>
                ))}
              </div>
            )}

            {state.step === 2 && (
              <div className="booking-list">
                <button
                  type="button"
                  className={`booking-option ${state.barberId === 'any' ? 'is-selected' : ''}`}
                  onClick={() => setState((prev) => ({ ...prev, barberId: 'any' }))}
                >
                  <span className="booking-option__main">
                    <span className="booking-option__name">Qualquer profissional</span>
                    <span className="booking-option__desc">Sem preferência de barbeiro</span>
                  </span>
                </button>
                {TEAM.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`booking-option ${state.barberId === b.id ? 'is-selected' : ''}`}
                    onClick={() => setState((prev) => ({ ...prev, barberId: b.id }))}
                  >
                    <span className="booking-option__main">
                      <span className="booking-option__name">
                        {b.first} {b.last}
                      </span>
                      <span className="booking-option__desc">{b.specialty}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {state.step === 3 && (
              <div className="booking-dates">
                {dates.map((d) => (
                  <button
                    key={d.toISOString()}
                    type="button"
                    className={`booking-date ${state.date && state.date.getTime() === d.getTime() ? 'is-selected' : ''}`}
                    onClick={() => setState((prev) => ({ ...prev, date: d, time: null }))}
                  >
                    {formatDateShort(d)}
                  </button>
                ))}
              </div>
            )}

            {state.step === 4 && (
              <div className="booking-times">
                {timeSlots.length === 0 && (
                  <p className="booking-empty">Sem horários disponíveis para essa data. Volte e escolha outra data.</p>
                )}
                {timeSlots.map((t) => (
                  <button
                    key={t.toISOString()}
                    type="button"
                    className={`booking-time ${state.time && state.time.getTime() === t.getTime() ? 'is-selected' : ''}`}
                    onClick={() => setState((prev) => ({ ...prev, time: t }))}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
            )}

            {state.step === 5 && (
              <div className="booking-form">
                <label className="booking-field">
                  <span>Nome*</span>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </label>
                <label className="booking-field">
                  <span>Telefone (opcional)</span>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => setState((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                  />
                </label>
              </div>
            )}

            {state.step === 6 && (
              <div className="booking-summary">
                <div className="booking-summary__row">
                  <span>Nome</span>
                  <span>{state.name}</span>
                </div>
                <div className="booking-summary__row">
                  <span>Serviço</span>
                  <span>{service?.name}</span>
                </div>
                <div className="booking-summary__row">
                  <span>Barbeiro</span>
                  <span>
                    {barber?.first} {barber?.last}
                  </span>
                </div>
                <div className="booking-summary__row">
                  <span>Data</span>
                  <span>{state.date ? formatDateLong(state.date) : '-'}</span>
                </div>
                <div className="booking-summary__row">
                  <span>Horário</span>
                  <span>{state.time ? formatTime(state.time) : '-'}</span>
                </div>
                <div className="booking-summary__row booking-summary__row--total">
                  <span>Valor</span>
                  <span>R$ {service?.price}</span>
                </div>
                <p className="booking-disclaimer">
                  Isso é uma solicitação de horário — a confirmação final acontece pelo WhatsApp com a barbearia.
                </p>
              </div>
            )}
          </div>

          <div className="booking-modal__footer">
            {state.step > 1 && (
              <button type="button" className="btn btn--outline" onClick={back}>
                Voltar
              </button>
            )}
            {state.step < 5 && (
              <button
                type="button"
                className="btn btn--light"
                disabled={
                  (state.step === 1 && !state.serviceId) ||
                  (state.step === 2 && !state.barberId) ||
                  (state.step === 3 && !state.date) ||
                  (state.step === 4 && !state.time)
                }
                onClick={() => goTo(state.step + 1)}
              >
                Continuar
                <ArrowRightIcon />
              </button>
            )}
            {state.step === 5 && (
              <button type="button" className="btn btn--light" disabled={!state.name.trim()} onClick={() => goTo(6)}>
                Revisar
                <ArrowRightIcon />
              </button>
            )}
            {state.step === 6 && (
              <button type="button" className="btn btn--light" onClick={confirmAndSendWhatsapp}>
                Confirmar pelo WhatsApp
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
