import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import type { Category } from "@/services/public";
import { Link } from "react-router";
import { marketplace } from "../data/marketplace";

const { categories: copy } = marketplace;

export default function ShopByCategory({
  categories,
}: {
  categories?: Category[];
}) {
  if (categories?.length === 0) return null;

  return (
    <Section className="bg-input">
      <Container className="space-y-5 py-10! xl:max-w-310">
        <h2 className="text-xl leading-[normal] font-bold text-[#111827]">
          {copy.title}
        </h2>

        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories
            ? categories.map((category, index) => (
                <li key={category.id}>
                  <Link
                    to={`/marketplace/products?categories=${category.id}`}
                    className="relative block h-32.5 overflow-hidden rounded-[14px] transition-opacity hover:opacity-90"
                  >
                    <img
                      src={copy.images[index % copy.images.length]}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex h-12.5 items-center bg-black/45 px-3.5 text-sm leading-[normal] font-bold text-white">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))
            : Array.from({ length: 5 }, (_, index) => (
                <li
                  key={index}
                  aria-hidden
                  className="h-32.5 animate-pulse rounded-[14px] bg-[#e2e4ee]"
                />
              ))}
        </ul>
      </Container>
    </Section>
  );
}
