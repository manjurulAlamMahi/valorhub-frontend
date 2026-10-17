import type { Listing } from "./listings";

export const serviceCategories = [
  "Remodeling",
  "Outdoor",
  "Roofing",
  "HVAC",
] as const;

export const services: Listing[] = [
  {
    id: "1",
    name: "Kitchen Remodeling",
    category: "Remodeling",
    description:
      "Full kitchen renovations including cabinets, countertops, tile, appliances, and plumbing.",
    price: "Custom Quote",
    active: true,
  },
  {
    id: "2",
    name: "Bathroom Renovation",
    category: "Remodeling",
    description:
      "Complete bathroom overhauls: tile, vanity, shower/tub, plumbing fixtures.",
    price: "Starting $4,500",
    active: true,
  },
  {
    id: "3",
    name: "Deck Installation",
    category: "Outdoor",
    description:
      "Custom pressure-treated or composite deck builds with stairs and railing systems.",
    price: "$35/sqft",
    active: true,
  },
  {
    id: "4",
    name: "Fence Installation",
    category: "Outdoor",
    description:
      "Cedar, vinyl, and chain-link fence installation. Residential and commercial.",
    price: "$18–28/linear ft",
    active: true,
  },
  {
    id: "5",
    name: "Roof Repair",
    category: "Roofing",
    description:
      "Storm damage repairs, shingle replacement, flashing, and gutters.",
    price: "Custom Quote",
    active: false,
  },
  {
    id: "6",
    name: "HVAC Services",
    category: "HVAC",
    description: "Installation, replacement, and maintenance of HVAC systems.",
    price: "$150/hr",
    active: true,
  },
];
