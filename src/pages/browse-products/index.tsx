import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema } from "@/lib/schemas";
import { useSearchParams } from "react-router";
import ProductListing from "./_components/product-listing";
import { browseProducts } from "./data/browse-products";

export default function BrowseProducts() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <SEO
        title={browseProducts.title}
        description="Browse parts, equipment, and service bundles from verified veteran-owned ValorHub sellers. Filter by price, category, credentials, and availability."
        canonical="https://valorhub.com/marketplace/products"
        jsonLd={breadcrumbSchema([
          { name: "Marketplace", url: "/marketplace" },
          { name: browseProducts.title, url: "/marketplace/products" },
        ])}
      />

      <main>
        <Section className="bg-input">
          <Container className="space-y-1.5 py-7! xl:max-w-310">
            <Breadcrumb items={browseProducts.breadcrumbs} tone="light" />
            <h1 className="text-[26px] leading-[normal] font-bold text-[#1e293b]">
              {browseProducts.title}
            </h1>
            <p className="text-sm leading-[normal] text-[#64748b]">
              {browseProducts.description}
            </p>
          </Container>
        </Section>

        <ProductListing key={searchParams.get("category")} />
      </main>
    </>
  );
}
