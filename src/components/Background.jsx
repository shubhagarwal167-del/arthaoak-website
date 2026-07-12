import { useEffect, useRef, useState } from 'react';

/* "Minimalist room with wooden furniture" - Mixkit Free License
   (free for commercial use, no attribution required, no copyright issues) */
const VIDEO_SRC = 'https://assets.mixkit.co/videos/3091/3091-720.mp4';
const VIDEO_POSTER = 'https://assets.mixkit.co/videos/3091/3091-thumb-1080-0.jpg';

export default function Background() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    /* slow the loop slightly - reads as cinematic rather than documentary */
    video.playbackRate = 0.75;

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (!video.dataset.userPaused) {
        video.playbackRate = 0.75;
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      delete video.dataset.userPaused;
      video.playbackRate = 0.75;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      setPlaying(true);
    } else {
      video.dataset.userPaused = '1';
      video.pause();
      setPlaying(false);
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
