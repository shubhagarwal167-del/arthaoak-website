import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Custom scrollbar: अ on top, O at the bottom, the A marker travels
   down and morphs into O as you reach the end. */
export default function ScrollRail() {
  const trackRef = useRef(null);
  const markerRef = useRef(null);
  const fillRef = useRef(null);
  const aRef = useRef(null);
  const oRef = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        const p = self.progress;
        const track = trackRef.current;
        const marker = markerRef.current;
        if (!track || !marker) return;
        const span = track.clientHeight - marker.clientHeight;
        gsap.set(marker, { y: span * p, rotation: p * 360 });
        gsap.set(fillRef.current, { height: p * 100 + '%' });
        gsap.set(aRef.current, { opacity: 1 - Math.min(1, p * 1.6) });
        gsap.set(oRef.current, { opacity: Math.max(0, (p - 0.45) / 0.55) });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <aside className="rail" aria-hidden="true">
      <span className="rail-cap rail-top">अ</span>
      <div className="rail-track" ref={trackRef}>
        <div className="rail-fill" ref={fillRef} />
        <div className="rail-marker" ref={markerRef}>
          <span className="mA" ref={aRef}>A</span>
          <span className="mO" ref={oRef}>O</span>
        </div>
      </div>
      <span className="rail-cap rail-bottom">O</span>
    </aside>
  );
}
