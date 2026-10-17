import { contractorProfile } from "../data/contractor-profile";

export default function ProfileCover() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-80 overflow-hidden rounded-[20px] bg-[#d9d9d9]"
    >
      <img
        src={contractorProfile.cover}
        alt=""
        className="size-full object-cover object-[50%_91%]"
      />
    </div>
  );
}
