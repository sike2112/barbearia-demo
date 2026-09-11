import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SERVICES } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionVariants';
import { ArrowRightIcon } from './Icons';

const EASE = [0.16, 1, 0.3, 1];
const DEFAULT_ID = SERVICES.some((s) => s.id === 'corte-barba') ? 'corte-barba' : SERVICES[0].id;

export default function Services() {
  const prefersReduced = useReducedMotion();
  const { openBooking } = useBooking();

  // Desktop: menu + painel — o item ativo muda no hover/click e o painel da
  // direita reage. Mobile: acordeão independente (só um item aberto por
  // vez) — usa o próprio estado, não o `activeId` do desktop, porque nas
  // duas larguras a interação é diferente (hover vs. toque) e ficam ocultas
  // uma pra outra via CSS (nunca as duas montadas "ativas" ao mesmo tempo
  // pro usuário).
  const [activeId, setActiveId] = useState(DEFAULT_ID);
  const [openMobileId, setOpenMobileId] = useState(null);

  const activeIndex = SERVICES.findIndex((s) => s.id === activeId);
  const activeService = SERVICES[activeIndex] ?? SERVICES[0];

  return (
    <section id="servicos" className="section section--tight">
      <div className="container">
        <motion.div className="services__head" {...fadeUp(prefersReduced, { y: 10 })}>
          <span className="section-index">01</span>
          <span className="services__eyebrow">Serviços</span>
          <span className="services__rule" aria-hidden="true" />
        </motion.div>

        {/* Desktop/tablet: menu compacto à esquerda + painel editorial do
            serviço ativo à direita. Escondido em telas estreitas (ver
            .services__split no CSS) em favor do acordeão abaixo. */}
        <motion.div className="services__split" {...fadeUp(prefersReduced, { y: 16 })}>
          <nav className="services__menu" aria-label="Lista de serviços">
            {SERVICES.map((service, index) => {
              const isActive = service.id === activeId;
              const featured = service.id === 'corte-barba';
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`services__menu-item${isActive ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveId(service.id)}
                  onFocus={() => setActiveId(service.id)}
                  onClick={() => setActiveId(service.id)}
                >
                  <span className="services__menu-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="services__menu-name">
                    {service.name}
                    {featured && <span className="services__menu-tag">Mais pedido</span>}
                  </span>
                  <span className="services__menu-price">R$ {service.price}</span>
                </button>
              );
            })}
          </nav>

          <div className="services__panel">
            <span className="services__panel-bignum" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                className="services__panel-inner"
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <span className="services__panel-kicker">Serviço</span>
                <h3 className="services__panel-name">{activeService.name}</h3>
                {activeService.id === 'corte-barba' && <span className="services__panel-badge">Mais pedido</span>}
                <p className="services__panel-desc">{activeService.description}</p>
                <span className="services__panel-price">R$ {activeService.price}</span>
                <button type="button" className="services__panel-cta" onClick={() => openBooking(activeService.id)}>
                  <span>Agendar este serviço</span>
                  <ArrowRightIcon />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mobile: acordeão — lista compacta, um item aberto por vez, CTA
            dentro do próprio item aberto. Escondido no desktop via CSS. */}
        <motion.div className="services__accordion" {...staggerContainer(prefersReduced)}>
          {SERVICES.map((service, index) => {
            const isOpen = service.id === openMobileId;
            const featured = service.id === 'corte-barba';
            return (
              <motion.div
                key={service.id}
                className={`services__acc-item${isOpen ? ' is-open' : ''}`}
                {...staggerItem(prefersReduced, { y: 10 })}
              >
                <button
                  type="button"
                  className="services__acc-head"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMobileId(isOpen ? null : service.id)}
                >
                  <span className="services__acc-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="services__acc-name">
                    {service.name}
                    {featured && <span className="services__menu-tag">Mais pedido</span>}
                  </span>
                  <span className="services__acc-price">R$ {service.price}</span>
                  <ArrowRightIcon className="services__acc-caret" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="services__acc-body"
                      initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <p className="services__acc-desc">{service.description}</p>
                      <button type="button" className="services__acc-cta" onClick={() => openBooking(service.id)}>
                        <span>Agendar este serviço</span>
                        <ArrowRightIcon />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
