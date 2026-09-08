import { useEffect, useRef, useState } from 'react';

/**
 * Escala um frame de largura fixa (baseWidth) para caber na largura real do
 * container responsivo, mantendo a proporção — usado pelos mockups de
 * desktop/mobile do portfólio, que precisam parecer sempre "inteiros" em
 * qualquer viewport (celular, tablet, 1440px, 1920px).
 */
export function useScaleToFit(baseWidth, baseHeight) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setScale(width / baseWidth);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [baseWidth]);

  return { ref, scale, height: baseHeight * scale };
}
