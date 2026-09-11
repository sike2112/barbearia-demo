import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Faíscas de LED neon percorrendo o contorno real das letras N O B R E do
 * hero.
 *
 * TÉCNICA (mecanismo de movimento inalterado desde a versão que passou a
 * funcionar de verdade):
 * 1. Cada letra tem um <path> SVG com o contorno EXTERNO real, extraído da
 *    MESMA fonte usada no NOBRE (Oswald, weight 700, via opentype.js — ver
 *    nota em GLYPHS abaixo). Ele serve de referência geométrica (via
 *    getTotalLength()/getPointAtLength()) para vários OUTROS <path>
 *    ("segmentos" da cauda) cujo próprio atributo `d` é reescrito a cada
 *    quadro com um sub-trecho curto amostrado desse contorno (ver
 *    buildSegmentD) — não usamos stroke-dasharray/dashoffset (motivo: uma
 *    particularidade real de renderização do Chromium para
 *    non-scaling-stroke + dasharray com "aceso" bem menor que "apagado" faz
 *    o traço simplesmente não pintar para boa parte dos deslocamentos; ver
 *    comentário grande perto de buildSegmentD).
 * 2. Cada path é posicionado sobre a letra real via <g transform>. A posição
 *    (x do pen/baseline de cada caractere) vem de
 *    SVGTextContentElement.getStartPositionOfChar() num <text> de medição —
 *    ao contrário de getExtentOfChar()/getBBox()/Range, que devolvem a caixa
 *    "em" inteira da fonte (não a posição real de desenho), essa API dá o
 *    ponto onde a fonte de fato ancora o glifo, exatamente o mesmo referencial
 *    usado pelos paths extraídos (ver nota em GLYPH_UNITS_PER_EM). A escala é
 *    ÚNICA (uniforme em X e Y) derivada de font-size/unitsPerEm — nada de
 *    esticar o path para "caber" numa caixa.
 * 3. O movimento é calculado quadro a quadro com
 *    SVGPathElement.getTotalLength()/getPointAtLength(): um loop de
 *    requestAnimationFrame calcula o "progress" (0→1) de cada faísca a
 *    partir do tempo decorrido e escreve a posição direto nos elementos via
 *    refs (sem re-render do React).
 * 4. Sem cabeça/ponto separado: o próprio trecho iluminado (o sub-`d` curto
 *    descrito acima) é o efeito inteiro, sem nenhuma transformação extra,
 *    então SEMPRE coincide exatamente com o path real, curvas e cantos
 *    inclusos. Para ler como ENERGIA em movimento (frente intensa, cauda
 *    esmaecendo) em vez de uma cordinha sólida, a mesma cauda é dividida em
 *    vários sub-segmentos curtos e consecutivos (cada um com seu próprio
 *    `d`, recalculado todo quadro), cada um com uma opacity
 *    progressivamente menor da frente pra trás — um "degradê" em blocos
 *    (████▓▒░), não um gradiente contínuo.
 */

// Contorno EXTERNO de cada letra — extraído da fonte REAL usada no NOBRE
// (Oswald, weight 700, o mesmo arquivo .ttf que o navegador baixa do Google
// Fonts para var(--font-display)) via opentype.js (`glyph.getPath`), não uma
// fonte parecida nem uma aproximação manual. Para letras com contraformas
// (O, B, R), a fonte tem múltiplos subpaths (contorno externo + 1-2
// "buracos" internos); mantemos aqui SÓ o subpath de maior área (o externo)
// — descartamos os internos de propósito, tanto para não haver salto de
// getPointAtLength() entre contornos desconectados quanto porque a faísca
// deve percorrer a borda externa, não as contraformas.
//
// Coordenadas: cada `d` está no referencial nativo do opentype.js —
// glyph.getPath(0, 0, GLYPH_UNITS_PER_EM) — ou seja, x=0/y=0 é o ponto onde a
// fonte ancora o caractere (o mesmo ponto que getStartPositionOfChar() lê no
// texto real) e as coordenadas já estão na escala de um "font-size" de
// GLYPH_UNITS_PER_EM px. É por isso que basta transladar para esse ponto e
// aplicar uma escala uniforme (ver GLYPH_UNITS_PER_EM abaixo) — sem precisar
// normalizar por minX/minY nem esticar por largura/altura de caixa.
const GLYPHS = {
  N: { d: 'M213.00,0.00 L60.00,0.00 L60.00,-810.00 L186.00,-810.00 L352.00,-420.00 L352.00,-810.00 L500.00,-810.00 L500.00,0.00 L379.00,0.00 L213.00,-420.00 L213.00,0.00 Z' },
  O: {
    // Só o contorno externo (área 365437 de 2 subpaths); o "buraco" central
    // (área 67302) foi descartado.
    d: 'M292.00,12.00 Q201.00,12.00 148.00,-20.00 Q95.00,-52.00 72.00,-112.00 Q49.00,-172.00 49.00,-255.00 L49.00,-556.00 Q49.00,-640.00 72.00,-699.00 Q95.00,-758.00 148.00,-789.50 Q201.00,-821.00 292.00,-821.00 Q384.00,-821.00 437.50,-789.50 Q491.00,-758.00 514.00,-699.00 Q537.00,-640.00 537.00,-556.00 L537.00,-255.00 Q537.00,-172.00 514.00,-112.00 Q491.00,-52.00 437.50,-20.00 Q384.00,12.00 292.00,12.00 Z',
  },
  B: {
    // Só o contorno externo (área 362720 de 3 subpaths); as duas
    // contraformas internas (30777 e 23992, as "barrigas" do B) foram
    // descartadas de propósito.
    d: 'M309.00,0.00 L60.00,0.00 L60.00,-810.00 L271.00,-810.00 Q323.00,-810.00 369.50,-802.00 Q416.00,-794.00 452.00,-771.50 Q488.00,-749.00 508.50,-707.50 Q529.00,-666.00 529.00,-598.00 Q529.00,-549.00 514.50,-515.50 Q500.00,-482.00 473.50,-462.00 Q447.00,-442.00 410.00,-435.00 Q457.00,-429.00 489.00,-404.50 Q521.00,-380.00 537.50,-339.00 Q554.00,-298.00 554.00,-240.00 Q554.00,-177.00 537.50,-131.50 Q521.00,-86.00 490.00,-57.00 Q459.00,-28.00 413.50,-14.00 Q368.00,0.00 309.00,0.00 Z',
  },
  R: {
    // Só o contorno externo (área 333457 de 2 subpaths); a contraforma da
    // "barriga" do R (29740) foi descartada de propósito.
    d: 'M239.00,0.00 L60.00,0.00 L60.00,-810.00 L283.00,-810.00 Q365.00,-810.00 425.00,-792.00 Q485.00,-774.00 518.50,-727.50 Q552.00,-681.00 552.00,-596.00 Q552.00,-546.00 544.00,-507.00 Q536.00,-468.00 514.50,-439.50 Q493.00,-411.00 453.00,-392.00 L564.00,0.00 L379.00,0.00 L290.00,-363.00 L239.00,-363.00 L239.00,0.00 Z',
  },
  E: { d: 'M426.00,0.00 L60.00,0.00 L60.00,-810.00 L424.00,-810.00 L424.00,-688.00 L239.00,-688.00 L239.00,-487.00 L380.00,-487.00 L380.00,-363.00 L239.00,-363.00 L239.00,-121.00 L426.00,-121.00 L426.00,0.00 Z' },
};

