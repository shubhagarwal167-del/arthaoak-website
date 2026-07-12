import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* All page-level motion: hero intro, scroll reveals, parallax,
   breathing auras, floating squares, magnetic buttons. */
export function useMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        /* --- hero intro --- */
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.nav', { yPercent: -120, duration: 0.9, ease: 'power2.out' })
          .from('.hero-chip', { scale: 0, rotation: -12, duration: 0.55, ease: 'back.out(2.2)' }, '-=0.35')
          .from('.hero-title .word', { y: 70, opacity: 0, rotationX: -35, duration: 0.9, stagger: 0.07 }, '-=0.2')
          .from('.hero-title .gx', { y: 70, opacity: 0, duration: 0.9 }, '-=0.6')
          .from('.hero-sub', { y: 34, opacity: 0, duration: 0.8 }, '-=0.45')
          .from('.hero-cta > *', { y: 26, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)' }, '-=0.4')
          .from('.hero .ticker', { yPercent: -100, opacity: 0, duration: 0.6 }, '-=0.8')
          .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.2')
          .from('.hero .float-sq', { scale: 0, rotation: 90, duration: 0.7, stagger: 0.1, ease: 'back.out(1.8)' }, '-=1.1');

        /* --- scroll reveals --- */
        gsap.utils.toArray('.reveal').forEach((el) => {
          gsap.from(el, {
            y: 46,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          });
        });

        /* --- parallax depth --- */
        gsap.utils.toArray('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
          gsap.to(el, {
            y: () => -(1 - speed) * 320,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section, header') || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });

        /* --- auras breathe --- */
        gsap.utils.toArray('.aura').forEach((el, i) => {
          gsap.to(el, {
            x: i % 2 ? 44 : -38,
            scale: 1.12,
            duration: 7 + i * 1.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        });

        /* --- floating squares wobble --- */
        gsap.utils.toArray('.float-sq').forEach((el, i) => {
          gsap.to(el, {
            rotation: '+=' + (i % 2 ? 14 : -12),
            y: '+=' + (i % 2 ? 18 : -16),
            duration: 4.5 + i,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        });

        /* --- magnetic primary buttons --- */
        if (!window.matchMedia('(hover: none)').matches) {
          gsap.utils.toArray('.magnetic').forEach((el) => {
            const move = (e) => {
              const r = el.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              gsap.to(el, { x: px * 10, y: py * 8, duration: 0.3, ease: 'power2.out' });
            };
            const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
          });
        }
      } else {
        /* reduced motion: content simply visible */
        gsap.set('.reveal', { clearProps: 'all' });
      }
    });

    return () => ctx.revert();
  }, []);
}
