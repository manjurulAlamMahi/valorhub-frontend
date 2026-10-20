export const categoryHero = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
  ],
  headlines: [
    { headline: "Explore Professional" },
    { headline: "Services", type: "primary" },
  ],
  description:
    "Browse hundreds of verified services provided by trusted professionals across the United States.",
  search: {
    action: "/contractors",
    service: {
      name: "service",
      placeholder: "What service are you looking for?",
    },
    zip: {
      name: "zip_code",
      placeholder: "ZIP Code",
    },
    cta: "Search",
    popularLabel: "Popular:",
  },
};
