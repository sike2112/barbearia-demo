/**
 * Wrapper fino sobre <img> com fallback gracioso: se a foto falhar ao
 * carregar (link quebrado, CDN fora do ar), esconde a imagem em vez de
 * mostrar o ícone padrão de "imagem quebrada" do navegador — o fundo
 * escuro do container por trás resolve visualmente.
 */
export default function Image({ src, alt, loading = 'lazy', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={(e) => {
        e.currentTarget.style.opacity = '0';
      }}
      {...props}
    />
  );
}
