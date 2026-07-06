/* ============================================================
   ARTHAOAK — Motion Engine
   Three.js WebGL fluid (simplex fbm) · ember particles ·
   GSAP + ScrollTrigger reveals · popup modals · अ→O scroll rail
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* Shared, eased mouse position (0..1, y up) for WebGL + particles */
  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, px: -9999, py: -9999 };
  window.addEventListener('pointermove', function (e) {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1.0 - e.clientY / window.innerHeight;
    mouse.px = e.clientX;
    mouse.py = e.clientY;
  }, { passive: true });

  /* ==================== 1. WEBGL FLUID BACKGROUND ==================== */
  function initWebGL() {
    if (reduceMotion || typeof THREE === 'undefined') return;
    var canvas = document.getElementById('webgl');
    if (!canvas) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: 'high-performance' });
    } catch (e) { return; }

    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var uniforms = {
      uTime:  { value: 0 },
      uRes:   { value: new THREE.Vector2(window.innerWidth * DPR, window.innerHeight * DPR) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    var frag = [
      'precision highp float;',
      'uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;',
      /* Ashima 2D simplex noise */
      'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}',
      'vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}',
      'float snoise(vec2 v){',
      '  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
      '  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);',
      '  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);',
      '  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;',
      '  i=mod289(i);',
      '  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
      '  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);',
      '  m=m*m; m=m*m;',
      '  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;',
      '  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);',
      '  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;',
      '  return 130.0*dot(m,g);',
      '}',
      'float fbm(vec2 p){',
      '  float v=0.0; float a=0.5;',
      '  for(int i=0;i<5;i++){ v+=a*snoise(p); p=p*2.03+vec2(13.7,7.1); a*=0.5; }',
      '  return v;',
      '}',
      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/uRes.xy;',
      '  vec2 p=uv; p.x*=uRes.x/uRes.y;',
      '  float t=uTime*0.045;',
      /* domain-warped fbm — organic, never-repeating fluid */
      '  vec2 q=vec2(fbm(p*1.35+t), fbm(p*1.35-t*0.7+5.2));',
      '  vec2 r=vec2(fbm(p*1.15+q*1.6+t*0.55), fbm(p*1.15+q*1.6-t*0.4+8.1));',
      '  float f=fbm(p*1.55+r*1.75);',
      /* deep walnut dark base so light effects pop */
      '  vec3 base=vec3(0.052,0.038,0.022);',
      '  vec3 gold=vec3(0.82,0.60,0.21);',
      '  vec3 coral=vec3(1.0,0.43,0.29);',
      '  vec3 amber=vec3(1.0,0.74,0.38);',
      '  vec3 col=base;',
      '  col=mix(col,gold*0.85,smoothstep(0.3,0.95,f)*0.8);',
      '  col=mix(col,coral,smoothstep(0.5,1.0,q.y*f)*0.42);',
      '  col+=gold*pow(max(f,0.0),3.0)*0.4;',
      /* cursor-reactive glow */
      '  vec2 m=uMouse; m.x*=uRes.x/uRes.y;',
      '  float md=length(p-m);',
      '  col+=amber*exp(-md*3.2)*0.32;',
      /* vignette */
      '  float vig=smoothstep(1.3,0.32,length(uv-0.5));',
      '  col*=vig;',
      '  gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: 'void main(){ gl_Position = vec4(position, 1.0); }',
      fragmentShader: frag
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    var clock = new THREE.Clock();
    var running = true;

    function loop() {
      requestAnimationFrame(loop);
      if (!running) return;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      renderer.render(scene, camera);
    }
    loop();

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) clock.getDelta(); /* swallow the paused interval */
    });

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth * DPR, window.innerHeight * DPR);
    });
  }

  /* ==================== 2. EMBER / NODE PARTICLES ==================== */
  function initParticles() {
    if (reduceMotion) return;
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, pts = [];
    var LINK_DIST = 130;
    var REPEL = 110;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var target = Math.min(90, Math.round((W * H) / 16000));
      while (pts.length < target) pts.push(spawn());
      pts.length = target;
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.12 - Math.random() * 0.3,          /* embers drift up */
        r: 0.8 + Math.random() * 1.9,
        ph: Math.random() * Math.PI * 2,          /* wobble phase */
        gold: Math.random() > 0.35
      };
    }

    var running = true;
    document.addEventListener('visibilitychange', function () { running = !document.hidden; });
    window.addEventListener('resize', resize);
    resize();

    var t = 0;
    function frame() {
      requestAnimationFrame(frame);
      if (!running) return;
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      var i, j, p, q, dx, dy, d;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx + Math.sin(t * 2 + p.ph) * 0.18;
        p.y += p.vy;

        /* cursor repel */
        dx = p.x - mouse.px; dy = p.y - mouse.py;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL && d > 0.01) {
          var f = (REPEL - d) / REPEL * 1.4;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        /* seamless wrap */
        if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }
        if (p.x < -12) p.x = W + 12;
        if (p.x > W + 12) p.x = -12;
      }

      /* neural links */
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d = dx * dx + dy * dy;
          if (d < LINK_DIST * LINK_DIST) {
            var a = (1 - Math.sqrt(d) / LINK_DIST) * 0.16;
            ctx.strokeStyle = 'rgba(201,150,46,' + a.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }

      /* embers */
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        var tw = 0.45 + 0.3 * Math.sin(t * 3 + p.ph);
        ctx.fillStyle = p.gold
          ? 'rgba(212,160,52,' + tw.toFixed(3) + ')'
          : 'rgba(255,120,80,' + (tw * 0.8).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    frame();
  }

  /* ==================== 3. SPLIT TEXT ==================== */
  function splitWords(el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    var words = text.split(' ');
    for (var i = 0; i < words.length; i++) {
      var s = document.createElement('span');
      s.className = 'word';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = words[i] + (i < words.length - 1 ? ' ' : '');
      el.appendChild(s);
    }
    return el.querySelectorAll('.word');
  }

  /* ==================== 4. GSAP MOTION ==================== */
  function initMotion() {
    if (!hasGSAP) { document.documentElement.classList.add('no-gsap'); return; }

    /* --- Hero intro timeline ---
       Gradient (.gx) lines animate whole: transforms on child spans
       break background-clip:text, turning the line invisible. */
    var heroWords = [];
    document.querySelectorAll('.hero-title .split').forEach(function (line) {
      if (line.classList.contains('gx')) {
        heroWords.push(line);
      } else {
        splitWords(line).forEach(function (w) { heroWords.push(w); });
      }
    });

    if (!reduceMotion) {
      var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.nav', { yPercent: -120, duration: 0.9, ease: 'power2.out' })
        .from('.hero-chip', { scale: 0, rotation: -12, duration: 0.55, ease: 'back.out(2.2)' }, '-=0.35')
        .from(heroWords, { y: 70, opacity: 0, rotationX: -35, duration: 0.9, stagger: 0.07 }, '-=0.2')
        .from('.hero-sub', { y: 34, opacity: 0, duration: 0.8 }, '-=0.45')
        .from('.hero-cta > *', { y: 26, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)' }, '-=0.4')
        .from('.hero .ticker', { yPercent: -100, opacity: 0, duration: 0.6 }, '-=0.8')
        .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.2')
        .from('.hero .float-sq', { scale: 0, rotation: 90, duration: 0.7, stagger: 0.1, ease: 'back.out(1.8)' }, '-=1.1');
    }

    if (typeof ScrollTrigger === 'undefined') return;

    /* --- Compact nav bar on scroll (logo text stays "ArthaOak") --- */
    ScrollTrigger.create({
      start: 80,
      onEnter: function () { document.getElementById('nav').classList.add('is-scrolled'); },
      onLeaveBack: function () { document.getElementById('nav').classList.remove('is-scrolled'); }
    });

    /* --- Scroll rail: अ (top) → O (bottom), A morphs into O --- */
    var marker = document.querySelector('.rail-marker');
    var fill = document.querySelector('.rail-fill');
    var mA = document.querySelector('.mA');
    var mO = document.querySelector('.mO');
    var track = document.querySelector('.rail-track');

    ScrollTrigger.create({
      start: 0,
      end: function () { return ScrollTrigger.maxScroll(window); },
      onUpdate: function (self) {
        var p = self.progress;
        var span = track.clientHeight - marker.clientHeight;
        gsap.set(marker, { y: span * p, rotation: p * 360 });
        gsap.set(fill, { height: (p * 100) + '%' });
        gsap.set(mA, { opacity: 1 - Math.min(1, p * 1.6) });          /* A fades out */
        gsap.set(mO, { opacity: Math.max(0, (p - 0.45) / 0.55) });    /* …O fades in */
      }
    });

    /* --- Scroll reveals (fade-in typography w/ vertical easing) --- */
    if (reduceMotion) return;

    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.from(el, {
        y: 46, opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });

    /* --- Parallax depth: shapes + auras drift at data-speed --- */
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
      gsap.to(el, {
        y: function () { return -(1 - speed) * 320; },
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section, header') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    });

    /* --- Auras breathe in place (seamless yoyo) --- */
    gsap.utils.toArray('.aura').forEach(function (el, i) {
      gsap.to(el, {
        x: i % 2 ? 44 : -38,
        scale: 1.12,
        duration: 7 + i * 1.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });

    /* --- Floating squares idle wobble --- */
    gsap.utils.toArray('.float-sq').forEach(function (el, i) {
      gsap.to(el, {
        rotation: '+=' + (i % 2 ? 14 : -12),
        y: '+=' + (i % 2 ? 18 : -16),
        duration: 4.5 + i,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
  }

  /* ==================== 5. MENU OVERLAY ==================== */
  function initMenu() {
    var burger = document.getElementById('burger');
    var overlay = document.getElementById('menuOverlay');
    if (!burger || !overlay) return;
    var open = false;

    function setState(next) {
      open = next;
      burger.classList.toggle('open', open);
      document.getElementById('nav').classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';

      if (hasGSAP && !reduceMotion) {
        /* plain % / px only — GSAP cannot interpolate calc() in clip-path */
        gsap.to(overlay, {
          clipPath: open
            ? 'circle(150% at 92% 42px)'
            : 'circle(0% at 92% 42px)',
          duration: 0.7,
          ease: open ? 'power3.out' : 'power3.in'
        });
        if (open) {
          gsap.fromTo('.menu-link',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.25, ease: 'power3.out' });
        }
      } else {
        overlay.style.clipPath = open ? 'circle(150% at 92% 42px)' : 'circle(0% at 92% 42px)';
      }
    }

    burger.addEventListener('click', function () { setState(!open); });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setState(false); });
    });
  }

  /* ==================== 6. POPUP MODALS ==================== */
  function initModals() {
    var modal = document.getElementById('modal');
    if (!modal) return;

    var card = modal.querySelector('.modal-card');
    var backdrop = modal.querySelector('.modal-backdrop');
    var chipEl = modal.querySelector('.modal-chip');
    var titleEl = modal.querySelector('.modal-title');
    var hookEl = modal.querySelector('.modal-hook');
    var bodyEl = modal.querySelector('.modal-body');
    var copyBtn = modal.querySelector('.modal-copy');
    var closeBtn = modal.querySelector('.modal-close');
    var MAIL = 'shubhagarwal167@gmail.com';
    var isOpen = false;
    var lastFocus = null;

    var PRESETS = {
      catalogue: {
        chip: 'CATALOGUE',
        title: 'The 2026 Catalogue',
        hook: 'Launching soon.',
        body: 'Our complete collection is being photographed, bound and hand-polished. Mail us and we will make sure you are among the first to receive it.'
      },
      custom: {
        chip: 'MADE TO ORDER',
        title: 'Design Your Space',
        hook: 'Customisable orders on demand - also accepted.',
        body: 'Tell us your room, your measurements and your taste. Our professional craftsmen will sketch, size and build it to order. Mail or DM us to begin.'
      },
      contact: {
        chip: 'WRITE TO US',
        title: 'Let’s Talk Furniture',
        hook: 'Every enquiry answered personally.',
        body: 'B2G, B2B or D2C - send us your requirement and we will reply with designs, timelines and a quote.'
      }
    };

    function openModal(data) {
      chipEl.textContent = data.chip || 'ARTHAOAK';
      titleEl.textContent = data.title || '';
      if (data.hook) { hookEl.style.display = ''; hookEl.textContent = data.hook; }
      else { hookEl.style.display = 'none'; }
      bodyEl.textContent = data.body || '';

      lastFocus = document.activeElement;
      isOpen = true;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (hasGSAP && !reduceMotion) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(card,
          { y: 48, scale: 0.88, rotation: -2.5, opacity: 0 },
          { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' });
      }
      closeBtn.focus();
    }

    function closeModal() {
      if (!isOpen) return;
      isOpen = false;
      function done() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      if (hasGSAP && !reduceMotion) {
        gsap.to(card, { y: 32, scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' });
        gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: done });
      } else {
        done();
      }
    }

    /* preset-driven buttons */
    document.querySelectorAll('[data-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var data = PRESETS[btn.getAttribute('data-modal')];
        if (data) openModal(data);
      });
    });

    /* every product card opens an enquiry popup */
    document.querySelectorAll('.p-card').forEach(function (pc) {
      pc.setAttribute('tabindex', '0');
      pc.setAttribute('role', 'button');
      var t = pc.querySelector('h3');
      var h = pc.querySelector('.hook');
      var ps = pc.querySelectorAll('p');
      var desc = ps[ps.length - 1];
      function fire() {
        openModal({
          chip: 'THE COLLECTION',
          title: t ? t.textContent : 'ArthaOak',
          hook: h ? h.textContent : '',
          body: (desc ? desc.textContent + ' ' : '') +
            'Available in custom sizes, woods and finishes - mail or DM us to make it yours.'
        });
      }
      pc.addEventListener('click', fire);
      pc.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
      });
    });

    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    /* copy mail id with feedback */
    copyBtn.addEventListener('click', function () {
      function ok() {
        copyBtn.textContent = 'Copied!';
        setTimeout(function () { copyBtn.textContent = 'Copy Mail ID'; }, 1600);
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = MAIL;
        document.body.appendChild(ta);
        ta.select();
        try { if (document.execCommand('copy')) ok(); } catch (err) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(MAIL).then(ok, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ==================== BOOT ==================== */
  function boot() {
    initWebGL();
    initParticles();
    initMotion();
    initMenu();
    initModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
