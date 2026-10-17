import { marketplace } from "@/pages/marketplace/data/marketplace";
import type { Product } from "@/pages/marketplace/data/products";
import { productDetails } from "../data/product-details";

const { description, specifications } = productDetails;

const cardClassName =
  "rounded-2xl border border-[#e6eaf2] bg-white p-6 leading-[normal]";

export default function ProductInfo({ product }: { product: Product }) {
  const category =
    marketplace.categories.items
      .find((item) => item.slug === product.category)
      ?.label.split(" ")[0] ?? product.category;

  const specs = [
    { label: "Category", value: category },
    {
      label: "Availability",
      value: product.inStock
        ? specifications.inStock
        : specifications.outOfStock,
    },
    { label: "Warranty", value: specifications.warranty },
    { label: "Shipping", value: specifications.shipping },
  ];

  return (
    <>
      <section className={`${cardClassName} space-y-3`}>
        <h2 className="text-[17px] font-bold text-[#1e293b]">
          {description.title}
        </h2>
        <p className="text-sm text-[#64748b]">{description.text}</p>
      </section>

      <section className={`${cardClassName} space-y-3.5`}>
        <h2 className="text-[17px] font-bold text-[#1e293b]">
          {specifications.title}
        </h2>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {specs.map((spec) => (
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
