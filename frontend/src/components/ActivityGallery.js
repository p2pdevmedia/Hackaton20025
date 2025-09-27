import { useCallback, useEffect, useMemo, useState } from 'react';

function ActivityGallery({ images = [], alt }) {
  const gallery = useMemo(
    () => images.filter(src => typeof src === 'string' && src.trim().length > 0),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (gallery.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(prev => {
      if (Number.isNaN(prev) || prev < 0 || prev >= gallery.length) {
        return 0;
      }
      return prev;
    });
  }, [gallery]);

  const showControls = gallery.length > 1;

  const goToIndex = useCallback(
    index => {
      setActiveIndex(current => {
        if (gallery.length === 0) {
          return 0;
        }
        const next = (index + gallery.length) % gallery.length;
        return next;
      });
    },
    [gallery]
  );

  const goToPrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goToNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const handleKeyDown = useCallback(
    event => {
      if (!showControls) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    },
    [goToNext, goToPrev, showControls]
  );

  if (gallery.length === 0) {
    return null;
  }

  return (
    <div
      className="relative h-56 overflow-hidden"
      role={showControls ? 'group' : undefined}
      aria-roledescription={showControls ? 'carousel' : undefined}
      aria-label={showControls ? alt : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={showControls ? 0 : -1}
    >
      {gallery.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={index === activeIndex ? alt : ''}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          aria-hidden={index !== activeIndex}
        />
      ))}

      {showControls && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
            <button
              type="button"
              onClick={goToPrev}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow hover:bg-white"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow hover:bg-white"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {gallery.map((src, index) => (
              <button
                key={`indicator-${src}-${index}`}
                type="button"
                onClick={() => goToIndex(index)}
                className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityGallery;
