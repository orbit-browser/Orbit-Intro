/** Seek a muted recording of the actual product without autoplay or scroll interception. */
export function mountScrollVideo(container, { src, poster, label }) {
  const video = document.createElement('video');
  video.className = 'scroll-video';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.disablePictureInPicture = true;
  video.setAttribute('aria-label', label);
  video.setAttribute('tabindex', '-1');
  const image = document.createElement('img');
  image.className = 'scroll-video__poster';
  image.src = poster;
  image.alt = label;
  image.width = 1600;
  image.height = 760;
  image.decoding = 'async';
  container.append(image, video);
  let target = 0, started = false, failed = false, disposed = false, scheduled = 0;
  const clamp = (value) => Math.min(1, Math.max(0, value));
  function reveal() {
    if (!failed && video.readyState >= 2) container.classList.add('has-video-frame');
  }
  function seek() {
    scheduled = 0;
    if (disposed || failed || !started || !Number.isFinite(video.duration) || video.seeking) return;
    const time = target * Math.max(0, video.duration - 1 / 30);
    if (Math.abs(video.currentTime - time) > 1 / 90) video.currentTime = time;
    else reveal();
  }
  function request() {
    if (!scheduled && !disposed) scheduled = requestAnimationFrame(seek);
  }
  function ready() { reveal(); request(); }
  function error() {
    failed = true;
    container.classList.remove('has-video-frame');
    container.dataset.mediaStatus = 'poster';
  }
  function load() {
    if (started || disposed) return;
    started = true;
    video.src = src;
    video.load();
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { load(); observer.disconnect(); }
  }, { rootMargin: '1000px 0px' });
  observer.observe(container);
  video.addEventListener('loadedmetadata', request);
  video.addEventListener('loadeddata', ready);
  video.addEventListener('seeked', ready);
  video.addEventListener('error', error);
  return {
    seek(progress) {
      target = clamp(progress);
      container.dataset.rotation = target.toFixed(4);
      request();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(scheduled);
      observer.disconnect();
      video.removeEventListener('loadedmetadata', request);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('seeked', ready);
      video.removeEventListener('error', error);
      video.pause();
      video.removeAttribute('src');
      video.load();
      container.replaceChildren();
    },
  };
}
