import LivePreviewFrame from './LivePreviewFrame';

/** Moldura de navegador desktop — chrome falso ao redor do preview real do site. */
export default function BrowserFrame({ scrollTo = 0, className = '' }) {
  return (
    <div className={`pf-browser ${className}`}>
      <div className="pf-browser__bar">
        <span className="pf-browser__dot" />
        <span className="pf-browser__dot" />
        <span className="pf-browser__dot" />
        <span className="pf-browser__url">nobrebarbearia.com.br</span>
      </div>
      <LivePreviewFrame baseWidth={1440} baseHeight={800} scrollTo={scrollTo} />
    </div>
  );
}
