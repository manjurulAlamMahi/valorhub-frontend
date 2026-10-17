import { faker } from "@faker-js/faker";

export const navigationMenu = [
  {
    id: faker.string.uuid(),
    label: "Home",
    href: "/",
  },
  {
    id: faker.string.uuid(),
    label: "Category",
    href: "/category",
  },
  {
    id: faker.string.uuid(),
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    id: faker.string.uuid(),
    label: "Giving Back",
    href: "/giving-back",
  },
  {
    id: faker.string.uuid(),
    label: "FAQ",
    href: "/faq",
  },
  {
    id: faker.string.uuid(),
    label: "Contact",
    href: "/contact",
  },
];
