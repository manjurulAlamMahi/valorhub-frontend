import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema } from "@/lib/schemas";
import ContactDetails from "./_components/contact-details";
import ContactForm from "./_components/contact-form";
import { contact } from "./data/contact";
import type { ContactInfo } from "@/services/public";

export default function Contact() {
  const { data } = useApi<ContactInfo>("/contact");

  return (
    <>
      <SEO
        title="Contact"
        description="Questions about ValorHub? Send our support team a message, or reach us by email at support@valorhub.com or by phone at (800) 555-0199."
        canonical="https://valorhub.com/contact"
        jsonLd={breadcrumbSchema([{ name: "Contact", url: "/contact" }])}
      />

      <main className="bg-input">
        <Section>
          <Container className="space-y-2 pt-6! pb-6! text-center leading-[normal]">
            <h1 className="text-2xl font-bold text-[#1e293b] md:text-[30px]">
              {contact.title}
            </h1>
            <p className="text-[15px] text-[#64748b]">{contact.description}</p>
          </Container>
        </Section>

        <Section>
          <Container className="flex flex-col gap-6 py-10! lg:flex-row lg:items-start xl:max-w-310">
            <ContactForm />
            <ContactDetails details={data?.support_details} />
          </Container>
        </Section>
      </main>
    </>
  );
}
