import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { homeFaqs, organizationSchema, websiteSchema } from "@/lib/schemas";
import type { HomeData } from "@/services/public";
import Achievement from "./_components/achievements";
import BrowsByCategory from "./_components/brows-by-category";
import Career from "./_components/career";
import CustomerStories from "./_components/customer-stories";
import FindAPro from "./_components/find-a-pro";
import Hero from "./_components/hero";
import SimpleAndFast from "./_components/simple-and-fast";
import WhyChooseUs from "./_components/why-choose-us";

export default function Home() {
  // Marketing copy stays static; spotlight, metrics, categories and testimonials come from the API
  const { data, error, refetch } = useApi<HomeData>("/home");

  return (
    <>
      <SEO
        title="Veteran-Owned Business Marketplace"
        description="Connect with 50,000+ verified veteran-owned businesses across the US. Trusted professionals for home services, contracting, healthcare, and more — all vetted through ID.me."
        canonical="https://valorhub.com/"
        ogImage="https://valorhub.com/og/home.png"
        jsonLd={[websiteSchema, organizationSchema, homeFaqs]}
      />

      <main>
        <Hero spotlight={data?.hero_spotlight} />
        <FindAPro />
        <Achievement metrics={data?.metrics} />
        <BrowsByCategory
          categories={data?.categories}
          error={error}
          onRetry={refetch}
        />
        <WhyChooseUs />
        <SimpleAndFast />
        <CustomerStories testimonials={data?.testimonials} />
        <Career />
      </main>
    </>
  );
}
