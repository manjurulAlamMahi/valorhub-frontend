import { BriefcaseBusiness, Heart, House, type LucideIcon } from "lucide-react";

// Content comes from GET /giving-back; this maps the API's icon keys to icons
export const initiativeIcons: Record<string, LucideIcon> = {
  "home-heart": House,
  "shield-heart": Heart,
  "briefcase-award": BriefcaseBusiness,
};

export const givingBack = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Giving Back", href: "/giving-back" },
  ],
  initiativesTitle: "Our initiatives",
  nominatePath: "/giving-back/nominate",
};
