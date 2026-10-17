import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { products } from "@/pages/marketplace/data/products";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { browseProducts, initialFilters } from "../data/browse-products";
import ProductCard from "./product-card";
import ProductFilters from "./product-filters";

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    categories: category ? [category] : [],
  }));

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const [low, high] = filters.price;
        if (product.price < low || product.price > high) return false;
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(product.category)
        )
          return false;
        if (filters.inStock && !product.inStock) return false;

        return filters.credentials.every(
          (credential) =>
            product[credential as "elite" | "verified" | "veteran"],
        );
      }),
    [filters],
  );

  return (
    <Section className="bg-input">
      <Container className="flex flex-col gap-6 pt-10! pb-11! lg:flex-row xl:max-w-310">
        <ProductFilters filters={filters} onChange={setFilters} />

        <div className="min-w-0 flex-1 space-y-5">
          <p className="text-right text-sm leading-[normal] text-[#64748b]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>

          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm">
              {browseProducts.empty}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