const LETTERS = ['N', 'O', 'B', 'R', 'E'];

// unitsPerEm do Oswald é 1000 (confirmado via opentype.js: font.unitsPerEm).
// Os `d` acima vieram de glyph.getPath(0, 0, 1000) — ou seja, já extraídos
// exatamente na escala "font-size = 1000px". Por isso a escala de execução é
// simplesmente fontSizePx / 1000 (equivalente a fontSizePx / unitsPerEm),
// aplicada IGUALMENTE em X e Y — nunca esticada por largura/altura de caixa.
const GLYPH_UNITS_PER_EM = 1000;

// Métricas verticais reais do MESMO arquivo Oswald-Bold.ttf (lidas via
// opentype.js: font.ascender / font.descender), em unidades de fonte (mesma
// escala de GLYPH_UNITS_PER_EM). Usadas só para calcular a baseline real do
// texto dentro da caixa de linha CSS (ver getBaselineY abaixo) — não são
// "números mágicos" por letra, são a métrica vertical da fonte inteira.
const FONT_ASCENDER = 1193;
const FONT_DESCENDER = -289;

// A baseline de uma linha de texto CSS não fica no meio geométrico da
// line-box: o navegador centraliza o retângulo ascent+descent da fonte
// dentro da line-box (line-height) e a baseline fica a `ascent` de distância
// do topo desse retângulo centralizado. Fórmula padrão (half-leading):
//   baselineFromTop = (lineBoxHeight + ascentPx - descentPx) / 2
// Isso é o que explica por que um simples "meio da caixa" (dominantBaseline
// central em SVG, ou box.height/2) NÃO bate com a baseline real quando
// ascent+descent da fonte é bem maior que o line-height (aqui,
// (1193+289)/1000 = 148% do font-size vs line-height 0.94 = 94%: a fonte
// "vaza" da line-box, e o excesso é distribuído igualmente acima/abaixo).
function getBaselineY(lineBoxHeightPx, fontSizePx) {
  const ascentPx = (fontSizePx * FONT_ASCENDER) / GLYPH_UNITS_PER_EM;
  const descentPx = (fontSizePx * -FONT_DESCENDER) / GLYPH_UNITS_PER_EM;
  return (lineBoxHeightPx + ascentPx - descentPx) / 2;
}

// Ative para desenhar o contorno real (verde) por cima do lettering e
// conferir visualmente o alinhamento. Deixar `false` em produção.
const DEBUG_SHOW_OUTLINE = false;

// TESTE TEMPORÁRIO DE DIAGNÓSTICO — quando true, ignora toda a animação/
// dash/glow e desenha UMA única linha sólida forçada por cima do hero, só
// pra confirmar visualmente se a camada SVG (z-index, viewBox, clipping,
// mask, overflow, posicionamento) está correta. Desligar depois do teste.
const DEBUG_FORCE_SOLID_LINE = false;

