import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LINKS = [
  { id: 'story', label: 'Story' },
  { id: 'home-collection', label: 'Home' },
  { id: 'office-collection', label: 'Office' },
  { id: 'custom', label: 'Custom' },
  { id: 'contact', label: 'Contact' },
];

const MENU_LINKS = [
  { id: 'story', label: 'The Story' },
  { id: 'home-collection', label: 'Home Collection' },
  { id: 'office-collection', label: 'Office Collection' },
  { id: 'custom', label: 'Custom Orders' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const overlayRef = useRef(null);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* compact frosted bar once scrolled */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* scroll spy - highlight the section in view */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* fullscreen menu open/close (circular glass reveal) */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    document.body.style.overflow = open ? 'hidden' : '';
    if (reduceMotion) {
      overlay.style.clipPath = open ? 'circle(150% at 92% 42px)' : 'circle(0% at 92% 42px)';
      return;
    }
    gsap.to(overlay, {
      clipPath: open ? 'circle(150% at 92% 42px)' : 'circle(0% at 92% 42px)',
      duration: 0.7,
      ease: open ? 'power3.out' : 'power3.in',
    });
    if (open) {
      gsap.fromTo(
        overlay.querySelectorAll('.menu-link'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.25, ease: 'power3.out' },
      );
    }
  }, [open, reduceMotion]);

  return (
    <>
      <nav className={'nav' + (scrolled ? ' is-scrolled' : '') + (open ? ' menu-open' : '')} id="nav">
        <a className="logo" href="#top" aria-label="ArthaOak home">
          <span className="logo-full">Artha<em>Oak</em></span>
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.id} href={'#' + l.id} className={activeId === l.id ? 'active' : ''}>
              {l.label}
            </a>
          ))}
        </div>
        <span className="nav-est">EST. 2026</span>
        <button
          type="button"
          className={'burger' + (open ? ' open' : '')}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div ref={overlayRef} className={'menu-overlay' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="menu-inner">
          {MENU_LINKS.map((l) => (
            <a key={l.id} href={'#' + l.id} className="menu-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <p className="menu-foot">ARTHAOAK · EST. 2026 · B2G / B2B / D2C</p>
        </div>
      </div>
    </>
  );
}
