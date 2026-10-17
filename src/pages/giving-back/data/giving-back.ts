import { faker } from "@faker-js/faker";
import { BriefcaseBusiness, Heart, House } from "lucide-react";

export const givingBack = {
  hero: {
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Giving Back", href: "/giving-back" },
    ],
    tag: "Our Mission",
    highlight: "Giving back",
    headline: "to those who served",
    description:
      "For every job completed on ValorHub, a portion of our platform fee goes toward supporting veteran and first-responder causes across America.",
  },
  stats: [
    { id: faker.string.uuid(), value: "$1.2M+", label: "Donated since 2023" },
    { id: faker.string.uuid(), value: "8,500+", label: "Veterans supported" },
    { id: faker.string.uuid(), value: "120+", label: "Partner organizations" },
    { id: faker.string.uuid(), value: "32", label: "States reached" },
  ],
  initiatives: {
    title: "Our initiatives",
    items: [
      {
        id: faker.string.uuid(),
        icon: House,
        title: "Home Repair Grants",
        description:
          "Free home repair services for disabled veterans through our contractor network.",
      },
      {
        id: faker.string.uuid(),
        icon: Heart,
        title: "Emergency Housing Fund",
        description:
          "Rapid financial support for veterans and first responders facing housing emergencies.",
      },
      {
        id: faker.string.uuid(),
        icon: BriefcaseBusiness,
        title: "Job Placement Program",
        description:
          "Connecting transitioning service members with contractor apprenticeship opportunities.",
      },
    ],
  },
  story: {
    quote:
      "ValorHub connected me with a contractor who rebuilt my wheelchair ramp at no cost. This platform genuinely gives back to veterans.",
    author: "James Whitfield, U.S. Army Veteran",
  },
  cta: {
    title: "Want to nominate a veteran in need?",
    description:
      "Tell us about a veteran or first responder who could benefit from our home repair grant program.",
  },
};
