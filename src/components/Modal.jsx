import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MAIL } from '../data/products';

export default function Modal({ data, onClose, onToast }) {
  const cardRef = useRef(null);
  const backdropRef = useRef(null);
  const closeRef = useRef(null);
  const open = Boolean(data);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    if (!reduceMotion) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        cardRef.current,
        { y: 48, scale: 0.88, rotation: -2.5, opacity: 0 },
        { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' },
      );
    }
    closeRef.current && closeRef.current.focus();

    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, data, onClose, reduceMotion]);

  const copy = () => {
    const ok = () => onToast('Mail ID copied - ' + MAIL);
    /* even when the browser blocks copying, the user still gets the id */
    const fail = () => onToast('Mail ID: ' + MAIL);
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = MAIL;
      document.body.appendChild(ta);
      ta.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (err) { /* ignore */ }
      document.body.removeChild(ta);
      copied ? ok() : fail();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MAIL).then(ok, fallback);
    } else {
      fallback();
    }
  };

  return (
    <div className={'modal' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-hidden={!open}>
      <div className="modal-backdrop" ref={backdropRef} onClick={onClose} />
      <div className="modal-card" ref={cardRef}>
        <button type="button" className="modal-close" ref={closeRef} onClick={onClose} aria-label="Close popup">
          &times;
        </button>
        <span className="chip chip-gold modal-chip">{data ? data.chip : 'ARTHAOAK'}</span>
        <h3 className="modal-title">{data ? data.title : ''}</h3>
        {data && data.hook ? <p className="modal-hook">{data.hook}</p> : null}
        <p className="modal-body">{data ? data.body : ''}</p>
        <div className="modal-mail">
          <span className="modal-mail-id">{MAIL}</span>
          <button type="button" className="btn btn-ink modal-copy" onClick={copy}>
            Copy Mail ID
          </button>
        </div>
      </div>
    </div>
  );
}