// 3 luzes simultâneas, mas NÃO presas permanentemente a uma letra — a pedido
// explícito, o padrão anterior (cada luz sempre na mesma letra, para sempre)
// lia como "cobra circulando o N/B/E". Cada luz agora faz UMA volta completa
// (progresso 0→1, sempre seguindo o path real da letra sorteada — isso não
// muda) numa letra sorteada, com fase inicial e duração também sorteadas
// dentro de uma faixa, e ao terminar a volta sorteia OUTRA letra (evitando
// letras já ocupadas por outra luz no momento, pra nunca concentrar 2+ luzes
// na mesma letra ao mesmo tempo). O movimento dentro de uma volta continua
// perfeitamente contínuo e previsível (sem tremor) — só a ESCOLHA de
// letra/fase/duração de cada volta é que varia.
const NUM_LIGHTS = 3;
// Duração de uma volta completa — ~1.7–2x mais rápido que antes (2.8–3.5s).
const LIGHT_DURATION_MIN = 1.5;
const LIGHT_DURATION_MAX = 1.9;

// Comprimento da descarga — VARIÁVEL por luz (sorteado a cada troca de
// letra, ver tick()), não mais um valor fixo — "algumas curtas, algumas
// médias", evitando a barra sempre-do-mesmo-tamanho de antes.
const TAIL_LENGTH_PX_MIN = 16.1; // +15% (era 14)
const TAIL_LENGTH_PX_MAX = 34.5; // +15% (era 30)

// APARÊNCIA "DESCARGA ELÉTRICA" (a pedido explícito, substitui o traço
// laranja uniforme anterior que lia como barra/fita): a cauda inteira é
// dividida em TAIL_CHUNKS pedacinhos consecutivos — chunk 0 é o fim da
// cauda (quase invisível), o ÚLTIMO chunk é a ponta/cabeça (núcleo branco
// muito intenso), com opacity E COR crescendo entre eles (vermelho escuro →
// laranja → amarelo quente → branco): não é só mais claro no fim, é uma cor
// DIFERENTE — isso é o que faz parecer energia em vez de uma barra colorida
// deslizando. Cada chunk é seu próprio <path> curto (poucos pontos,
// amostrados com getPointAtLength — mesma técnica de sempre, só "fatiada"),
// então a trajetória/velocidade/lógica de movimento não mudam em nada — só
// COMO o mesmo trecho é desenhado.
const TAIL_CHUNKS = 6;
const CHUNK_SAMPLES = 3; // pontos internos por chunk — curva suave sem facetar
// Cor do corpo principal (o "halo intermediário intenso") em CADA chunk —
// do fim da cauda (vermelho bem escuro, quase apagado) até a ponta
// (amarelo/laranja bem claro, quase se fundindo no núcleo branco).
const MAIN_CHUNK_COLOR = ['#5c1200', '#8a2000', '#c03d00', '#f05e00', '#ff8f1a', '#ffc46a'];
// Opacidades +~15-20% em relação à versão anterior (0.05/0.14/0.28/0.48/
// 0.72/0.95 e 0.04/0.1/0.2/0.36/0.55/0.78) — só pra ficar mais fácil de
// enxergar sobre as letras; a curva/gradiente relativo entre chunks é a
// mesma de antes, só escalada pra cima.
const MAIN_CHUNK_OPACITY = [0.06, 0.16, 0.32, 0.55, 0.83, 1];
const GLOW_CHUNK_OPACITY = [0.05, 0.12, 0.24, 0.43, 0.66, 0.94];
// Núcleo quase-branco: só nos chunks finais (perto da ponta) — a descarga
// "acende" perto da cabeça, não ao longo de toda a cauda.
const CORE_CHUNK_COUNT = 2;
const CORE_CHUNK_OPACITY = [0.63, 1];

const MOBILE_BREAKPOINT_PX = 768;
// Corpo principal — moderado (a largura "física" real do traço); a
// sensação de mais luz/energia vem do glow (abaixo), não de engordar isto.
const MAIN_STROKE_PX = 5;
const MAIN_STROKE_PX_MOBILE = 3;
// Núcleo — bem mais fino que o corpo, quase branco — sensação de "muito
// luminoso" sem aumentar a espessura percebida.
const CORE_STROKE_PX = MAIN_STROKE_PX * 0.3;
const CORE_STROKE_PX_MOBILE = MAIN_STROKE_PX_MOBILE * 0.3;
// Halo — largo e MUITO desfocado, a peça que carrega a maior parte da
// sensação de luz/energia irradiando, sem aumentar a espessura física do
// corpo principal.
const GLOW_STROKE_PX = 18;
const GLOW_STROKE_PX_MOBILE = 11;
const GLOW_BLUR = 6;
const GLOW_BLUR_MOBILE = 3.8;

// "Flicker" elétrico — não é UMA senoide suave (isso lia como respiração
// lenta, não elétrico); é a SOMA de duas ondas com períodos bem diferentes
// (uma lenta, uma rápida), cada luz com sua própria fase — dá uma
// irregularidade tipo "100% → 70% → 95% → 80% → 100%" sem nunca cair a
// ponto de sumir e sem virar estroboscópico (continua uma soma de senos,
// suave ponto a ponto, só não-periódica de forma óbvia).
const FLICKER_MIN = 0.68;
const FLICKER_MAX = 1;
const FLICKER_PERIOD_SLOW_MS = 420;
const FLICKER_PERIOD_FAST_MS = 130;

