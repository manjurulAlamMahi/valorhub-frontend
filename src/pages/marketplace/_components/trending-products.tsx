import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { Link, useSearchParams } from "react-router";
import { marketplace } from "../data/marketplace";
import {
  formatPrice,
  products as catalog,
  trendingProducts,
} from "../data/products";

const { products } = marketplace;

export default function TrendingProducts() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const items = query
    ? catalog.filter((product) =>
        `${product.name} ${product.seller} ${product.category}`
          .toLowerCase()
          .includes(query),
      )
    : trendingProducts;

  return (
    <Section className="bg-input">
      <Container className="space-y-5 py-10! xl:max-w-310">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg leading-[normal] font-bold text-[#1e293b]">
            {query ? products.resultsTitle : products.title}
          </h2>
          <Link
            to="/marketplace/products"
            className="text-sm leading-[normal] font-medium text-[#c92032] hover:underline"
          >
            {products.seeAll}
          </Link>
        </div>

        {items.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/marketplace/products/${product.id}`}
                  className="block h-full overflow-hidden rounded-xl border border-[#e6eaf2] bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative h-35">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                    {product.elite && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-[#e9b347] px-2 py-0.75 text-[10px] leading-[normal] font-bold text-[#26225f] uppercase">
                        {products.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 p-4 leading-[normal]">
                    <h3 className="text-sm font-bold text-[#1e293b]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#64748b]">{product.seller}</p>
                    <p className="text-base font-bold text-[#c92032]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm">
            {products.empty}
          </p>
        )}
      </Container>
    </Section>
  );
}
