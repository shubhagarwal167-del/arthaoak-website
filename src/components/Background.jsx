import { useEffect, useRef } from 'react';

/* "Minimalist room with wooden furniture" - Mixkit Free License
   (free for commercial use, no attribution required, no copyright issues) */
const VIDEO_SRC = 'https://assets.mixkit.co/videos/3091/3091-720.mp4';
const VIDEO_POSTER = 'https://assets.mixkit.co/videos/3091/3091-thumb-1080-0.jpg';

const RATE = 0.75; /* slowed loop reads cinematic rather than documentary */

export default function Background() {
  const videoRef = useRef(null);

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
      if (!video.paused) return;
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

    /* the film is always on: re-apply the cinematic rate on every play */
    const onPlay = () => { video.playbackRate = RATE; };
    video.addEventListener('play', onPlay);

    /* save battery/GPU when the tab is hidden, resume when visible */
    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('touchstart', onFirstInput);
      window.removeEventListener('pointerdown', onFirstInput);
      video.removeEventListener('play', onPlay);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

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
    </>
  );
}
