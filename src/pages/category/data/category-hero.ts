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
    action: "/marketplace",
    service: {
      name: "q",
      placeholder: "What service are you looking for?",
    },
    zip: {
      name: "zip",
      placeholder: "ZIP Code",
    },
    cta: "Search",
    popularLabel: "Popular:",
    popular: [
      "Marketing",
      "Plumbing",
      "IT Support",
      "Electrician",
      "Home Cleaning",
      "Roofing",
      "Accounting",
      "Attorney",
      "Doctor",
      "UX/UI Design",
    ],
  },
};
