import { faker } from "@faker-js/faker";

export const achievements = [
  {
    id: faker.string.uuid(),
    label: "Verified Professionals",
    value: "50,000+",
    icon: "/images/home/achievements/verified-professionals.png",
  },
  {
    id: faker.string.uuid(),
    label: "Jobs Completed",
    value: "1.2M+",
    icon: "/images/home/achievements/jobs-completed.png",
  },
  {
    id: faker.string.uuid(),
    label: "Cities Served",
    value: "850+",
    icon: "/images/home/achievements/cities-served.png",
  },
  {
    id: faker.string.uuid(),
    label: "Customer Satisfaction",
    value: "98.7%",
    icon: "/images/home/achievements/customer-satisfaction.png",
  },
];
