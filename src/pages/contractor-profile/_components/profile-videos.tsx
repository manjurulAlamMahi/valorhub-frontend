import { CirclePlay } from "lucide-react";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { videos: copy } = contractorProfile;

export default function ProfileVideos({ videos }: { videos: string[] }) {
  if (videos.length === 0) return null;

  return (
    <ProfileSection
      title={
        <>
          {copy.title}{" "}
          <span className="text-sm font-normal text-[#0a0a0a]/40">
            {copy.note}
          </span>
        </>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {videos.map((url, index) => (
          <li key={url}>
            {/* The API only stores links (YouTube, Vimeo…), so open them in a new tab */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch video ${index + 1}`}
              className="bg-secondary-foreground relative grid h-49.75 place-content-center overflow-hidden rounded-2xl transition-opacity hover:opacity-90"
            >
              <CirclePlay
                aria-hidden
                strokeWidth={1.5}
                className="relative size-10 text-white"
              />
            </a>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
