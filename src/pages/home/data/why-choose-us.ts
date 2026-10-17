import { faker } from "@faker-js/faker";

export const whyChooseUs = {
  badge: "Why Choose Us",
  headlines: [
    {
      headline: "Built on",
    },
    {
      headline: "Trust & Service",
      type: "primary",
    },
  ],

  commitments: [
    {
      id: faker.string.uuid(),
      title: "Veteran Verified",
      description:
        "All veteran-owned businesses are authenticated through ID.me verification.",
      icon: "/images/home/why-choose-us/veteran-verified.png",
    },
    {
      id: faker.string.uuid(),
      title: "ID.me Verification",
      description:
        "Industry-leading identity verification ensures trust and authenticity on our platform.",
      icon: "/images/home/why-choose-us/id-me-verification.png",
    },
    {
      id: faker.string.uuid(),
      title: "Trusted Reviews",
      description:
        "Real reviews from verified customers you can actually trust and rely on.",
      icon: "/images/home/why-choose-us/trusted-reviews.png",
    },
    {
      id: faker.string.uuid(),
      title: "Secure Communication",
      description:
        "End-to-end encrypted messaging between customers and professionals.",
      icon: "/images/home/why-choose-us/secure-communication.png",
    },
    {
      id: faker.string.uuid(),
      title: "Fast Quotes",
      description:
        "Receive multiple competitive quotes within hours, not days or weeks.",
      icon: "/images/home/why-choose-us/fast-quotes.png",
    },
    {
      id: faker.string.uuid(),
      title: "Community Driven",
      description:
        "Built by veterans, for everyone. We give back to military and first responder communities.",
      icon: "/images/home/why-choose-us/community-driven.png",
    },
  ],
};
