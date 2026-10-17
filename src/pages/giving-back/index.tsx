import CtaBanner from "@/components/shared/cta-banner";
import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema } from "@/lib/schemas";
import GivingBackHero from "./_components/giving-back-hero";
import ImpactStats from "./_components/impact-stats";
import Initiatives from "./_components/initiatives";
import VeteranStory from "./_components/veteran-story";
import { givingBack } from "./data/giving-back";

export default function GivingBack() {
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

      <main>
        <GivingBackHero />
        <ImpactStats />
        <Initiatives />
        <VeteranStory />
        <CtaBanner
          title={givingBack.cta.title}
          description={givingBack.cta.description}
          className="bg-[#f4f4f4]"
          containerClassName="py-10! xl:max-w-310"
          cardClassName="py-10"
          titleClassName="lg:text-[42px]"
        />
      </main>
    </>
  );
}
