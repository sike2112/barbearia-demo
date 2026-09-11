import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'motion/react';
import { SITE } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { NobreMark, ArrowRightIcon } from './Icons';
import HeroLedOutline from './HeroLedOutline';

const EASE = [0.16, 1, 0.3, 1];

/** Linha de texto que entra com reveal (máscara + translateY), sem depender de foto. */
function RevealLine({ children, className, delay, prefersReduced }) {
  return (
    <span className="hero__line-mask">
      <motion.span
        className={className}
        initial={prefersReduced ? false : { y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Navalha estilizada em SVG — elemento gráfico próprio do projeto (sem asset
 * externo), com gradientes em várias bandas para simular volume/reflexo
 * metálico, rebites no cabo e um detalhe vermelho discreto na lâmina. */
function RazorGlyph(props) {
  return (
    <svg viewBox="0 0 460 160" fill="none" {...props}>
      <defs>
        <linearGradient id="razorBlade" x1="150" y1="58" x2="446" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--ink-faint)" />
          <stop offset="0.24" stopColor="var(--ink-dim)" />
          <stop offset="0.42" stopColor="var(--ink)" />
          <stop offset="0.5" stopColor="var(--ink)" stopOpacity="0.92" />
          <stop offset="0.58" stopColor="var(--ink)" />
          <stop offset="0.78" stopColor="var(--ink-dim)" />
          <stop offset="1" stopColor="var(--ink-faint)" />
        </linearGradient>
        <linearGradient id="razorHandle" x1="10" y1="60" x2="160" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--bg-panel)" />
          <stop offset="0.5" stopColor="var(--bg-raised)" />
          <stop offset="1" stopColor="var(--bg-panel)" />
        </linearGradient>
      </defs>

      {/* cabo — duas réguas sobrepostas, com rebites, sugerindo volume */}
      <path d="M12,84 L158,101 L158,114 L12,97 Z" fill="var(--bg-panel)" stroke="var(--line)" strokeWidth="1" />
      <path d="M18,60 L158,77 L158,90 L18,73 Z" fill="url(#razorHandle)" stroke="var(--line)" strokeWidth="1" />
      <circle cx="48" cy="65.5" r="2.2" fill="var(--ink-faint)" opacity="0.6" />
      <circle cx="96" cy="71" r="2.2" fill="var(--ink-faint)" opacity="0.6" />
      <circle cx="140" cy="76" r="2.2" fill="var(--ink-faint)" opacity="0.6" />

      {/* pino/dobradiça */}
      <circle cx="158" cy="83.5" r="7.5" fill="var(--bg)" stroke="var(--ink-dim)" strokeWidth="1.5" />
      <circle cx="158" cy="83.5" r="2.4" fill="var(--ink-faint)" />

      {/* lâmina — corpo com gradiente multi-banda para efeito de volume/reflexo */}
      <path
        d="M156,75 C244,60 356,62 444,80 L458,84 L444,90 C356,106 244,102 156,88 Z"
        fill="url(#razorBlade)"
        stroke="var(--ink-faint)"
        strokeWidth="0.75"
      />
      {/* fio de corte — linha de destaque vermelha discreta acompanhando o gume */}
      <path
        d="M158,76.5 C246,61.5 356,63.5 442,81"
        stroke="var(--rust)"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* highlight metálico secundário, mais fino, reforça sensação de curvatura */}
      <path
        d="M170,81 C260,70 350,71 430,84"
        stroke="var(--ink)"
        strokeOpacity="0.5"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();
  const heroRef = useRef(null);
  const nobreLayerRef = useRef(null);
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = (e) => setCanHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const active = canHover && !prefersReduced;

  // ---- Parallax por mouse (só desktop com ponteiro fino) --------------------
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 110, damping: 20, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 110, damping: 20, mass: 0.6 });

  const handlePointerMove = (e) => {
    if (!active || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  // ---- Reação ao início do scroll -------------------------------------------
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const zeroMotionValue = useMotionValue(0);
  const scrollT = prefersReduced ? zeroMotionValue : scrollYProgress;

  const backX = useTransform([springX, scrollT], ([sx, st]) => sx * 5 - st * 8);
  const backY = useTransform([springY, scrollT], ([sy, st]) => sy * 3 - st * 14);
  const backOpacity = useTransform(scrollT, [0, 0.7], [1, 0.4]);

  const objX = useTransform(springX, (v) => v * 18);
  const objY = useTransform([springY, scrollT], ([sy, st]) => sy * 12 - st * 34);
  const objScale = useTransform(scrollT, [0, 1], [1, 0.92]);
  const objRotateY = useTransform(springX, (v) => v * 9);
  const objRotateX = useTransform(springY, (v) => v * -7);

  const frontX = useTransform(springX, (v) => v * -9);
  const frontY = useTransform([springY, scrollT], ([sy, st]) => sy * -6 - st * 46);

  const footOpacity = useTransform(scrollT, [0, 0.55], [1, 0]);

  return (
    <section
      id="inicio"
      className="hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero__noise" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__inner">
        <motion.div initial={prefersReduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <NobreMark className="hero__mark" width={22} height={22} />
        </motion.div>

        <div className="hero__stage">
          <motion.div
            className="hero__layer hero__layer--back"
            ref={nobreLayerRef}
            style={{ x: backX, y: backY, opacity: backOpacity }}
          >
            <RevealLine className="hero__word hero__word--big" delay={0.05} prefersReduced={prefersReduced}>
              Nobre
            </RevealLine>
            <HeroLedOutline containerRef={nobreLayerRef} />
          </motion.div>

          <motion.div
            className="hero__layer hero__layer--object"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            <motion.div
              className="hero__object-inner"
              style={{ x: objX, y: objY, scale: objScale, rotateX: objRotateX, rotateY: objRotateY }}
            >
              <RazorGlyph className="hero__object" />
            </motion.div>
          </motion.div>

          <motion.div className="hero__layer hero__layer--front" style={{ x: frontX, y: frontY }}>
            <RevealLine className="hero__word hero__word--sub hero__word--accent" delay={0.3} prefersReduced={prefersReduced}>
              Barbearia
            </RevealLine>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48, ease: EASE }}
        >
          <motion.div className="hero__foot" style={{ opacity: footOpacity }}>
            <p className="hero__meta">
              {SITE.city} — {SITE.state} <span className="hero__dot" /> Agendamento online
            </p>
            <button type="button" className="hero__cta" onClick={() => openBooking()}>
              <span>Agendar horário</span>
              <ArrowRightIcon />
              <span className="hero__cta-underline" aria-hidden="true" />
              <span className="hero__cta-dot" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
