import { useEffect, useRef, useState } from 'react';

/* "Minimalist room with wooden furniture" - Mixkit Free License
   (free for commercial use, no attribution required, no copyright issues) */
const VIDEO_SRC = 'https://assets.mixkit.co/videos/3091/3091-720.mp4';
const VIDEO_POSTER = 'https://assets.mixkit.co/videos/3091/3091-thumb-1080-0.jpg';

const RATE = 0.75; /* slowed loop reads cinematic rather than documentary */

export default function Background() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* iOS/Safari autoplay needs the muted ATTRIBUTE present, which React
       does not render from the prop - set everything imperatively */
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.playbackRate = RATE;

    const tryPlay = () => {
      if (video.dataset.userPaused || !video.paused) return;
      video.playbackRate = RATE;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    tryPlay();

    /* if autoplay was blocked (e.g. iOS Low Power Mode), start on the
       first touch/click anywhere on the page */
    const onFirstInput = () => tryPlay();
    window.addEventListener('touchstart', onFirstInput, { once: true, passive: true });
    window.addEventListener('pointerdown', onFirstInput, { once: true });

    /* keep the toggle icon truthful whatever the browser decides */
    const onPlay = () => { video.playbackRate = RATE; setPlaying(true); };
    const onPause = () => setPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    /* save battery/GPU when the tab is hidden */
    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (!video.dataset.userPaused) {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('touchstart', onFirstInput);
      window.removeEventListener('pointerdown', onFirstInput);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      delete video.dataset.userPaused;
      video.playbackRate = RATE;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      video.dataset.userPaused = '1';
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        id="bgvideo"
        className="bg-video"
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        disableRemotePlayback
        aria-hidden="true"
      />
      <div className="video-scrim" aria-hidden="true" />
      <button
        type="button"
        className="video-toggle"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        title={playing ? 'Pause background' : 'Play background'}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="6" width="3.5" height="12" rx="1"/><rect x="13.5" y="6" width="3.5" height="12" rx="1"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
        )}
      </button>
    </>
  );
}
