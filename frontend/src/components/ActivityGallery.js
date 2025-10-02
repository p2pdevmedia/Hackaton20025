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
  if (!link.Name && !link.Path) {
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

const toFileName = link => {
  if (!link) {
    return null;
  }
  if (typeof link === 'string') {
    return link;
  }
  if (link.Name) {
    return link.Name;
  }
  if (link.Path) {
    const path = link.Path.split('/');
    return path[path.length - 1];
  }
  return null;
};

const buildFileUrl = (gateway, baseHash, filename) => {
  if (!filename) {
    return null;
  }
  const sanitizedGateway = normalizeGateway(gateway);
  const sanitizedName = encodeURIComponent(filename);
  return `${sanitizedGateway}/ipfs/${baseHash}/${sanitizedName}`;
};

const extractLinksFromJson = (payload, cid) => {
  if (!payload) {
    return [];
  }

  const normalizeLinks = (links, baseHash) => {
    if (!Array.isArray(links)) {
      return [];
    }
    const hash = baseHash || cid;
    return links.filter(isFileLink).map(link => ({
      name: toFileName(link),
      hash: link.Hash || hash,
    }));
  };

  if (Array.isArray(payload)) {
    return payload.map(entry => ({
      name: toFileName(entry),
      hash: entry?.Hash || cid,
    }));
  }

  if (Array.isArray(payload.links)) {
    return normalizeLinks(payload.links, payload.hash || payload.cid || cid);
  }

  if (Array.isArray(payload.Links)) {
    return normalizeLinks(payload.Links, payload.Hash || payload.Cid || cid);
  }

  if (Array.isArray(payload.Objects)) {
    return payload.Objects.flatMap(object => {
      const baseHash = object?.Hash || cid;
      return normalizeLinks(object?.Links, baseHash);
    });
  }

  if (payload.files && Array.isArray(payload.files)) {
    return normalizeLinks(payload.files, payload.hash || payload.cid || cid);
  }

  return [];
};

const extractLinksFromHtml = (html, baseUrl) => {
  if (!html || typeof html !== 'string') {
    return [];
  }

  if (typeof DOMParser === 'undefined') {
    return [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const anchors = Array.from(doc.querySelectorAll('a[href]'));

  const urls = anchors
    .map(anchor => anchor.getAttribute('href') || '')
    .map(href => href.trim())
    .filter(Boolean)
    .filter(href => !href.startsWith('?') && !href.startsWith('#'))
    .filter(href => href !== '../' && href !== './');

  const normalized = urls
    .map(href => {
      try {
        return new URL(href, baseUrl).href;
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean)
    .filter(url => !url.endsWith('/'));

  return normalized;
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
        const candidateEndpoints = [
          `${gateway}/ipfs/${cid}?format=json`,
          `${gateway}/ipfs/${cid}`,
        ];

        let resolved = false;

        for (const endpoint of candidateEndpoints) {
          try {
            const response = await fetch(endpoint, {
              headers: {
                Accept: 'application/json, text/html;q=0.9, */*;q=0.8',
              },
            });

            if (!response.ok) {
              continue;
            }

            const body = await response.text();
            let links = [];

            try {
              const payload = JSON.parse(body);
              links = extractLinksFromJson(payload, cid).map(entry =>
                buildFileUrl(gateway, entry.hash || cid, entry.name)
              );
            } catch (error) {
              // not JSON, fall back to HTML parsing
            }

            if (!links.length) {
              links = extractLinksFromHtml(body, endpoint);
            }

            const filteredLinks = links.filter(Boolean);

            if (filteredLinks.length > 0) {
              filteredLinks
                .sort((a, b) => a.localeCompare(b))
                .forEach(url => {
                  aggregated.push(url);
                });
              resolved = true;
              break;
            }
          } catch (error) {
            console.error('Failed to load IPFS directory images', error);
          }
        }

        if (!resolved) {
          console.warn(`Unable to resolve IPFS directory images for ${cid}`);
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
