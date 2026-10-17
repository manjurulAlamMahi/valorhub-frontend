import { formatPrice, type Product } from "@/pages/marketplace/data/products";
import { Award } from "lucide-react";
import { productDetails } from "../data/product-details";

export default function PurchaseCard({ product }: { product: Product }) {
  const credentials = [
    product.verified && "Verified",
    product.veteran && "Veteran Owned",
  ].filter(Boolean);

  return (
    <aside className="h-fit space-y-3.5 rounded-2xl border border-[#e6eaf2] bg-white p-6 leading-[normal] shadow-[0_6px_20px_0_rgba(0,0,0,0.08)] max-lg:order-first lg:sticky lg:top-48 lg:w-100 lg:shrink-0">
      {product.elite && (
        <span className="inline-flex h-5.5 items-center gap-1 rounded-full border border-[#fee685] bg-[#fef3c6] px-2.25 text-xs font-semibold text-[#bb4d00] uppercase">
          <Award aria-hidden className="size-2.5" />
          {productDetails.eliteBadge}
        </span>
      )}

      <h1 className="text-xl font-bold text-[#1e293b]">{product.name}</h1>

      <p className="flex items-center gap-1.5 text-[13px]">
        <span className="font-bold text-[#c92032]">
          ★ {productDetails.rating}
        </span>
        <span className="text-[#64748b]">
          ({productDetails.reviewCount} reviews)
        </span>
      </p>

      <p className="text-secondary-foreground text-[28px] font-bold">
        {formatPrice(product.price)}
      </p>

      <div className="bg-ring h-px" />

      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="bg-secondary-foreground size-10 rounded-full"
        />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#1e293b]">{product.seller}</p>
          {credentials.length > 0 && (
            <p className="text-xs text-[#64748b]">{credentials.join(" · ")}</p>
          )}
        </div>
      </div>

      <a
        href={product.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-md border border-[#c92032] px-6 py-3 text-base leading-6 font-bold text-[#c92032] transition-colors hover:bg-[#c92032] hover:text-white"
      >
        {productDetails.cta}
      </a>

      <p className="text-center text-xs text-[#64748b]">
        {productDetails.redirectNote}
      </p>
    </aside>
  );
}
