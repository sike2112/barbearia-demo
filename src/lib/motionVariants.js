// Helpers de animação reutilizáveis (Motion). Centralizados aqui para manter
// as durações/easings consistentes e para respeitar prefers-reduced-motion
// em um único lugar.

const EASE = [0.16, 1, 0.3, 1];

/** Fade + slide-up ao entrar na viewport (uma vez só). */
export function fadeUp(prefersReduced, { delay = 0, y = 24, duration = 0.6 } = {}) {
  if (prefersReduced) {
    return { initial: { opacity: 1 }, animate: { opacity: 1 } };
  }
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration, delay, ease: EASE },
  };
}

/** Fade + slide lateral (para o hero, entrada da esquerda por padrão). */
export function fadeSide(prefersReduced, { delay = 0, x = -24, duration = 0.6 } = {}) {
  if (prefersReduced) {
    return { initial: { opacity: 1 }, animate: { opacity: 1 } };
  }
  return {
    initial: { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { duration, delay, ease: EASE },
  };
}

/** Container com stagger para listas/grids de cards. */
export function staggerContainer(prefersReduced, { staggerChildren = 0.08, delayChildren = 0 } = {}) {
  if (prefersReduced) {
    return { initial: 'visible', whileInView: 'visible', viewport: { once: true } };
  }
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0.15 },
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren, delayChildren } },
    },
  };
}

/** Item filho de um staggerContainer. */
export function staggerItem(prefersReduced, { y = 20, duration = 0.5 } = {}) {
  if (prefersReduced) {
    return { variants: { hidden: { opacity: 1 }, visible: { opacity: 1 } } };
  }
  return {
    variants: {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
    },
  };
}
