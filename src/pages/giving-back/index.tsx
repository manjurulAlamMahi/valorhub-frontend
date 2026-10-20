import Container from "@/components/shared/container";
import CtaBanner from "@/components/shared/cta-banner";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema } from "@/lib/schemas";
import type { GivingBackData } from "@/services/public";
import GivingBackHero from "./_components/giving-back-hero";
import ImpactStats from "./_components/impact-stats";
import Initiatives from "./_components/initiatives";
import VeteranStory from "./_components/veteran-story";
import { givingBack } from "./data/giving-back";

export default function GivingBack() {
  const { data, error, refetch } = useApi<GivingBackData>("/giving-back");

  return (
    <>
      <SEO
        title="Giving Back"
        description="For every job completed on ValorHub, a portion of our platform fee supports veteran and first-responder causes — home repair grants, emergency housing, and job placement."
        canonical="https://valorhub.com/giving-back"
        jsonLd={breadcrumbSchema([
          { name: "Giving Back", url: "/giving-back" },
        ])}
      />

      {!data && error ? (
        <main>
          <Container>
            <ErrorState error={error} onRetry={refetch} className="my-20" />
          </Container>
        </main>
      ) : !data ? (
        <PageLoader />
      ) : (
        <main>
          <GivingBackHero hero={data.hero} />
          <ImpactStats stats={data.impact_metrics} />
          <Initiatives initiatives={data.initiatives} />
          <VeteranStory story={data.testimonial} />
          <CtaBanner
            title={data.nomination_cta.headline}
            description={data.nomination_cta.subtitle}
            actions={[
              {
                label: data.nomination_cta.action_label,
                link: givingBack.nominatePath,
              },
            ]}
            className="bg-[#f4f4f4]"
            containerClassName="py-10! xl:max-w-310"
            cardClassName="py-10"
            titleClassName="lg:text-[42px]"
          />
        </main>
      )}
    </>
  );
}
