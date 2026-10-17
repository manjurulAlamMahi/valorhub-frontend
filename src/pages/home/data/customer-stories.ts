import { faker } from "@faker-js/faker";

export const customerStories = {
  badge: "Customer Stories",
  headlines: [
    {
      headline: "What Our",
    },
    {
      headline: "Customers Say",
      type: "primary",
    },
  ],
  stories: [
    {
      id: faker.string.uuid(),
      ratings: 5,
      reviews:
        "ValorHub connected me with an incredible veteran-owned plumbing company. The work was done in a single day, on budget, and the quality was exceptional. I will never use another service.",
      author: {
        name: "Jennifer Walsh",
        avatar: faker.image.avatar(),
        address: "Austin, TX",
        service: "Plumbing Repair",
      },
    },
    {
      id: faker.string.uuid(),
      ratings: 5,
      reviews:
        "As a property manager overseeing 40+ units, ValorHub has become essential. I have a curated list of verified contractors for every trade. The Elite members especially deliver consistent results.",
      author: {
        name: "Robert Kim",
        avatar: faker.image.avatar(),
        address: "Denver, CO",
        service: "Property Management",
      },
    },
    {
      id: faker.string.uuid(),
      ratings: 5,
      reviews:
        "I appreciate that the platform highlights veteran-owned and first responder businesses. The quote process is seamless and the dashboard makes tracking everything so easy.",
      author: {
        name: "Angela Foster",
        avatar: faker.image.avatar(),
        address: "Chicago, IL",
        service: "Home Renovation",
      },
    },
  ],
};
