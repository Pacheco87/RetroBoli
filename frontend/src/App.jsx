const featuredPreview = [
  {
    title: 'Juegos retro',
    text: 'Catalogo vivo con productos activos y compra externa en Wallapop.',
  },
  {
    title: 'Estado claro',
    text: 'Cada producto mostrara precio, condicion y fotos antes de salir a comprar.',
  },
  {
    title: 'Admin protegido',
    text: 'Gestion sencilla para crear, editar y cerrar productos.',
  },
];

export function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="RetroBoli inicio">
          <img src="/logo-retroboli.jpg" alt="RetroBoli" />
          <span>RetroBoli</span>
        </a>
        <nav className="main-nav" aria-label="Navegacion principal">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
        </nav>
      </header>

      <section id="inicio" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Retro de segunda mano</p>
          <h1>Productos con historia, compra sencilla en Wallapop.</h1>
          <p>
            RetroBoli sera un escaparate claro para encontrar juegos, consolas y piezas retro
            disponibles, con fotos, precio, estado y enlace directo al anuncio de Wallapop.
          </p>
        </div>
      </section>

      <section id="productos" className="preview-section" aria-labelledby="productos-title">
        <div className="section-heading">
          <p className="eyebrow">Primera fase</p>
          <h2 id="productos-title">Base preparada para el catalogo</h2>
        </div>
        <div className="preview-grid">
          {featuredPreview.map((item) => (
            <article className="preview-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
