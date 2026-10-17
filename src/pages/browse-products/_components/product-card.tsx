import { formatPrice, type Product } from "@/pages/marketplace/data/products";
import { Link } from "react-router";
import { browseProducts } from "../data/browse-products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#e6eaf2] bg-white">
      <div className="relative h-40">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 size-full object-cover"
        />
        {product.elite && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#e9b347] px-2 py-0.75 text-[10px] leading-[normal] font-bold text-[#26225f] uppercase">
            {browseProducts.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="space-y-1 leading-[normal]">
          <h3 className="text-[15px] font-bold text-[#1e293b]">
            {product.name}
          </h3>
          <p className="text-xs text-[#64748b]">{product.seller}</p>
          <p className="text-[17px] font-bold text-[#c92032]">
            {formatPrice(product.price)}
          </p>
        </div>

        <Link
          to={`/marketplace/products/${product.id}`}
          className="mt-auto flex items-center justify-center rounded-xl border-[1.5px] border-[#c92032] px-6 py-3 text-base leading-6 font-bold text-[#c92032] transition-colors hover:bg-[#c92032] hover:text-white"
        >
          {browseProducts.cta}
        </Link>
      </div>
    </article>
  );
}
