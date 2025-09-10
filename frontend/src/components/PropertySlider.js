import { useState } from 'react';

function PropertySlider({ properties }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % properties.length);
  const prev = () => setIndex((index - 1 + properties.length) % properties.length);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {properties.map(p => (
            <div key={p.id} className="flex-shrink-0 w-full relative">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2"
      >
        ›
      </button>
    </div>
  );
}

export default PropertySlider;
