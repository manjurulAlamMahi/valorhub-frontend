const IMAGES = "/images/contractor-dashboard/gallery";

export const galleryCategories = [
  "Before / After",
  "Project Photos",
  "Team",
  "Equipment",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryPhoto = {
  id: string;
  src: string;
  caption: string;
  category: GalleryCategory;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "1",
    src: `${IMAGES}/plumbing.jpg`,
    caption: "Site visit - kickoff",
    category: "Project Photos",
  },
  {
    id: "2",
    src: `${IMAGES}/drilling.jpg`,
    caption: "Kitchen demo day 1",
    category: "Before / After",
  },
  {
    id: "3",
    src: `${IMAGES}/sink.jpg`,
    caption: "Cabinet install",
    category: "Project Photos",
  },
  {
    id: "4",
    src: `${IMAGES}/team.png`,
    caption: "Countertop template",
    category: "Team",
  },
  {
    id: "5",
    src: `${IMAGES}/plumbing.jpg`,
    caption: "Finished kitchen",
    category: "Before / After",
  },
  {
    id: "6",
    src: `${IMAGES}/drilling.jpg`,
    caption: "Deck framing",
    category: "Equipment",
  },
  {
    id: "7",
    src: `${IMAGES}/sink.jpg`,
    caption: "Deck staining",
    category: "Equipment",
  },
  {
    id: "8",
    src: `${IMAGES}/team.png`,
    caption: "Team on site",
    category: "Team",
  },
];
