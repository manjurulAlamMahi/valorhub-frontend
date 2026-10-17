import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema } from "@/lib/schemas";
import Career from "@/pages/home/_components/career";
import { findByService } from "@/pages/home/data/find-by-service";
import { NotFound } from "@/pages/NotFound";
import { useParams } from "react-router";
import ContractorListHero from "./_components/contractor-list-hero";
import ContractorListing from "./_components/contractor-listing";

export default function ContractorList() {
  const { slug } = useParams();
  const service = findByService.services.find((item) => item.slug === slug);

  if (!service) return <NotFound />;

  return (
    <>
      <SEO
        title={service.title}
        description={`Find verified veteran-owned ${service.title.toLowerCase()} — ${service.description.toLowerCase()}. Compare ratings, credentials and prices, then request a quote.`}
        canonical={`https://valorhub.com/category/${service.slug}`}
        jsonLd={breadcrumbSchema([
          { name: "Category", url: "/category" },
          { name: service.title, url: `/category/${service.slug}` },
        ])}
      />

      <main>
        <ContractorListHero
          slug={service.slug}
          title={service.title}
          description={service.description}
        />
        <ContractorListing key={service.slug} slug={service.slug} />
        <Career />
      </main>
    </>
  );
}
