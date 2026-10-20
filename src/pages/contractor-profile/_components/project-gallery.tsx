import { mediaUrl } from "@/lib/media";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

export default function ProjectGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <ProfileSection title={contractorProfile.gallery.title}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <li key={image}>
            <img
              src={mediaUrl(image) ?? undefined}
              alt={`Project ${index + 1}`}
              loading="lazy"
              className="h-37 w-full rounded-2xl bg-[#d9d9d9] object-cover"
            />
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
