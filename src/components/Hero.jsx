import Ticker from './Ticker';

const LINE_ONE = 'GROWN BY THE EARTH.';

export default function Hero({ openModal }) {
  const words = LINE_ONE.split(' ');
  return (
    <header className="hero" id="hero">
      <Ticker variant="gold" text="HOME FURNITURE // OFFICE FURNITURE // MODULAR FURNITURE & KITCHENS // SOFA FABRICS // INTERIORS // EST. 2026" />

      <div className="aura aura-hero" data-speed="0.3" aria-hidden="true" />
      <div className="float-sq sq-gold" data-speed="0.55" aria-hidden="true" />
      <div className="float-sq sq-coral" data-speed="0.85" aria-hidden="true" />
      <div className="float-sq sq-cream" data-speed="0.4" aria-hidden="true" />

      <div className="hero-card">
        <div className="hero-copy">
          <span className="chip chip-gold hero-chip">HANDCRAFTED · EST. 2026</span>
          <h1 className="hero-title">
            <span className="line split" aria-label={LINE_ONE}>
              {words.map((w, i) => (
                <span key={i} className="word" aria-hidden="true">
                  {w + (i < words.length - 1 ? ' ' : '')}
                </span>
              ))}
            </span>
            <span className="line gx">PERFECTED BY HAND.</span>
          </h1>
          <p className="hero-sub">
            ArthaOak shapes heirloom-grade home &amp; office furniture - where organic oak
            grain meets modern minimalism, for homes, businesses and institutions that
            demand more than furniture.
          </p>
          <div className="hero-cta">
            <a href="#home-collection" className="btn btn-ink magnetic">Explore the Collections</a>
            <button type="button" className="btn btn-ghost" onClick={() => openModal('catalogue')}>
              <i>Catalogue</i>&nbsp;- Launching Soon
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true"><span />SCROLL</div>
    </header>
  );
}
