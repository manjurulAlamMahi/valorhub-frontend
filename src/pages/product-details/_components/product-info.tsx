import type { ProductDetail } from "@/services/marketplace";
import { Check } from "lucide-react";
import { productDetails } from "../data/product-details";

const { description, specifications } = productDetails;

const cardClassName =
  "rounded-2xl border border-[#e6eaf2] bg-white p-6 leading-[normal]";

export default function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <>
      <section className={`${cardClassName} space-y-3`}>
        <h2 className="text-[17px] font-bold text-[#1e293b]">
          {description.title}
        </h2>
        <p className="text-sm text-[#64748b]">{product.description}</p>

        {product.features.length > 0 && (
          <ul className="grid gap-2 pt-1 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-[#1e293b]"
              >
                <Check aria-hidden className="size-4 shrink-0 text-[#009966]" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${cardClassName} space-y-3.5`}>
        <h2 className="text-[17px] font-bold text-[#1e293b]">
          {specifications.title}
        </h2>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {product.specifications.map((spec) => (
            <div key={spec.label} className="space-y-0.5">
              <dt className="text-xs text-[#64748b]">{spec.label}</dt>
              <dd className="text-sm font-medium text-[#1e293b]">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
