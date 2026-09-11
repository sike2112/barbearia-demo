import { SITE } from '../config/site';
import { InstagramIcon, WhatsappIcon, NobreMark } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <p className="footer__brand">
            <NobreMark width={18} height={18} />
            {SITE.brand}
          </p>

          <div className="footer__links">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
              <InstagramIcon width={15} height={15} />
              Instagram
            </a>
            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
              <WhatsappIcon width={15} height={15} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__tagline">
            Corte • Barba • {SITE.city}
          </span>
          <span className="footer__copy">
            © {year} {SITE.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
