import { useEffect, useRef } from 'react';

/* Ember / node particle field - drifts up, links neighbours, repels cursor. */
export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 130;
    const REPEL = 110;
    let W, H;
    let pts = [];
    let raf = 0;
    let running = true;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };

    const spawn = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.12 - Math.random() * 0.3,
      r: 0.8 + Math.random() * 1.9,
      ph: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.35,
    });

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const target = Math.min(90, Math.round((W * H) / 16000));
      while (pts.length < target) pts.push(spawn());
      pts.length = target;
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onVisibility = () => { running = !document.hidden; };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx + Math.sin(t * 2 + p.ph) * 0.18;
        p.y += p.vy;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL && d > 0.01) {
          const f = ((REPEL - d) / REPEL) * 1.4;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }
        if (p.x < -12) p.x = W + 12;
        if (p.x > W + 12) p.x = -12;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const a = (1 - Math.sqrt(d2) / LINK_DIST) * 0.12;
            ctx.strokeStyle = 'rgba(140,100,30,' + a.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const tw = 0.3 + 0.22 * Math.sin(t * 3 + p.ph);
        ctx.fillStyle = p.gold
          ? 'rgba(160,112,28,' + tw.toFixed(3) + ')'
          : 'rgba(210,96,60,' + (tw * 0.85).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} id="particles" aria-hidden="true" />;
}
