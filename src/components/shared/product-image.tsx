import { cn } from "@/lib/utils";
import { productImage } from "@/services/marketplace";
import { Package } from "lucide-react";
import { useState } from "react";

// Product photo, or a neutral tile when there is none or it fails to load
export default function ProductImage({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const url = productImage(src);
  // The URL that failed to load (seeded paths may point at files the server doesn't have)
  const [failed, setFailed] = useState<string | null>(null);

  if (!url || failed === url) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("bg-input grid place-content-center", className)}
      >
        <Package aria-hidden className="text-secondary-foreground/40 size-8" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(url)}
      className={cn("bg-input object-cover", className)}
    />
  );
}
