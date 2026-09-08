import { SERVICES, TEAM, BOOKING_CONFIG } from '../../config/site';
import { generateAvailableDates, generateTimeSlots, formatDateShort, formatTime } from '../../lib/booking';

// Réplicas estáticas — mesmas classes CSS do modal real de agendamento
// (definidas em src/index.css), sem estado, sem handlers, sem contexto de
// booking. Servem só como ilustração fiel do visual do fluxo real.

const dates = generateAvailableDates(BOOKING_CONFIG);
const previewDate = dates[2] || dates[0] || null;
const previewSlots = previewDate ? generateTimeSlots(previewDate, BOOKING_CONFIG).slice(0, 6) : [];

export function ServiceStepPreview() {
  const highlighted = SERVICES[2];
  return (
    <div className="pf-booking-preview" aria-hidden="true">
      <span className="pf-booking-preview__label">Passo 01 — Serviço</span>
      <div className="booking-list">
        {SERVICES.slice(0, 3).map((s) => (
          <div key={s.id} className={`booking-option ${s.id === highlighted.id ? 'is-selected' : ''}`}>
            <span className="booking-option__main">
              <span className="booking-option__name">{s.name}</span>
              <span className="booking-option__desc">{s.description}</span>
            </span>
            <span className="booking-option__price">R$ {s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScheduleStepPreview() {
  return (
    <div className="pf-booking-preview" aria-hidden="true">
      <span className="pf-booking-preview__label">Passo 03 — Data e horário</span>
      <div className="booking-dates">
        {dates.slice(0, 5).map((d, i) => (
          <span key={d.toISOString()} className={`booking-date ${i === 2 ? 'is-selected' : ''}`}>
            {formatDateShort(d)}
          </span>
        ))}
      </div>
      <div className="booking-times">
        {previewSlots.map((t, i) => (
          <span key={t.toISOString()} className={`booking-time ${i === 1 ? 'is-selected' : ''}`}>
            {formatTime(t)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ReviewStepPreview() {
  const service = SERVICES[2];
  const barber = TEAM[0];
  return (
    <div className="pf-booking-preview" aria-hidden="true">
      <span className="pf-booking-preview__label">Passo 06 — Envio</span>
      <div className="booking-summary">
        <div className="booking-summary__row">
          <span>Serviço</span>
          <span>{service.name}</span>
        </div>
        <div className="booking-summary__row">
          <span>Barbeiro</span>
          <span>
            {barber.first} {barber.last}
          </span>
        </div>
        <div className="booking-summary__row">
          <span>Data</span>
          <span>{previewDate ? formatDateShort(previewDate) : '-'}</span>
        </div>
        <div className="booking-summary__row booking-summary__row--total">
          <span>Valor</span>
          <span>R$ {service.price}</span>
        </div>
      </div>
      <span className="btn btn--light pf-booking-preview__cta">Confirmar pelo WhatsApp</span>
    </div>
  );
}
