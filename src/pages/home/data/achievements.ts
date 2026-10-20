import type { PlatformMetrics } from "@/services/public";

export const achievements: {
  key: keyof PlatformMetrics;
  label: string;
  icon: string;
}[] = [
  {
    key: "verified_pros_display",
    label: "Verified Professionals",
    icon: "/images/home/achievements/verified-professionals.png",
  },
  {
    key: "jobs_completed_display",
    label: "Jobs Completed",
    icon: "/images/home/achievements/jobs-completed.png",
  },
  {
    key: "cities_served_display",
    label: "Cities Served",
    icon: "/images/home/achievements/cities-served.png",
  },
  {
    key: "customer_satisfaction_rate",
    label: "Customer Satisfaction",
    icon: "/images/home/achievements/customer-satisfaction.png",
  },
];
