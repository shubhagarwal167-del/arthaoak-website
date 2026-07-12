import { MAIL } from '../data/products';

export default function Contact({ openModal }) {
  return (
    <section className="section section-dark" id="contact">
      <div className="aura aura-dark-gold" data-speed="0.3" aria-hidden="true" />
      <div className="float-sq sq-gold sm" data-speed="0.75" aria-hidden="true" />

      <div className="wrap">
        <div className="catalogue-band reveal">
          <span className="stamp" aria-hidden="true">SOON</span>
          <h2 className="h2 h2-cream">The <span className="gx">2026 Catalogue</span><br />Is Coming.</h2>
          <p className="lead lead-cream">
            Our complete collection is being photographed, bound and hand-polished.
            The ArthaOak Catalogue launches soon - every piece, every finish, every possibility.
          </p>
        </div>

        <div className="contact-card reveal">
          <span className="chip chip-gold">LET’S BUILD YOUR SPACE</span>
          <h2 className="h2 h2-cream contact-title">One Message Away.</h2>
          <p className="lead lead-cream">B2G · B2B · D2C - every enquiry is answered personally.</p>

          <div className="contact-actions">
            <button type="button" className="btn btn-gold mail-btn" onClick={() => openModal('contact')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="1" />
                <path d="M2 6l10 8 10-8" />
              </svg>
              <span>{MAIL}</span>
            </button>
            <p className="contact-note">
              Mail or DM us to design your space - customisable orders on demand also accepted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
