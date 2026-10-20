import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema } from "@/lib/schemas";
import type { ProductDetail } from "@/services/marketplace";
import { NotFound } from "@/pages/NotFound";
import { useParams } from "react-router";
import ProductGallery from "./_components/product-gallery";
import ProductInfo from "./_components/product-info";
import ProductReviews from "./_components/product-reviews";
import PurchaseCard from "./_components/purchase-card";
import RelatedProducts from "./_components/related-products";

export default function ProductDetails() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id ?? "");
  const { data, error, isLoading, refetch } = useApi<ProductDetail>(
    valid ? `/marketplace/products/${id}` : null,
  );

  if (!valid || error?.status === 404) return <NotFound />;
  if (error) {
    return (
      <main className="bg-input">
        <Container>
          <ErrorState error={error} onRetry={refetch} className="my-20" />
        </Container>
      </main>
    );
  }
  // Don't show the previous product while a related one loads
  if (!data || isLoading) return <PageLoader />;

  const url = `/marketplace/products/${data.id}`;
  const gallery = data.gallery_images.length
    ? data.gallery_images
    : [data.image];

  return (
    <>
      <SEO
        title={data.name}
        description={`${data.name} from ${data.seller.business_name ?? "a verified seller"} — ${data.price_display}. Sold by a verified ValorHub seller.`}
        canonical={`https://valorhub.com${url}`}
        jsonLd={breadcrumbSchema([
          { name: "Marketplace", url: "/marketplace" },
          { name: "Browse Products", url: "/marketplace/products" },
          { name: data.name, url },
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
                { label: data.name, href: url },
              ]}
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1 space-y-6">
                <ProductGallery
                  key={data.id}
                  name={data.name}
                  images={gallery}
                />
                <ProductInfo product={data} />
              </div>

              <PurchaseCard product={data} />
            </div>
          </Container>
        </Section>

        <RelatedProducts products={data.related_products} />
        <ProductReviews reviews={data.reviews} />
      </main>
    </>
  );
}
