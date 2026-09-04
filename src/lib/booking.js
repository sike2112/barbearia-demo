// Helpers de agendamento — puramente frontend. Geram datas/horários possíveis
// a partir da configuração (BOOKING_CONFIG), sem qualquer verificação real de
// disponibilidade (não há backend/banco de dados nesta demo).

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function hoursForDay(date, weeklyHours) {
  return weeklyHours.find((h) => h.day === date.getDay());
}

/** Lista de datas futuras (a partir de hoje) em que a barbearia abre. */
export function generateAvailableDates({ daysAhead, weeklyHours }) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < daysAhead; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const hours = hoursForDay(d, weeklyHours);
    if (hours && !hours.closed) dates.push(d);
  }
  return dates;
}

/** Horários possíveis para uma data, respeitando expediente e, se for hoje, o horário atual. */
export function generateTimeSlots(date, { weeklyHours, slotIntervalMinutes }) {
  const hours = hoursForDay(date, weeklyHours);
  if (!hours || hours.closed) return [];

  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);

  const cursor = new Date(date);
  cursor.setHours(openH, openM, 0, 0);
  const end = new Date(date);
  end.setHours(closeH, closeM, 0, 0);

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const slots = [];
  while (cursor < end) {
    if (!isToday || cursor > now) {
      slots.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + slotIntervalMinutes);
  }
  return slots;
}

export function formatDateShort(date) {
  return `${WEEKDAY_SHORT[date.getDay()]} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDateFull(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatDateLong(date) {
  return `${WEEKDAY_SHORT[date.getDay()]}, ${date.getDate()} de ${MONTH_SHORT[date.getMonth()]}`;
}

export function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
