import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SITE, NAV_LINKS } from '../config/site';
import { useBooking } from '../lib/BookingContext';
import { MenuIcon, CloseIcon, NobreMark } from './Icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const navRef = useRef(null);
  const { openBooking } = useBooking();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header" ref={navRef}>
      <div className="header__inner container">
        <a href="#inicio" className="header__logo">
          <NobreMark className="header__mark" width={24} height={24} />
          {SITE.brand}
        </a>

        <nav className="header__nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <button type="button" className="header__cta" onClick={() => openBooking()}>
            Agendar
          </button>
          <button
            type="button"
            className="header__menu-btn"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            className="mobile-menu"
            initial={prefersReduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Navegação mobile"
          >
            <div className="mobile-menu__inner">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="mobile-menu__link" onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                className="btn btn--light mobile-menu__cta"
                onClick={() => {
                  closeMenu();
                  openBooking();
                }}
              >
                Agendar horário
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
