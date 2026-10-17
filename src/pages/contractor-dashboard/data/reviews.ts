export type ContractorReview = {
  id: string;
  name: string;
  project: string;
  date: string;
  rating: number;
  text: string;
  reply?: string;
};

export const reviewSummary = { average: 4.9, total: 87 };

export const contractorReviews: ContractorReview[] = [
  {
    id: "1",
    name: "Emily Patel",
    project: "Master Bathroom Remodel",
    date: "Jul 28, 2026",
    rating: 5,
    text: "Marcus and his crew were exceptional. Clean, professional, on-time. Highly recommend Iron Ridge.",
  },
  {
    id: "2",
    name: "Carlos Benitez",
    project: "Backyard Deck Build",
    date: "Jul 22, 2026",
    rating: 5,
    text: "Outstanding craftsmanship on our deck build. Will absolutely hire again.",
    reply: "Thank you Carlos, it was a pleasure working with you!",
  },
  {
    id: "3",
    name: "Robert Henderson",
    project: "Kitchen Remodel",
    date: "Jul 10, 2026",
    rating: 5,
    text: "Great communication throughout the project. A few delays but the quality made up for it.",
  },
  {
    id: "4",
    name: "Tanya Williams",
    project: "Deck Installation",
    date: "Jun 28, 2026",
    rating: 5,
    text: "Solid work, fair price. Would recommend for outdoor projects.",
    reply: "Thanks Tanya, appreciate the trust!",
  },
];