/** Comprimento de arco sempre dentro de [0, total) — trata o path como um laço fechado. */
function wrapLength(s, total) {
  const m = s % total;
  return m < 0 ? m + total : m;
}

/**
 * Sorteia a próxima letra para a luz `myIndex`, evitando (quando possível)
 * as letras que as OUTRAS luzes estão ocupando agora — é isso que garante
 * "evite vários segmentos concentrados simultaneamente na mesma letra":
 * com 3 luzes e até 5 letras disponíveis, sempre sobra pelo menos 1 letra
 * livre das outras 2, então nunca duas luzes ficam na mesma letra ao mesmo
 * tempo (a não ser que só exista 1 letra medida ainda, caso raro/transitório
 * logo na primeira medição).
 */
function pickNextLetter(lights, myIndex, availableLetters) {
  const usedByOthers = new Set(
    lights.filter((_, idx) => idx !== myIndex).map((l) => l.letter).filter(Boolean),
  );
  const free = availableLetters.filter((letter) => !usedByOthers.has(letter));
  const pool = free.length > 0 ? free : availableLetters;
  return pool[Math.floor(Math.random() * pool.length)];
}

// CAUSA REAL de "os LEDs somem com prefers-reduced-motion" (investigado a
// fundo com testes isolados no navegador, variando UMA variável de cada
// vez): stroke-dasharray/stroke-dashoffset sobre o path inteiro da letra,
// combinado com vector-effect="non-scaling-stroke" (necessário pro traço
// manter espessura constante apesar do <g scale(~0.2)>), tem um
// comportamento de renderização não-confiável no Chromium para essa
// combinação específica — "aceso" bem menor que "apagado", path com escala
// bem reduzida. Confirmado isolando um elemento por vez (sem nenhuma
// interferência de CSS/opacity/filter): para boa parte dos valores de
// dashoffset, NADA é pintado na tela, mesmo com a geometria correta
// (confirmado com getPointAtLength()) e mesmo o MESMO path sem dasharray
// (stroke-dasharray:none) pintando o contorno inteiro perfeitamente. Ou
// seja: uma particularidade de renderização real, não um erro de cálculo —
// e não dá pra confiar que ela sempre "por sorte" funcione durante a
// animação contínua (o comportamento pode variar por navegador/GPU).
//
// Fix: abandonamos stroke-dasharray/dashoffset por completo (tanto no
// frame estático de prefers-reduced-motion quanto na animação normal) e
// desenhamos a cauda como um sub-trecho LITERAL do contorno — um `d` novo,
// curto, amostrado a cada quadro com getPointAtLength() e escrito direto no
// atributo `d` do próprio elemento (sem dasharray nenhum, só um traço
// sólido comum, que sabemos que sempre pinta). O comprimento/posição/opacity
// de cada segmento continuam exatamente os mesmos de antes — só a forma de
// "recortar" o trecho visível do path mudou.
function findTopmostProgress(path, total, samples = 48) {
  let bestProgress = 0;
  let bestY = Infinity;
  for (let i = 0; i < samples; i += 1) {
    const d = (i / samples) * total;
    const pt = path.getPointAtLength(d);
    if (pt.y < bestY) {
      bestY = pt.y;
      bestProgress = i / samples;
    }
  }
  return bestProgress;
}

/**
 * Divide a cauda inteira (terminando em `endDistance`, com `localLen`
 * unidades de comprimento) em `chunks` pedacinhos consecutivos e devolve um
 * array de `d` SVG literais ("M x,y L x,y ..."), um por chunk — chunk 0 é o
 * fim da cauda, o último é a ponta (= exatamente `endDistance`). Cada chunk
 * vira seu próprio <path> curto, o que permite variar opacity ao longo do
 * comprimento (cauda fraca → ponta intensa) sem stroke-dasharray/dashoffset
 * (ver comentário grande acima sobre por que essa técnica foi abandonada).
 */
function buildSegmentChunks(path, total, endDistance, localLen, chunks, samplesPerChunk = CHUNK_SAMPLES) {
  const chunkLen = localLen / chunks;
  const out = [];
  for (let c = 0; c < chunks; c += 1) {
    const chunkEnd = endDistance - localLen + chunkLen * (c + 1);
    let d = '';
    for (let s = 0; s <= samplesPerChunk; s += 1) {
      const dist = chunkEnd - chunkLen + (chunkLen * s) / samplesPerChunk;
      const wrapped = ((dist % total) + total) % total;
      const pt = path.getPointAtLength(wrapped);
      d += `${s === 0 ? 'M' : 'L'}${pt.x.toFixed(2)},${pt.y.toFixed(2)} `;
    }
    out.push(d);
  }
  return out;
}

