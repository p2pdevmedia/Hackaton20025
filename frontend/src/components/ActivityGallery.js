import { useEffect, useState } from 'react';

const normalizeGateway = value => {
  if (!value || typeof value !== 'string') {
    return 'https://ipfs.io';
  }
  return value.replace(/\/+$/, '');
};

const isFileLink = link => {
  if (!link || typeof link !== 'object') {
    return false;
  }
  if (!link.Name) {
    return false;
  }
  if (link.Type === 1 || link.Type === 'directory') {
    return false;
  }
  if (link.Type === 2 || link.Type === 'file') {
    return true;
  }
  if (typeof link.Type === 'number') {
    return link.Type !== 1;
  }
  return typeof link.Size === 'number' && link.Size > 0;
};

function ActivityGallery({ images = [], alt }) {
  const [resolvedImages, setResolvedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const resolveImages = async () => {
      const staticUrls = [];
      const directorySources = [];

      images.filter(Boolean).forEach(entry => {
        if (typeof entry === 'string') {
          staticUrls.push(entry);
          return;
        }

        if (entry && typeof entry === 'object' && entry.cid) {
          directorySources.push(entry);
        }
      });

      const aggregated = [...staticUrls];

      for (const source of directorySources) {
        const cid = source.cid;
        const gateway = normalizeGateway(source.gateway);
        const endpoint = `${gateway}/api/v0/ls?arg=${encodeURIComponent(cid)}`;

        try {
          const response = await fetch(endpoint);
          if (!response.ok) {
            console.warn(`Failed to load IPFS directory listing for ${cid}: ${response.status}`);
            continue;
          }

          const payload = await response.json();
          const objects = Array.isArray(payload?.Objects) ? payload.Objects : [];

          objects.forEach(object => {
            const baseHash = object?.Hash || cid;
            const links = Array.isArray(object?.Links) ? object.Links : [];
            const files = links
              .filter(isFileLink)
              .sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));

            files.forEach(link => {
              const filename = link.Name;
              if (!filename) {
                return;
              }

              const encodedName = encodeURIComponent(filename);
              aggregated.push(`${gateway}/ipfs/${baseHash}/${encodedName}`);
            });
          });
        } catch (error) {
          console.error('Failed to load IPFS directory images', error);
        }
      }

      if (!cancelled) {
        const unique = Array.from(new Set(aggregated));
        setResolvedImages(unique);
      }
    };

    resolveImages();

    return () => {
      cancelled = true;
    };
  }, [images]);

  useEffect(() => {
    if (resolvedImages.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= resolvedImages.length) {
      setActiveIndex(0);
    }
  }, [resolvedImages, activeIndex]);

  if (resolvedImages.length === 0) {
    return null;
  }

  const showControls = resolvedImages.length > 1;

  const goToIndex = index => {
    setActiveIndex((index + resolvedImages.length) % resolvedImages.length);
  };

  const goToPrev = () => {
    goToIndex(activeIndex - 1);
  };

  const goToNext = () => {
    goToIndex(activeIndex + 1);
  };

  return (
    <div className="relative h-56 overflow-hidden">
      {resolvedImages.map((src, index) => (
        <img
          key={src}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" aria-hidden="true" />
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
            {resolvedImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
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
