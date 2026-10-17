import { faker } from "@faker-js/faker";

export const simpleAndFast = {
  badge: "Simple & Fast",
  headlines: [
    {
      headline: "How",
    },
    {
      headline: "ValorHub",
      type: "primary",
    },
    {
      headline: "Works",
    },
  ],
  description:
    "Finding trusted professionals has never been easier. Three simple steps to get started.",

  approaches: [
    {
      id: faker.string.uuid(),
      title: "Search a Service",
      description:
        "Search by category, keyword, or ZIP code to discover trusted professionals near you.",
      icon: "/images/home/simple-and-fast/search-a-service.png",
      color: "#F0EFF4",
    },
    {
      id: faker.string.uuid(),
      title: "Request a Quote",
      description:
        "Choose a contractor and send your project details to receive personalized quotes.",
      icon: "/images/home/simple-and-fast/request-a-quote.png",
      color: "#FAEFF0",
    },
    {
      id: faker.string.uuid(),
      title: "Compare & Hire",
      description:
        "Review quotes, compare contractors, and hire the one that best fits your needs.",
      icon: "/images/home/simple-and-fast/compare-and-hire.png",
      color: "#DEEAE0",
    },
    {
      id: faker.string.uuid(),
      title: "Pay Securely & Review",
      description:
        "Receive your invoice, pay securely through ValorHub, and leave a review after the project is complete.",
      icon: "/images/home/simple-and-fast/pay-securely-and-review.png",
      color: "#FFF5DB",
    },
  ],
};
