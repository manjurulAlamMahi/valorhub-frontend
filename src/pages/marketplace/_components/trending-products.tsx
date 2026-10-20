import Container from "@/components/shared/container";
import ProductImage from "@/components/shared/product-image";
import { EmptyState, ErrorState } from "@/components/shared/query-state";
import Section from "@/components/shared/section";
import type { ApiError } from "@/lib/api";
import type { ProductCard } from "@/services/marketplace";
import { Link } from "react-router";
import { marketplace } from "../data/marketplace";

const { products: copy } = marketplace;

export default function TrendingProducts({
  products,
  error,
  onRetry,
}: {
  products?: ProductCard[];
  error?: ApiError;
  onRetry?: () => void;
}) {
  return (
    <Section className="bg-input">
      <Container className="space-y-5 py-10! xl:max-w-310">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg leading-[normal] font-bold text-[#1e293b]">
            {copy.title}
          </h2>
          <Link
            to="/marketplace/products"
            className="text-sm leading-[normal] font-medium text-[#c92032] hover:underline"
          >
            {copy.seeAll}
          </Link>
        </div>

        {!products && error ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : products?.length === 0 ? (
          <EmptyState>{copy.empty}</EmptyState>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products
              ? products.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/marketplace/products/${product.id}`}
                      className="block h-full overflow-hidden rounded-xl border border-[#e6eaf2] bg-white transition-shadow hover:shadow-md"
                    >
                      <div className="relative h-35">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 size-full"
                        />
                        {product.is_elite_tier && (
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#e9b347] px-2 py-0.75 text-[10px] leading-[normal] font-bold text-[#26225f] uppercase">
                            {copy.badge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 p-4 leading-[normal]">
                        <h3 className="text-sm font-bold text-[#1e293b]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#64748b]">
                          {product.seller.business_name}
                        </p>
                        <p className="text-base font-bold text-[#c92032]">
                          {product.price_display}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              : Array.from({ length: 4 }, (_, index) => (
                  <li
                    key={index}
                    aria-hidden
                    className="h-60 animate-pulse rounded-xl bg-white"
                  />
                ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