export default function HeroLedOutline({ containerRef }) {
  // `box`: tamanho do container real (mesmo container que a SVG preenche via
  // inset:0). Usado só para posicionar o <text> de medição no mesmo lugar
  // (centro) onde o texto real é centralizado por CSS (align-items:center).
  const [box, setBox] = useState(null);
  // `font`: medido direto do texto real (getComputedStyle). Serve só para
  // dimensionar o <text> de medição abaixo — não é usado para desenhar nada
  // visível.
  const [font, setFont] = useState(null);
  // `layout`: posição real (pen/baseline) de cada letra + escala uniforme,
  // derivadas do <text> de medição (ver useEffect mais abaixo).
  const [layout, setLayout] = useState(null);
  const prefersReduced = useReducedMotion();

  // Só controla espessura do traço (MAIN_STROKE_PX/MAIN_STROKE_PX_MOBILE) —
  // nunca a geometria/posição das letras.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const measureTextRef = useRef(null);
  const pathRefs = useRef({});
  const pathLengths = useRef({});
  // Cada luz é independente da letra que está ocupando no momento — por
  // isso os elementos visuais (glowEls/mainEls/coreEls, um array por CHUNK —
  // ver TAIL_CHUNKS) e o <g> que os posiciona (groupEl) ficam num array por
  // ÍNDICE DE LUZ (0..NUM_LIGHTS-1), não por letra. `letter`/`startTime`/
  // `duration`/`phase0`/`tailLengthPx`/`pulsePhase`/`pulsePhase2` guardam o
  // estado da volta atual de cada luz (ver pickNextLetter/tick mais abaixo).
  const lightsRef = useRef(
    Array.from({ length: NUM_LIGHTS }, () => ({
      letter: null,
      startTime: 0,
      duration: 0,
      phase0: 0,
      tailLengthPx: TAIL_LENGTH_PX_MIN,
      // Randomizados de verdade na 1a atribuição de letra (tick/reduced-motion
      // effect) — o valor inicial aqui nunca chega a ser usado de fato, e
      // Math.random() não pode rodar durante o render (regra do React).
      pulsePhase: 0,
      pulsePhase2: 0,
      groupEl: null,
      glowEls: [],
      mainEls: [],
      coreEls: [],
    })),
  );
  // Contador de "geração" do loop de animação — ver useLayoutEffect do rAF
  // mais abaixo (proteção contra execução duplicada do requestAnimationFrame).
  const rafGenRef = useRef(0);
  // Espelha `layout` num ref: o loop de animação (useEffect abaixo) lê a
  // posição/escala atual de cada letra a cada quadro, mas não pode depender
  // de `layout` no array de dependências do efeito (isso reiniciava o
  // relógio da animação toda vez que o layout era recalculado — bug já
  // corrigido).
  const layoutRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const measure = () => {
      const target = container.querySelector('.hero__word--big');
      if (!target) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cs = window.getComputedStyle(target);
      setBox({ width: rect.width, height: rect.height });
      setFont({
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        letterSpacing: cs.letterSpacing,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener('orientationchange', measure);

    // Causa real de o efeito sumir/desalinhar em produção (mais lento que em
    // localhost): no primeiro measure() a fonte Oswald pode ainda não ter
    // terminado de carregar da rede, então `cs.fontSize`/`getComputedStyle`
    // refletem a fonte de fallback. Quando a Oswald termina de carregar o
    // texto reflui, mas o ResizeObserver só dispara de novo se as DIMENSÕES
    // do container mudarem — o que nem sempre acontece (fallback e Oswald
    // podem medir quase igual). Sem isso, `box`/`font` ficavam presos nos
    // valores do fallback para sempre, e a medição de posição por caractere
    // (próximo efeito) saía ligeiramente errada — na prática, o suficiente
    // pra faísca parecer sumida/fora do lugar. `document.fonts.ready` força
    // uma remedição assim que a fonte real está garantidamente pronta.
    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('orientationchange', measure);
    };
  }, [containerRef]);

  // Depois que o <text> de medição (mesma font-family/size/weight/tracking
  // do texto real) é (re)renderizado, usa getStartPositionOfChar(i) — a
  // posição real do pen/baseline de cada caractere, o mesmo referencial dos
  // paths em GLYPHS — para posicionar cada letra. A escala é uniforme:
  // fontSizePx / GLYPH_UNITS_PER_EM, igual em X e Y (sem deformar).
  useEffect(() => {
    const textEl = measureTextRef.current;
    if (!textEl || !box || !font) return;

    const fontPx = parseFloat(font.fontSize);
    if (!fontPx) return;
    const scale = fontPx / GLYPH_UNITS_PER_EM;

    let raf = requestAnimationFrame(() => {
      const next = {};
      for (let i = 0; i < LETTERS.length; i += 1) {
        let pos;
        try {
          pos = textEl.getStartPositionOfChar(i);
        } catch {
          continue;
        }
        if (!pos) continue;
        const letter = LETTERS[i];
        next[letter] = { tx: pos.x, ty: pos.y, scale };
      }
      // Antes exigia as 5 letras com sucesso pra publicar QUALQUER posição —
      // uma falha pontual de getStartPositionOfChar() numa única letra (ex.
      // char ainda não plenamente medido no frame exato do reflow de fonte)
      // deixava o efeito inteiro sem nenhum layout até o próximo reflow.
      // Como as luzes agora podem ocupar QUALQUER uma das 5 letras (não mais
      // fixas em N/B/E), basta ter letras suficientes pras NUM_LIGHTS luzes
      // terem onde nascer sem repetir — publica assim que tiver pelo menos
      // NUM_LIGHTS letras medidas, sem esperar as 5.
      if (Object.keys(next).length >= Math.min(NUM_LIGHTS, LETTERS.length)) {
        layoutRef.current = next;
        setLayout(next);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [box, font]);

  // Posiciona o <g> da luz `i` sobre a letra atual dela (mesmo transform
  // translate+scale de sempre) — só chamado quando a luz TROCA de letra, não
  // a cada quadro (a cada quadro só o `d` muda, dentro da mesma letra).
  function setLightTransform(i, letter) {
    const light = lightsRef.current[i];
    const t = layoutRef.current && layoutRef.current[letter];
    if (!light.groupEl || !t) return;
    light.groupEl.setAttribute('transform', `translate(${t.tx},${t.ty}) scale(${t.scale})`);
  }

  function applyLightFrame(i, letter, progress, now = 0) {
    const light = lightsRef.current[i];
    const path = pathRefs.current[letter];
    const total = pathLengths.current[letter];
    if (!path || !light) return;

    // Checagens de sanidade em tempo real — se algum desses valores vier
    // inválido (NaN, negativo, zero) no navegador real, o traço não
    // apareceria e não haveria nenhum aviso; agora fica registrado no
    // console pra facilitar diagnosticar exatamente isso.
    if (!Number.isFinite(total) || total <= 0) {
      console.error('[HeroLedOutline] total de path inválido para', letter, total);
      return;
    }
    if (!Number.isFinite(progress)) {
      console.error('[HeroLedOutline] progress inválido para', letter, progress);
      return;
    }

    const distance = wrapLength(progress * total, total);
    const t = layoutRef.current && layoutRef.current[letter];
    const scale = t && Number.isFinite(t.scale) && t.scale > 0 ? t.scale : null;
    if (!scale) {
      console.error('[HeroLedOutline] scale inválida para', letter, t);
      return;
    }

    const tailLocalLen = light.tailLengthPx / scale;
    const chunkDs = buildSegmentChunks(path, total, distance, tailLocalLen, TAIL_CHUNKS);
    if (chunkDs.some((d) => d.includes('NaN'))) {
      console.error('[HeroLedOutline] d gerado com NaN para', letter, { distance, tailLocalLen, total });
      return;
    }

    // "Flicker" elétrico — soma de 2 ondas (uma lenta, uma rápida), cada
    // uma com fase própria por luz — dá uma irregularidade tipo
    // "100%→70%→95%→80%→100%" sem nunca sumir e sem virar estroboscópico
    // (ver comentário grande perto das constantes FLICKER_*).
    const wave =
      0.6 * Math.sin(now / FLICKER_PERIOD_SLOW_MS + light.pulsePhase) +
      0.4 * Math.sin(now / FLICKER_PERIOD_FAST_MS + light.pulsePhase2);
    const pulse = FLICKER_MIN + ((FLICKER_MAX - FLICKER_MIN) * (1 + wave)) / 2;

    // Cada chunk recebe o MESMO `d` nas 3 camadas (halo/linha/núcleo) —
    // continuam perfeitamente sobrepostas na mesma trajetória, sem duplicar
    // nada — só a OPACITY cresce do fim da cauda (chunk 0) pra ponta
    // (último chunk), dando a sensação de descarga em vez de tubo uniforme.
    for (let c = 0; c < TAIL_CHUNKS; c += 1) {
      const d = chunkDs[c];
      const glowEl = light.glowEls[c];
      if (glowEl) {
        glowEl.setAttribute('d', d);
        glowEl.setAttribute('opacity', GLOW_CHUNK_OPACITY[c] * pulse);
      }
      const mainEl = light.mainEls[c];
      if (mainEl) {
        mainEl.setAttribute('d', d);
        mainEl.setAttribute('opacity', MAIN_CHUNK_OPACITY[c] * pulse);
      }
      const coreIdx = c - (TAIL_CHUNKS - CORE_CHUNK_COUNT);
      if (coreIdx >= 0) {
        const coreEl = light.coreEls[coreIdx];
        if (coreEl) {
          coreEl.setAttribute('d', d);
          coreEl.setAttribute('opacity', CORE_CHUNK_OPACITY[coreIdx] * pulse);
        }
      }
    }
  }

  // Caso prefers-reduced-motion esteja ativo: escolhe (uma vez) até
  // NUM_LIGHTS letras DIFERENTES entre si e desenha um traço ESTÁTICO em
  // cada uma — sem stroke-dasharray/dashoffset (ver bloco de comentário
  // grande acima sobre por que essa combinação não pinta nada quando
  // escrita uma única vez), usando em vez disso um `d` literal curto
  // (buildSegmentD), terminando no ponto mais alto do contorno de cada
  // letra (sempre livre da navalha). useLayoutEffect (não useEffect): sem o
  // antigo stroke-dasharray="0 1" de segurança, o `d` inicial (glyph.d, a
  // letra inteira) ficaria visível por um frame até rodar.
  useLayoutEffect(() => {
    if (!prefersReduced || !layout) return;
    const available = Object.keys(layout).filter((letter) => pathLengths.current[letter]);
    if (available.length === 0) return;

    const chosen = [];
    for (let i = 0; i < NUM_LIGHTS; i += 1) {
      const free = available.filter((letter) => !chosen.includes(letter));
      chosen.push((free.length > 0 ? free : available)[i % (free.length > 0 ? free.length : available.length)]);
    }

    chosen.forEach((letter, i) => {
      lightsRef.current[i].letter = letter;
      lightsRef.current[i].tailLengthPx = (TAIL_LENGTH_PX_MIN + TAIL_LENGTH_PX_MAX) / 2;
      setLightTransform(i, letter);
      const path = pathRefs.current[letter];
      const total = pathLengths.current[letter];
      const progress = path && total ? findTopmostProgress(path, total) : 0;
      applyLightFrame(i, letter, progress);
    });
  }, [prefersReduced, layout]);

  // Loop único de animação — calcula o progresso de cada luz a partir do
  // tempo real decorrido (não de uma propriedade CSS `animation`) e escreve
  // a posição diretamente nos elementos via refs, sem passar pelo React.
  // Cada luz faz uma volta completa (progress 0→1) na letra sorteada; ao
  // terminar a volta, sorteia OUTRA letra + nova duração + nova fase inicial
  // (ver pickNextLetter) — isso é o que faz a energia "viajar" por NOBRE em
  // vez de ficar presa pra sempre na mesma letra.
  //
  // IMPORTANTE: este efeito depende SÓ de `prefersReduced` — não de
  // `layout` (bug já corrigido: incluir `layout` aqui reiniciava o relógio
  // da animação toda vez que o layout era recalculado, ex. quando a fonte
  // do Google Fonts termina de carregar). O loop lê `layoutRef.current`,
  // `pathLengths.current` via refs a cada quadro (sempre atualizados),
  // então não precisa reiniciar por isso.
  //
  // useLayoutEffect (não useEffect) + primeiro frame calculado na hora
  // (não só agendado via requestAnimationFrame): sem o antigo
  // stroke-dasharray="0 1" de segurança, o `d` inicial (glyph.d) ficaria
  // visível por um frame até o primeiro tick() rodar.
  //
  // `rafGenRef`: proteção explícita contra EXECUÇÃO DUPLICADA do
  // requestAnimationFrame. Normalmente `cancelAnimationFrame(rafId)` no
  // cleanup já é suficiente, mas em desenvolvimento o React StrictMode roda
  // efeitos duas vezes de propósito (monta → desmonta → monta de novo) para
  // testar exatamente esse tipo de vazamento; com um "número de geração"
  // incrementado a cada execução do efeito, qualquer `tick` de uma geração
  // antiga que porventura ainda estivesse agendado simplesmente para de se
  // re-agendar, garantindo que só EXISTE um loop rodando por vez.
  useLayoutEffect(() => {
    if (prefersReduced) return undefined;

    rafGenRef.current += 1;
    const myGen = rafGenRef.current;
    let rafId;

    const tick = (now) => {
      if (rafGenRef.current !== myGen) return; // outra geração assumiu — esta para
      const available = layoutRef.current
        ? Object.keys(layoutRef.current).filter((letter) => pathLengths.current[letter])
        : [];

      if (available.length > 0) {
        const lights = lightsRef.current;
        for (let i = 0; i < lights.length; i += 1) {
          const light = lights[i];
          const elapsedInPass = light.letter === null ? Infinity : (now - light.startTime) / 1000;

          // Volta atual terminou (ou a luz ainda não tem letra) — sorteia a
          // PRÓXIMA: letra diferente das outras luzes quando possível, nova
          // duração (levemente aleatória dentro da faixa) e nova fase
          // inicial (também aleatória) — é isso que dá a sensação de
          // "nascer em posições diferentes do contorno" e evita o padrão
          // "sempre a mesma volta, sempre no mesmo lugar".
          if (elapsedInPass >= light.duration) {
            light.letter = pickNextLetter(lights, i, available);
            light.startTime = now;
            light.duration = LIGHT_DURATION_MIN + Math.random() * (LIGHT_DURATION_MAX - LIGHT_DURATION_MIN);
            light.phase0 = Math.random();
            light.tailLengthPx = TAIL_LENGTH_PX_MIN + Math.random() * (TAIL_LENGTH_PX_MAX - TAIL_LENGTH_PX_MIN);
            light.pulsePhase = Math.random() * Math.PI * 2;
            light.pulsePhase2 = Math.random() * Math.PI * 2;
            setLightTransform(i, light.letter);
          }

          const elapsed = (now - light.startTime) / 1000;
          const progress = light.phase0 + elapsed / light.duration;
          applyLightFrame(i, light.letter, progress, now);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    tick(performance.now());
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReduced]);

  if (!box || !font) return null;

  const measureTextStyle = {
    fontFamily: font.fontFamily,
    fontWeight: font.fontWeight,
    fontSize: font.fontSize,
    letterSpacing: font.letterSpacing,
  };

  const mainStrokePx = isMobile ? MAIN_STROKE_PX_MOBILE : MAIN_STROKE_PX;
  const coreStrokePx = isMobile ? CORE_STROKE_PX_MOBILE : CORE_STROKE_PX;
  const glowStrokePx = isMobile ? GLOW_STROKE_PX_MOBILE : GLOW_STROKE_PX;
  const glowBlur = isMobile ? GLOW_BLUR_MOBILE : GLOW_BLUR;

  if (DEBUG_FORCE_SOLID_LINE) {
    return (
      <svg
        className="hero__led"
        aria-hidden="true"
        focusable="false"
        overflow="visible"
        style={{ zIndex: 999999 }}
      >
        <line
          x1={0}
          y1={box.height / 2}
          x2={box.width}
          y2={box.height / 2}
          stroke="#ff4b22"
          strokeWidth={6}
          strokeOpacity={1}
          opacity={1}
          visibility="visible"
          display="block"
          strokeDasharray="none"
          strokeDashoffset={0}
          filter="none"
          style={{ animation: 'none' }}
        />
      </svg>
    );
  }

  return (
    <svg className="hero__led" aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <filter id="heroLedGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={glowBlur} />
        </filter>
      </defs>

      {/* <text> só de medição — nunca é desenhado (fill="none"), só existe
          para ler getStartPositionOfChar(). É posicionado no mesmo centro em
          que o CSS real centraliza a palavra (container com
          align-items:center), com textAnchor="middle" e
          dominantBaseline="central" replicando esse centro — assim a
          posição/baseline que a API devolve corresponde ao texto real. */}
      <text
        ref={measureTextRef}
        x={box.width / 2}
        y={getBaselineY(box.height, parseFloat(font.fontSize) || 0)}
        textAnchor="middle"
        fill="none"
        style={measureTextStyle}
      >
        NOBRE
      </text>

      {layout &&
        LETTERS.map((letter) => {
          const t = layout[letter];
          if (!t) return null;
          const glyph = GLYPHS[letter];
          const transform = `translate(${t.tx},${t.ty}) scale(${t.scale})`;

          return (
            <g key={letter} transform={transform}>
              {DEBUG_SHOW_OUTLINE && (
                <path d={glyph.d} fill="none" stroke="lime" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity="0.8" />
              )}
              {/* Path de REFERÊNCIA, nunca visível e nunca mutado — só existe
                  pra getTotalLength()/getPointAtLength(). Existe UM por letra
                  (não só pras "SPARKS" de antes) porque agora QUALQUER luz
                  pode ocupar QUALQUER letra dinamicamente. Tem que ser um
                  elemento SEPARADO dos visuais das luzes (que ficam em `<g>`
                  próprios, fora deste map — ver abaixo): se reusássemos um
                  elemento visual, o `d` dele seria reescrito a cada quadro
                  pro segmento curto, e getPointAtLength passaria a consultar
                  ESSE segmento curto (não mais a letra inteira) — qualquer
                  distância além do comprimento dele satura no último ponto
                  (bug real encontrado e corrigido nesta investigação: todo
                  mundo colapsava no mesmo ponto). */}
              <path
                ref={(el) => {
                  if (el && pathLengths.current[letter] === undefined) {
                    pathRefs.current[letter] = el;
                    pathLengths.current[letter] = el.getTotalLength();
                  }
                }}
                d={glyph.d}
                fill="none"
                stroke="none"
                aria-hidden="true"
              />
            </g>
          );
        })}

      {/* As NUM_LIGHTS luzes são <g> INDEPENDENTES das letras (não aninhadas
          num <g> por letra como antes) — cada luz pode estar em QUALQUER
          letra a qualquer momento, então o próprio `transform` deste `<g>`
          é reescrito (setLightTransform) sempre que a luz troca de letra.
          Dentro de cada luz, a cauda é fatiada em TAIL_CHUNKS pedacinhos
          (ver buildSegmentChunks/applyLightFrame) — cada chunk tem 3 camadas
          (halo/corpo/núcleo) sempre com o MESMO `d`, nunca duplicadas nem
          deslocadas; tanto a OPACITY quanto a COR do corpo principal mudam
          do fim da cauda (vermelho escuro, quase invisível) pro chunk final
          (amarelo/laranja bem claro, quase se fundindo no núcleo branco) —
          é a mudança de COR (não só de brilho) que faz parecer energia, não
          uma barra colorida deslizando. `strokeLinecap="butt"` (nunca
          "round") em tudo — pontas cortadas/afiadas, sem bolinha nas
          extremidades. Halo largo e MUITO desfocado; núcleo (quase branco)
          só nos últimos CORE_CHUNK_COUNT chunks — acende perto da ponta, não
          na cauda inteira. */}
      {layout &&
        Array.from({ length: NUM_LIGHTS }).map((_, i) => (
          <g
            key={`light-${i}`}
            ref={(el) => {
              lightsRef.current[i].groupEl = el;
            }}
          >
            {Array.from({ length: TAIL_CHUNKS }).map((_, c) => (
              <path
                key={`glow-${c}`}
                ref={(el) => {
                  lightsRef.current[i].glowEls[c] = el;
                }}
                fill="none"
                stroke={MAIN_CHUNK_COLOR[c]}
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth={glowStrokePx}
                vectorEffect="non-scaling-stroke"
                filter="url(#heroLedGlow)"
              />
            ))}
            {Array.from({ length: TAIL_CHUNKS }).map((_, c) => (
              <path
                key={`main-${c}`}
                ref={(el) => {
                  lightsRef.current[i].mainEls[c] = el;
                }}
                fill="none"
                stroke={MAIN_CHUNK_COLOR[c]}
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth={mainStrokePx}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {Array.from({ length: CORE_CHUNK_COUNT }).map((_, c) => (
              <path
                key={`core-${c}`}
                ref={(el) => {
                  lightsRef.current[i].coreEls[c] = el;
                }}
                fill="none"
                stroke="#fffaf0"
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth={coreStrokePx}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        ))}
    </svg>
  );
}
