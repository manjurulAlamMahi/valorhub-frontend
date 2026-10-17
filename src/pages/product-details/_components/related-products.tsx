import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import {
  formatPrice,
  products,
  type Product,
} from "@/pages/marketplace/data/products";
import { Link } from "react-router";
import { productDetails } from "../data/product-details";

export default function RelatedProducts({ product }: { product: Product }) {
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <Section className="bg-white">
      <Container className="space-y-4 py-10! xl:max-w-310">
        <h2 className="text-lg leading-[normal] font-bold text-[#1e293b]">
          {productDetails.related.title}
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <li key={item.id}>
              <Link
                to={`/marketplace/products/${item.id}`}
                className="block overflow-hidden rounded-xl border border-[#e6eaf2] bg-white transition-shadow hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-30 w-full object-cover"
                />
                <div className="space-y-0.75 p-3.5 text-sm leading-[normal]">
                  <h3 className="font-bold text-[#1e293b]">{item.name}</h3>
                  <p className="text-xs text-[#64748b]">{item.seller}</p>
                  <p className="font-bold text-[#c92032]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
