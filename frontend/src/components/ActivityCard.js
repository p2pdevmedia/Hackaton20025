import { useMemo, useState } from 'react';

function ActivityCard({ activity }) {
  const { title, summary, highlights = [], guide, images = [] } = activity;
  const safeImages = useMemo(() => (images.length > 0 ? images : ['']), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showNavigation = safeImages.length > 1;
  const currentImage = safeImages[currentIndex] || '';

  const goToIndex = index => {
    setCurrentIndex((index + safeImages.length) % safeImages.length);
  };

  const goNext = () => {
    goToIndex(currentIndex + 1);
  };

  const goPrev = () => {
    goToIndex(currentIndex - 1);
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-100">
      <div className="relative h-56 overflow-hidden">
        {currentImage && (
          <img
            src={currentImage}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        {showNavigation && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {safeImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  className={`h-2 w-2 rounded-full transition ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="space-y-3 px-6 py-6">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{summary}</p>
        <ul className="space-y-2 text-sm text-slate-700">
          {highlights.map(highlight => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
              {highlight}
            </li>
          ))}
        </ul>
        <p className="text-xs uppercase tracking-wide text-slate-500">{guide}</p>
      </div>
    </article>
  );
}

export default ActivityCard;
