import LivePreviewFrame from './LivePreviewFrame';

/**
 * Moldura de smartphone — chrome discreto (sem mockup 3D).
 * Duas variantes: "live" (padrão) mostra um recorte real do site via iframe;
 * "static" recebe conteúdo próprio (ex.: réplica visual de uma etapa do
 * agendamento) quando não há como representar aquele estado só com scroll.
 */
export default function PhoneFrame({ scrollTo = 0, label, className = '', children }) {
  const isStatic = Boolean(children);

  return (
    <div className={`pf-phone ${className}`}>
      <div className="pf-phone__notch" aria-hidden="true" />
      {isStatic ? (
        <div className="pf-phone__static" style={{ aspectRatio: '390 / 844' }}>
          {children}
        </div>
      ) : (
        <LivePreviewFrame baseWidth={390} baseHeight={844} scrollTo={scrollTo} />
      )}
      {label && <span className="pf-phone__label">{label}</span>}
    </div>
  );
}
