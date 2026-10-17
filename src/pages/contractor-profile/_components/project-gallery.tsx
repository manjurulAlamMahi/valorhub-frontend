import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { gallery } = contractorProfile;

export default function ProjectGallery() {
  return (
    <ProfileSection title={gallery.title}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.images.map((image, index) => (
          <li key={index}>
            <img
              src={image}
              alt={`Project ${index + 1}`}
              className="h-37 w-full rounded-2xl bg-[#d9d9d9] object-cover"
            />
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
