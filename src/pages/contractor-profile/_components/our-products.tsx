import { ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { products } = contractorProfile;

export default function OurProducts() {
  return (
    <ProfileSection
      title={products.title}
      action={
        <Link
          to="/marketplace/products"
          className="font-mono text-sm leading-[normal] font-bold text-[#0a0a0a] hover:underline"
        >
          {products.seeAll}
        </Link>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {products.items.map((product) => (
          <li
            key={product.id}
            className="overflow-hidden rounded-xl border border-[#e6eaf2] bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]"
          >
            <div className="relative h-24 pt-2.5 pl-2.5">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 size-full object-cover"
              />
              <span className="relative rounded-full bg-[#e9b347] px-2 py-0.75 text-[10px] leading-[normal] font-bold text-[#26225f] uppercase">
                {products.badge}
              </span>
            </div>

            <div className="space-y-3 p-5">
              <span className="bg-input text-secondary-foreground inline-block rounded-full px-2.5 py-1 text-xs leading-[normal] font-medium">
                {product.category}
              </span>
              <h3 className="text-base leading-[normal] font-bold text-[#1e293b]">
                {product.name}
              </h3>
              <p className="flex flex-wrap items-center gap-2 text-[13px] leading-[normal] text-[#64748b]">
                <span>{product.location}</span>
                <span aria-hidden>·</span>
                <span>{product.experience}</span>
              </p>

              <div className="bg-ring h-px" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-lg leading-[normal] font-bold text-[#c92032]">
                  {product.price}
                </p>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-secondary-foreground text-secondary-foreground hover:bg-secondary flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] leading-[normal] font-medium transition-colors"
                >
                  {products.cta}
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
