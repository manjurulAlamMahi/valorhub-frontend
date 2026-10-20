import UserAvatar from "@/components/shared/user-avatar";
import { mediaUrl } from "@/lib/media";
import { externalLink, type ProductDetail } from "@/services/marketplace";
import { Award } from "lucide-react";
import { Link } from "react-router";
import { productDetails } from "../data/product-details";

const ctaClassName =
  "flex w-full items-center justify-center rounded-md border border-[#c92032] px-6 py-3 text-base leading-6 font-bold text-[#c92032] transition-colors hover:bg-[#c92032] hover:text-white";

export default function PurchaseCard({ product }: { product: ProductDetail }) {
  const { seller } = product;
  const sellerName = seller.business_name ?? "Verified seller";
  const credentials = [
    seller.is_id_verified && "Verified",
    seller.is_veteran_owned && "Veteran Owned",
  ].filter(Boolean);
  // Purchases happen on the seller's own site; without one, send buyers to the profile
  const purchaseUrl =
    externalLink(product.external_url) ?? externalLink(seller.website_url);

  return (
    <aside className="h-fit space-y-3.5 rounded-2xl border border-[#e6eaf2] bg-white p-6 leading-[normal] shadow-[0_6px_20px_0_rgba(0,0,0,0.08)] max-lg:order-first lg:sticky lg:top-48 lg:w-100 lg:shrink-0">
      {seller.is_elite && (
        <span className="inline-flex h-5.5 items-center gap-1 rounded-full border border-[#fee685] bg-[#fef3c6] px-2.25 text-xs font-semibold text-[#bb4d00] uppercase">
          <Award aria-hidden className="size-2.5" />
          {productDetails.eliteBadge}
        </span>
      )}

      <h1 className="text-xl font-bold text-[#1e293b]">{product.name}</h1>

      <p className="flex items-center gap-1.5 text-[13px]">
        <span className="font-bold text-[#c92032]">
          ★ {product.rating.toFixed(1)}
        </span>
        <span className="text-[#64748b]">({product.review_count} reviews)</span>
      </p>

      <p className="text-secondary-foreground text-[28px] font-bold">
        {product.price_display}
        {product.unit && (
          <span className="pl-1.5 text-sm font-medium text-[#64748b]">
            {product.unit}
          </span>
        )}
      </p>

      <div className="bg-ring h-px" />

      <Link
        to={`/contractors/${seller.id}`}
        className="group flex items-center gap-2.5"
      >
        <UserAvatar
          name={sellerName}
          src={mediaUrl(seller.avatar)}
          className="size-10"
        />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#1e293b] group-hover:underline">
            {sellerName}
          </p>
          <p className="text-xs text-[#64748b]">
            {[...credentials, seller.location].join(" · ")}
          </p>
        </div>
      </Link>

      {purchaseUrl ? (
        <>
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaClassName}
          >
            {productDetails.cta}
          </a>
          <p className="text-center text-xs text-[#64748b]">
            {product.redirection_notice}
          </p>
        </>
      ) : (
        <Link to={`/contractors/${seller.id}`} className={ctaClassName}>
          {productDetails.sellerCta}
        </Link>
      )}
    </aside>
  );
}
