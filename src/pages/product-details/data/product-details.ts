import { faker } from "@faker-js/faker";

const images = "/images/contractor-profile";

// Mock detail content until the marketplace API is wired up
export const productDetails = {
  gallery: [
    `${images}/gallery/1.jpg`,
    `${images}/gallery/2.jpg`,
    `${images}/gallery/3.jpg`,
    `${images}/gallery/5.jpg`,
    `${images}/videos/1.jpg`,
  ],
  rating: 4.9,
  reviewCount: 127,
  eliteBadge: "Elite Seller",
  cta: "Visit Business Website",
  redirectNote:
    "You will be redirected to the seller's own website to complete your purchase.",
  description: {
    title: "Description",
    text: 'Solid copper pipe repair kit with push-to-connect fittings, compression couplings, and repair clamps. No soldering required — ideal for quick emergency fixes on 1/2" and 3/4" copper lines.',
  },
  specifications: {
    title: "Specifications",
    warranty: "1 year manufacturer warranty",
    inStock: "In stock · ships in 2 days",
    outOfStock: "Out of stock",
    shipping: "Ships nationwide · 2-3 business days",
  },
  related: {
    title: "Related products",
  },
  reviews: {
    title: "Product reviews",
    items: [
      {
        id: faker.string.uuid(),
        author: "Sarah Johnson",
        rating: 5,
        text: "Fast, professional, and reasonably priced. Highly recommend.",
      },
      {
        id: faker.string.uuid(),
        author: "Michael Chen",
        rating: 5,
        text: "Installed our new water heater perfectly. Very clean work.",
      },
      {
        id: faker.string.uuid(),
        author: "Emily Rodriguez",
        rating: 5,
        text: "Reliable and on time. Would use again.",
      },
    ],
  },
};
