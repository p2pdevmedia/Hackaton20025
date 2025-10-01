import { useEffect, useMemo, useState } from 'react';

const resolveFolderImages = async (folderCid, signal) => {
  const endpoint = `https://ipfs.io/api/v0/ls?arg=${encodeURIComponent(folderCid)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Unexpected status ${response.status}`);
  }

  const payload = await response.json();
  const links = payload?.Objects?.[0]?.Links || [];

  return links
    .filter(link => link && typeof link.Hash === 'string' && link.Type !== 1)
    .sort((a, b) => (a?.Name || '').localeCompare(b?.Name || ''))
    .map(link => {
      const base = `https://ipfs.io/ipfs/${link.Hash}`;
      if (link?.Name) {
        return `${base}?filename=${encodeURIComponent(link.Name)}`;
      }
      return base;
    });
};

function ActivityGallery({ images = [], alt, folderCid }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [folderImages, setFolderImages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (!folderCid) {
      setFolderImages([]);
      return () => {
        isMounted = false;
      };
    }

    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const resolved = await resolveFolderImages(folderCid, controller.signal);
        if (isMounted) {
          setFolderImages(resolved);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error(`Failed to load images for IPFS directory ${folderCid}`, error);
        if (isMounted) {
          setFolderImages([]);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [folderCid]);

  const baseImages = useMemo(() => images.filter(Boolean), [images]);
  const gallery = useMemo(() => {
    if (folderImages.length === 0) {
      return baseImages;
    }
    const combined = [...baseImages, ...folderImages];
    return Array.from(new Set(combined.filter(Boolean)));
  }, [baseImages, folderImages]);

  useEffect(() => {
    if (gallery.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= gallery.length) {
      setActiveIndex(0);
    }
  }, [gallery, activeIndex]);

  if (gallery.length === 0) {
    return null;
  }

  const showControls = gallery.length > 1;

  const goToIndex = index => {
    setActiveIndex((index + gallery.length) % gallery.length);
  };

  const goToPrev = () => {
    goToIndex(activeIndex - 1);
  };

  const goToNext = () => {
    goToIndex(activeIndex + 1);
  };

  return (
    <div className="relative h-56 overflow-hidden">
      {gallery.map((src, index) => (
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
            {gallery.map((src, index) => (
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
