import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const thumbs = images
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== active)
    .slice(0, 4);

  return (
    <div className="space-y-2.5">
      <img
        src={images[active]}
        alt={name}
        className="h-64 w-full rounded-2xl object-cover sm:h-95"
      />

      <ul className="grid grid-cols-4 gap-2.5">
        {thumbs.map(({ image, index }) => (
          <li key={index}>
            <button
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActive(index)}
              className="block w-full overflow-hidden rounded-[10px] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#c92032]"
            >
              <img src={image} alt="" className="h-20 w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
