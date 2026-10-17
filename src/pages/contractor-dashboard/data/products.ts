import type { Listing } from "./listings";

export const productCategories = [
  "Tools",
  "Parts",
  "Safety Gear",
  "Materials",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export type ContractorProduct = Listing & { category: ProductCategory };

export const products: ContractorProduct[] = [
  {
    id: "1",
    name: "Cordless Drill Kit",
    category: "Tools",
    description:
      "18V cordless drill with 2 batteries, charger, and carrying case.",
    price: "$129.99",
    active: true,
  },
  {
    id: "2",
    name: "Copper Pipe Fittings Set",
    category: "Parts",
    description: 'Assorted 1/2" and 3/4" copper fittings for plumbing repairs.',
    price: "$45.00",
    active: true,
  },
  {
    id: "3",
    name: "Composite Decking Boards",
    category: "Materials",
    description:
      "Weather-resistant composite decking, 12ft boards, walnut finish.",
    price: "$68/board",
    active: true,
  },
  {
    id: "4",
    name: "Safety Harness Kit",
    category: "Safety Gear",
    description:
      "Full-body fall-protection harness with lanyard, OSHA compliant.",
    price: "$89.99",
    active: true,
  },
  {
    id: "5",
    name: "Roofing Nail Gun",
    category: "Tools",
    description:
      "Pneumatic coil roofing nailer, 15-degree angle, includes case.",
    price: "$249.00",
    active: false,
  },
  {
    id: "6",
    name: "HVAC Refrigerant Gauges",
    category: "Parts",
    description: "Digital manifold gauge set for R410A/R22 systems.",
    price: "$175.00",
    active: true,
  },
];
