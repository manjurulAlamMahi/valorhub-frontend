import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema, faqSchema } from "@/lib/schemas";
import type { FaqData } from "@/services/public";
import FaqList from "./_components/faq-list";
import { faq } from "./data/faq";

export default function Faq() {
  const query = useApi<FaqData>("/faqs");
  const items = query.data?.items ?? [];

  return (
    <>
      <SEO
        title="FAQ"
        description="Answers to common questions about ValorHub — requesting quotes, platform fees, Elite Members, joining as a contractor, and payments."
        canonical="https://valorhub.com/faq"
        jsonLd={[
          ...(items.length ? [faqSchema(items)] : []),
          breadcrumbSchema([{ name: "FAQ", url: "/faq" }]),
        ]}
      />

      <main>
        <Section className="bg-input">
          <Container className="space-y-2 pt-6! pb-6! text-center leading-[normal]">
            <h1 className="text-2xl font-bold text-[#1e293b] md:text-[30px]">
              {faq.title}
            </h1>
            <p className="text-[15px] text-[#64748b]">{faq.description}</p>
          </Container>
        </Section>

        <FaqList query={query} />
      </main>
    </>
  );
}
