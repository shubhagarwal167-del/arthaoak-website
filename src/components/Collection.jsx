import { useRef } from 'react';
import { gsap } from 'gsap';

const canTilt = () =>
  !window.matchMedia('(hover: none)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Product card with 3D cursor tilt + lift - keyboard and touch friendly. */
function Card({ card, onSelect }) {
  const ref = useRef(null);

  const move = (e) => {
    if (!canTilt()) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotationY: px * 7,
      rotationX: -py * 7,
      y: -8,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const leave = () => {
    if (!canTilt()) return;
    gsap.to(ref.current, { rotationX: 0, rotationY: 0, y: 0, duration: 0.6, ease: 'power3.out' });
  };

  const fire = () => onSelect(card);
  const key = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fire();
    }
  };

  return (
    <article
      ref={ref}
      className="p-card reveal"
      tabIndex={0}
      role="button"
      onClick={fire}
      onKeyDown={key}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="p-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" dangerouslySetInnerHTML={{ __html: card.icon }} />
      </div>
      <h3>{card.title}</h3>
      <p className="hook">{card.hook}</p>
      <p>{card.desc}</p>
    </article>
  );
}

export default function Collection({ id, alt, chip, chipTone, titleA, titleB, lead, cards, onSelect, decor }) {
  return (
    <section className={'section section-cream' + (alt ? ' alt' : '')} id={id}>
      {decor}
      <div className="wrap">
        <div className="section-head reveal">
          <span className={'chip ' + chipTone}>{chip}</span>
          <h2 className="h2">{titleA}<br /><span className="layered">{titleB}</span></h2>
          <p className="lead">{lead}</p>
        </div>
        <div className="card-grid">
          {cards.map((c) => (
            <Card key={c.id} card={c} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
