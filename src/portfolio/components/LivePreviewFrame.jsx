import { useRef } from 'react';
import { useScaleToFit } from '../useScaleToFit';

/**
 * Preview real e não-interativo do site principal, via iframe same-origin
 * apontando para "/". Usa contentWindow.scrollTo (mesma origem) para exibir
 * um recorte específico da página (hero, serviços, etc.) sem precisar de
 * screenshots estáticos. Totalmente pointer-events:none — é uma vitrine,
 * nunca um caminho para o fluxo de agendamento real.
 */
export default function LivePreviewFrame({ baseWidth, baseHeight, scrollTo = 0, className = '' }) {
  const iframeRef = useRef(null);
  const { ref, scale, height } = useScaleToFit(baseWidth, baseHeight);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    try {
      const win = iframe.contentWindow;
      const doc = win.document;
      const style = doc.createElement('style');
      style.textContent = '::-webkit-scrollbar{display:none} html{scrollbar-width:none;}';
      doc.head.appendChild(style);

      const applyScroll = () => win.scrollTo({ top: scrollTo, left: 0, behavior: 'auto' });
      applyScroll();

      // Reaplica depois que fontes e layout assentam: no momento do "load"
      // do iframe, o documento pode ainda não ter altura final (fontes web
      // carregando), e o navegador "clampa" o scrollTo para um valor menor
      // (às vezes 0) — isso fazia o recorte de "Serviços" cair de volta no
      // topo, idêntico ao do Home.
      doc.fonts?.ready?.then(applyScroll).catch(() => {});
      win.requestAnimationFrame(() => win.requestAnimationFrame(applyScroll));
      setTimeout(applyScroll, 300);
    } catch {
      // Same-origin esperado; se algo impedir o acesso, o preview ainda
      // funciona visualmente, só sem o recorte de scroll.
    }
  };

  return (
    <div className={`pf-frame-scaler ${className}`} ref={ref} style={{ height }}>
      <div
        className="pf-frame-inner"
        style={{ width: baseWidth, height: baseHeight, transform: `scale(${scale})` }}
      >
        <iframe
          ref={iframeRef}
          src="/"
          title="Preview do site NOBRE Barbearia"
          tabIndex={-1}
          aria-hidden="true"
          scrolling="no"
          onLoad={handleLoad}
          style={{ width: baseWidth, height: baseHeight }}
        />
      </div>
    </div>
  );
}
