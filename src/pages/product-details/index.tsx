import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema } from "@/lib/schemas";
import { formatPrice, products } from "@/pages/marketplace/data/products";
import { NotFound } from "@/pages/NotFound";
import { useParams } from "react-router";
import ProductGallery from "./_components/product-gallery";
import ProductInfo from "./_components/product-info";
import ProductReviews from "./_components/product-reviews";
import PurchaseCard from "./_components/purchase-card";
import RelatedProducts from "./_components/related-products";
import { productDetails } from "./data/product-details";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) return <NotFound />;

  const url = `/marketplace/products/${product.id}`;
  const gallery = [
    product.image,
    ...productDetails.gallery.filter((image) => image !== product.image),
  ];

  return (
    <>
      <SEO
        title={product.name}
        description={`${product.name} from ${product.seller} — ${formatPrice(product.price)}. Sold by a verified ValorHub seller.`}
        canonical={`https://valorhub.com${url}`}
        jsonLd={breadcrumbSchema([
          { name: "Marketplace", url: "/marketplace" },
          { name: "Browse Products", url: "/marketplace/products" },
          { name: product.name, url },
        ])}
      />

      <main>
        <Section className="bg-input">
          <Container className="space-y-9 pt-5.5! pb-10! xl:max-w-310">
            <Breadcrumb
              tone="light"
              items={[
                { label: "Home", href: "/" },
                { label: "Marketplace", href: "/marketplace" },
                { label: "Browse Products", href: "/marketplace/products" },
                { label: product.name, href: url },
              ]}
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1 space-y-6">
                <ProductGallery
                  key={product.id}
                  name={product.name}
                  images={gallery}
                />
                <ProductInfo product={product} />
              </div>

              <PurchaseCard product={product} />
            </div>
          </Container>
        </Section>

        <RelatedProducts product={product} />
        <ProductReviews />
      </main>
    </>
  );
}
