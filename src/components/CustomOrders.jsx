export default function CustomOrders({ openModal }) {
  return (
    <section className="section section-cream alt" id="custom">
      <div className="aura aura-gold" data-speed="0.3" aria-hidden="true" />
      <div className="float-sq sq-coral sm" data-speed="0.7" aria-hidden="true" />

      <div className="wrap">
        <div className="section-head reveal">
          <span className="chip chip-coral">03 - MADE TO ORDER</span>
          <h2 className="h2">Your Space.<br /><span className="layered">Your Rules.</span></h2>
          <p className="lead">
            Customisable orders on demand - also accepted. Every ArthaOak piece can be
            tailored to your room: dimensions, wood, finish, upholstery and hardware -{' '}
            <span className="gx strong">crafted by our professional craftsmen</span>, one
            commission at a time.
          </p>
        </div>
        <div className="custom-cta reveal">
          <button type="button" className="btn btn-ink magnetic" onClick={() => openModal('custom')}>
            Design Your Space
          </button>
          <p className="custom-note">Mail or DM us to design your space.</p>
        </div>
      </div>
    </section>
  );
}
