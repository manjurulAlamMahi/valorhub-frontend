import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { Link } from "react-router";
import { marketplace } from "../data/marketplace";

const { categories } = marketplace;

export default function ShopByCategory() {
  return (
    <Section className="bg-input">
      <Container className="space-y-5 py-10! xl:max-w-310">
        <h2 className="text-xl leading-[normal] font-bold text-[#111827]">
          {categories.title}
        </h2>

        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.items.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/marketplace/products?category=${category.slug}`}
                className="relative block h-32.5 overflow-hidden rounded-[14px] transition-opacity hover:opacity-90"
              >
                <img
                  src={category.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 flex h-12.5 items-center bg-black/45 px-3.5 text-sm leading-[normal] font-bold text-white">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
