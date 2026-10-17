/**
 * schemas.ts
 *
 * Centralised JSON-LD structured data for ValorHub.
 * Import these in page components and pass via the `jsonLd` prop on <SEO />.
 *
 * Docs: https://schema.org
 * Validator: https://search.google.com/test/rich-results
 */

const BASE_URL = "https://valorhub.com";

// ─── 1. Organization ──────────────────────────────────────────────────────────
// Powers Google Knowledge Panel and brand recognition in search results.
// https://schema.org/Organization

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ValorHub",
  alternateName: "Valor Hub",
  description:
    "ValorHub connects Americans with verified veteran-owned businesses. Find trusted professionals for home services, contracting, and more — all vetted through ID.me.",
  url: BASE_URL,
  logo: `${BASE_URL}/icons/logo-512.png`,
  image: `${BASE_URL}/og/home.png`,
  foundingDate: "2025",
  slogan: "They Served Their Country. Now, They're Here to Serve You.",
  sameAs: [
    // ↓ Replace with real social profile URLs
    "https://www.facebook.com/valorhub",
    "https://www.instagram.com/valorhub",
    "https://twitter.com/valorhub",
    "https://www.tiktok.com/@valorhub",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${BASE_URL}/contact`,
  },
};

// ─── 2. WebSite (enables Google Sitelinks search box) ─────────────────────────
// https://schema.org/WebSite

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ValorHub",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/marketplace?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── 3. Service Marketplace ───────────────────────────────────────────────────
// Describes ValorHub as a marketplace platform for services.
// https://schema.org/Service

export const marketplaceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "ValorHub Marketplace",
  provider: {
    "@type": "Organization",
    name: "ValorHub",
    url: BASE_URL,
  },
  description:
    "A marketplace connecting customers with verified veteran-owned businesses across Blue Collar, Grey Collar, Gold Collar, White Collar, and specialty service categories.",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Veteran-Owned Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Blue Collar Services",
          description:
            "Skilled trades and construction professionals — plumbing, electrical, HVAC, and more.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Grey Collar Services",
          description:
            "Technical and specialized professionals bridging skilled trades and knowledge work.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Gold Collar Services",
          description:
            "Healthcare and advanced professionals with specialized expertise.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "White Collar Services",
          description:
            "Professional and business services including consulting, legal, and financial.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Other Services",
          description:
            "Creative, wellness, and lifestyle professionals for every need.",
        },
      },
    ],
  },
};

// ─── 4. BreadcrumbList ────────────────────────────────────────────────────────
// Shows the path hierarchy in Google search results.
// https://schema.org/BreadcrumbList
// Usage: breadcrumbSchema([{ name: 'Marketplace', url: '/marketplace' }])

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${BASE_URL}${item.url}`,
      })),
    ],
  };
}

// ─── 5. FAQPage ───────────────────────────────────────────────────────────────
// Shows expandable Q&A directly in search results (rich result).
// https://schema.org/FAQPage
// Add to any page that has a FAQ section.

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── 6. Review / AggregateRating ──────────────────────────────────────────────
// Shows star ratings in search results.
// https://schema.org/AggregateRating
//
// IMPORTANT: Google requires reviews to be real and verifiable.
// Only add this after you have testimonials with named reviewers on the page.
//
// Usage: merge into organizationSchema or a specific professional's listing:
// aggregateRating: aggregateRatingSchema(4.9, 127)

export function aggregateRatingSchema(
  ratingValue: number,
  reviewCount: number,
) {
  return {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

// ─── 7. Professional / Person listing ────────────────────────────────────────
// For individual veteran professional profile pages.
// https://schema.org/Person
// Usage: professionalSchema({ name: 'John Smith', jobTitle: 'HVAC Technician', ... })

export function professionalSchema(data: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  url: string;
  telephone?: string;
  areaServed?: string;
  reviewCount?: number;
  ratingValue?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: `${BASE_URL}${data.url}`,
    ...(data.image && { image: data.image }),
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.areaServed && {
      areaServed: { "@type": "City", name: data.areaServed },
    }),
    ...(data.ratingValue &&
      data.reviewCount && {
        aggregateRating: aggregateRatingSchema(
          data.ratingValue,
          data.reviewCount,
        ),
      }),
    memberOf: {
      "@type": "Organization",
      name: "ValorHub",
      url: BASE_URL,
    },
  };
}

export const homeFaqs = faqSchema([
  {
    question: "What is ValorHub?",
    answer:
      "ValorHub is a marketplace connecting Americans with verified veteran-owned businesses. Every professional on our platform is authenticated through ID.me, ensuring you hire trusted, vetted experts.",
  },
  {
    question: "How are professionals verified on ValorHub?",
    answer:
      "All veteran-owned businesses on ValorHub are authenticated through ID.me — the industry-leading identity verification platform — ensuring every professional you hire is who they say they are.",
  },
  {
    question: "What types of services can I find on ValorHub?",
    answer:
      "ValorHub covers five service categories: Blue Collar (skilled trades like plumbing, electrical, HVAC), Grey Collar (technical and specialized professionals), Gold Collar (healthcare and advanced professionals), White Collar (business and professional services), and Other Services (creative, wellness, and lifestyle professionals).",
  },
  {
    question: "How do I get a quote from a professional?",
    answer:
      "Search for the service you need, choose a contractor, and send your project details to receive personalized quotes — usually within hours, not days.",
  },
  {
    question: "Can I join ValorHub as a veteran-owned business?",
    answer:
      "Yes. If you own a veteran-owned business, you can join ValorHub as a Pro to access qualified leads, manage quotes, and build your reputation with verified reviews.",
  },
]);
