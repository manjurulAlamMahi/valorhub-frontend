import { formatPrice } from "@/lib/media";

type PriceRangeProps = {
  bounds: [number, number];
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

const thumbClassName =
  "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#c92032] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#c92032] [&::-webkit-slider-thumb]:bg-white";

export default function PriceRange({
  bounds,
  value,
  onChange,
}: PriceRangeProps) {
  const [min, max] = bounds;
  const [low, high] = value;
  const toPercent = (price: number) => ((price - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-5">
        <div className="bg-ring absolute inset-x-0 top-2 h-1 rounded-full" />
        <div
          className="absolute top-2 h-1 rounded-full bg-[#c92032]"
          style={{
            left: `${toPercent(low)}%`,
            right: `${100 - toPercent(high)}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={low}
          aria-label="Minimum price"
          onChange={(event) =>
            onChange([Math.min(Number(event.target.value), high), high])
          }
          className={thumbClassName}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={high}
          aria-label="Maximum price"
          onChange={(event) =>
            onChange([low, Math.max(Number(event.target.value), low)])
          }
          className={thumbClassName}
        />
      </div>

      <div className="flex items-center justify-between">
        {[low, high].map((price, index) => (
          <span
            key={index}
            className="bg-input rounded-md px-2.5 py-1.5 text-xs leading-[normal] font-medium text-[#1e293b]"
          >
            {formatPrice(price)}
          </span>
        ))}
      </div>
    </div>
  );
}
