// Configuração central do site — troque estes valores para reaproveitar o
// template com outro cliente sem precisar caçar informações pelo código.
// Tudo que aparece no site (nome, contato, endereço, horários, serviços,
// fotos, equipe, avaliações, agendamento) vem daqui.

const BARBERSHOP_NAME = 'Barbearia Nobre';
const CITY = 'Jaguaribe';
const STATE = 'CE';
const ESTABLISHED_YEAR = 2006; // fonte única — usada no Hero, Sobre e nas estatísticas
const WHATSAPP_NUMBER = '558896408809'; // 55 + DDD + número, apenas dígitos

const yearsOfExperience = new Date().getFullYear() - ESTABLISHED_YEAR;

export const SITE = {
  name: BARBERSHOP_NAME,
  brand: 'NOBRE',
  city: CITY,
  state: STATE,
  establishedYear: ESTABLISHED_YEAR,
  yearsOfExperience,

  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagramHandle: '@barbearianobre',
  instagramUrl: 'https://instagram.com/barbearianobre',

  // Endereço de demonstração — troque pelo endereço real do estabelecimento.
  address: {
    line1: 'Rua Principal, 123',
    line2: `Centro — ${CITY}/${STATE}`,
  },
  // Demo: busca no Google Maps pelo endereço acima. Troque por um link real
  // (ou embed) quando houver um endereço de verdade.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Principal+123+Centro+Jaguaribe+CE',

  openingHours: [
    { days: 'Seg — Sex', time: '09:00 — 20:00' },
    { days: 'Sáb', time: '09:00 — 18:00' },
    { days: 'Dom', time: 'Fechado' },
  ],

  stats: [
    { value: String(yearsOfExperience), label: 'anos de experiência' },
    { value: '2.500+', label: 'clientes atendidos' },
  ],
};

export const NAV_LINKS = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Barbearia', href: '#barbearia' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Contato', href: '#contato' },
];

// ---------------------------------------------------------------------------
// Imagens — fotos de demonstração (Unsplash License, uso livre) preparadas
// para serem trocadas por fotos reais da barbearia quando disponíveis.
// Basta trocar o valor de cada URL por uma foto própria (ou import local).
// ---------------------------------------------------------------------------
function unsplash(id, width, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

// Apenas 2 fotografias no site inteiro — hero e a seção barbearia/trabalho.
// A foto do hero é usada num recorte vertical estreito, por isso é um close
// de trabalho (navalha/acabamento), não uma foto aberta do ambiente.
export const IMAGES = {
  hero: unsplash('1514336937476-a5b961020a5c', 900),
  barbershop: unsplash('1675599193990-33d71150902b', 1000),
};

// duration: minutos — usado apenas como referência visual, não bloqueia horários
export const SERVICES = [
  { id: 'corte', name: 'Corte Masculino', description: 'Corte feito de acordo com seu estilo, com acabamento e finalização.', price: 60, duration: 40 },
  { id: 'barba', name: 'Barba', description: 'Modelagem, alinhamento e acabamento com navalha.', price: 45, duration: 30 },
  { id: 'corte-barba', name: 'Corte + Barba', description: 'Serviço completo para cabelo e barba.', price: 95, duration: 60 },
  { id: 'acabamento', name: 'Acabamento', description: 'Retoque de contorno, nuca e acabamento na régua.', price: 30, duration: 20 },
  { id: 'infantil', name: 'Corte Infantil', description: 'Atendimento paciente para os pequenos.', price: 45, duration: 30 },
  { id: 'sobrancelha', name: 'Sobrancelha', description: 'Design na navalha ou na pinça.', price: 25, duration: 15 },
];

export const TEAM = [
  { id: 'lucas', first: 'Lucas', last: 'Mendes', specialty: 'Corte e degradê' },
  { id: 'rafael', first: 'Rafael', last: 'Costa', specialty: 'Barba e navalha' },
  { id: 'andre', first: 'André', last: 'Lima', specialty: 'Corte clássico' },
];

// Avaliação em destaque — conteúdo de demonstração. Troque pelo depoimento
// real de um cliente (não representa avaliação verificada).
export const FEATURED_REVIEW = {
  rating: 5,
  text: 'Lugar tranquilo, atendimento no horário e corte sempre bem feito.',
  author: 'João M.',
};

// ---------------------------------------------------------------------------
// Agendamento — apenas frontend (sem backend/banco de dados). Gera datas e
// horários com base nestas regras; a confirmação final acontece por WhatsApp.
// `day` segue Date.getDay(): 0 = domingo ... 6 = sábado.
// ---------------------------------------------------------------------------
export const BOOKING_CONFIG = {
  daysAhead: 14,
  slotIntervalMinutes: 30,
  weeklyHours: [
    { day: 0, closed: true },
    { day: 1, open: '09:00', close: '20:00' },
    { day: 2, open: '09:00', close: '20:00' },
    { day: 3, open: '09:00', close: '20:00' },
    { day: 4, open: '09:00', close: '20:00' },
    { day: 5, open: '09:00', close: '20:00' },
    { day: 6, open: '09:00', close: '18:00' },
  ],
};
