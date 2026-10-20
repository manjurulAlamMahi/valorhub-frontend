import { formatPrice } from "@/lib/media";
import type { ContractorProfile } from "@/services/public";
import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { products: copy } = contractorProfile;

export default function OurProducts({
  products,
  location,
}: {
  products: ContractorProfile["products"];
  location: string;
}) {
  if (products.length === 0) return null;

  return (
    <ProfileSection
      title={copy.title}
      action={
        <Link
          to="/marketplace/products"
          className="font-mono text-sm leading-[normal] font-bold text-[#0a0a0a] hover:underline"
        >
          {copy.seeAll}
        </Link>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="overflow-hidden rounded-xl border border-[#e6eaf2] bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]"
          >
            {/* Products have no image in the API yet */}
            <div className="bg-input relative grid h-24 place-content-center">
              <Package
                aria-hidden
                className="text-secondary-foreground/40 size-8"
              />
              {product.is_elite_tier && (
                <span className="absolute top-2.5 left-2.5 rounded-full bg-[#e9b347] px-2 py-0.75 text-[10px] leading-[normal] font-bold text-[#26225f] uppercase">
                  {copy.badge}
                </span>
              )}
            </div>

            <div className="space-y-3 p-5">
              {product.category.name && (
                <span className="bg-input text-secondary-foreground inline-block rounded-full px-2.5 py-1 text-xs leading-[normal] font-medium">
                  {product.category.name}
                </span>
              )}
              <h3 className="text-base leading-[normal] font-bold text-[#1e293b]">
                {product.name}
              </h3>
              <p className="text-[13px] leading-[normal] text-[#64748b]">
                {location}
              </p>

              <div className="bg-ring h-px" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-lg leading-[normal] font-bold text-[#c92032]">
                  {formatPrice(product.price, product.unit)}
                </p>
                <Link
                  to={`/marketplace/products/${product.id}`}
                  className="border-secondary-foreground text-secondary-foreground hover:bg-secondary flex shrink-0 items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] leading-[normal] font-medium transition-colors"
                >
                  {copy.cta}
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
