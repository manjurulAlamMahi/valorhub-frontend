const gallery = "/images/contractor-profile/gallery";

export type Product = {
  id: string;
  name: string;
  seller: string;
  price: number;
  category: string;
  image: string;
  elite: boolean;
  verified: boolean;
  veteran: boolean;
  inStock: boolean;
  website: string;
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

// Mock catalog until the marketplace API is wired up
export const products: Product[] = [
  {
    id: "copper-pipe-repair-kit",
    name: "Copper Pipe Repair Kit (10-pc)",
    seller: "Steel Plumbing Co.",
    price: 34.99,
    category: "plumbing",
    image: `${gallery}/1.jpg`,
    elite: true,
    verified: true,
    veteran: true,
    inStock: true,
    website: "https://steelplumbingco.com/products/pipe-repair-installation",
  },
  {
    id: "electrical-wire-spool",
    name: "12-Gauge Electrical Wire Spool (250ft)",
    seller: "Ironclad Electric",
    price: 89.99,
    category: "electrical",
    image: `${gallery}/2.jpg`,
    elite: true,
    verified: true,
    veteran: false,
    inStock: true,
    website: "https://ironcladelectric.com",
  },
  {
    id: "emergency-plumbing-repair-kit",
    name: "Emergency Plumbing Repair Kit",
    seller: "Steel Plumbing Co.",
    price: 59.99,
    category: "plumbing",
    image: `${gallery}/3.jpg`,
    elite: true,
    verified: true,
    veteran: true,
    inStock: false,
    website: "https://steelplumbingco.com/emergency",
  },
  {
    id: "smart-circuit-breaker-panel",
    name: "Smart Circuit Breaker Panel (200A)",
    seller: "Ironclad Electric",
    price: 249.99,
    category: "electrical",
    image: `${gallery}/5.jpg`,
    elite: true,
    verified: false,
    veteran: true,
    inStock: true,
    website: "https://ironcladelectric.com/panel-upgrade",
  },
  {
    id: "hvac-duct-cleaning-kit",
    name: "HVAC Duct Cleaning Brush Kit",
    seller: "Sentinel HVAC",
    price: 44.99,
    category: "hvac",
    image: `${gallery}/1.jpg`,
    elite: false,
    verified: true,
    veteran: false,
    inStock: true,
    website: "https://sentinelhvac.com/products/duct-cleaning-kit",
  },
  {
    id: "ac-filter-maintenance-bundle",
    name: "AC Filter & Maintenance Bundle",
    seller: "Sentinel HVAC",
    price: 39.99,
    category: "hvac",
    image: `${gallery}/2.jpg`,
    elite: false,
    verified: true,
    veteran: true,
    inStock: true,
    website: "https://sentinelhvac.com/products/filter-maintenance-bundle",
  },
];

export const trendingProducts = products.slice(0, 4);
