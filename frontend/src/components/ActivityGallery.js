import { useEffect, useMemo, useState } from 'react';

const IPFS_GATEWAYS = [
  'https://nftstorage.link',
  'https://cloudflare-ipfs.com',
  'https://ipfs.io'
];

function ActivityGallery({ images = [], alt, imageFolderCid }) {
  const [folderImages, setFolderImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!imageFolderCid) {
      setFolderImages([]);
      return;
    }

    let isMounted = true;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

    const loadFromGateway = async gateway => {
      const url = `${gateway}/api/v0/ls?arg=${encodeURIComponent(imageFolderCid)}`;
      const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
      if (!response.ok) {
        throw new Error(`Gateway responded with ${response.status}`);
      }

      const data = await response.json();
      const links = data?.Objects?.[0]?.Links || [];

      const files = links
        .filter(link => link && link.Name && !link.Name.startsWith('.') && Number(link.Type) === 2)
        .sort((a, b) => a.Name.localeCompare(b.Name))
        .map(link => {
          const encodedName = encodeURIComponent(link.Name);
          if (link.Hash) {
            return `${gateway}/ipfs/${link.Hash}?filename=${encodedName}`;
          }
          return `${gateway}/ipfs/${imageFolderCid}/${encodedName}`;
        });

      return files;
    };

    const loadFolderImages = async () => {
      for (const gateway of IPFS_GATEWAYS) {
        try {
          const files = await loadFromGateway(gateway);
          if (isMounted) {
            setFolderImages(files);
            setActiveIndex(0);
          }
          return;
        } catch (error) {
          if (controller?.signal?.aborted) {
            return;
          }
          console.warn(`Failed to load IPFS folder from ${gateway}`, error);
        }
      }

      if (isMounted) {
        setFolderImages([]);
      }
    };

    loadFolderImages();

    return () => {
      isMounted = false;
      controller?.abort();
    };
  }, [imageFolderCid]);

  const gallery = useMemo(() => {
    const combined = [...folderImages, ...images].filter(Boolean);
    return Array.from(new Set(combined));
  }, [folderImages, images]);

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
