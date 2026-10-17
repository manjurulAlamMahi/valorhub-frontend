import { CirclePlay } from "lucide-react";
import { contractorProfile } from "../data/contractor-profile";
import ProfileSection from "./profile-section";

const { videos } = contractorProfile;

export default function ProfileVideos() {
  return (
    <ProfileSection
      title={
        <>
          {videos.title}{" "}
          <span className="text-sm font-normal text-[#0a0a0a]/40">
            {videos.note}
          </span>
        </>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {videos.items.map((video, index) => (
          <li key={video.id}>
            {/* Not clickable until the API provides real video URLs */}
            <div
              role="img"
              aria-label={`Video ${index + 1}`}
              className="relative grid h-49.75 place-content-center overflow-hidden rounded-2xl"
            >
              <img
                src={video.thumbnail}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <span className="absolute inset-0 bg-black/40" />
              <CirclePlay
                aria-hidden
                strokeWidth={1.5}
                className="relative size-10 text-white"
              />
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
