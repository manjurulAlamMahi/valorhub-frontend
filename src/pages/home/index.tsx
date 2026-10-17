import { SEO } from "@/components/seo/SEO";
import { homeFaqs, organizationSchema, websiteSchema } from "@/lib/schemas";
import Achievement from "./_components/achievements";
import BrowsByCategory from "./_components/brows-by-category";
import Career from "./_components/career";
import CustomerStories from "./_components/customer-stories";
import FindAPro from "./_components/find-a-pro";
import Hero from "./_components/hero";
import SimpleAndFast from "./_components/simple-and-fast";
import WhyChooseUs from "./_components/why-choose-us";

export default function Home() {
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
        <Hero />
        <FindAPro />
        <Achievement />
        <BrowsByCategory />
        <WhyChooseUs />
        <SimpleAndFast />
        <CustomerStories />
        <Career />
      </main>
    </>
  );
}
