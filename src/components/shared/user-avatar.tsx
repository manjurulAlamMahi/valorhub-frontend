import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  src?: string | null;
  className?: string;
};

// Falls back to initials when the user hasn't uploaded a photo
export default function UserAvatar({ name, src, className }: UserAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <span
      aria-hidden
      className={cn(
        "bg-secondary-foreground grid shrink-0 place-content-center rounded-full text-xs font-semibold text-white",
        className,
      )}
    >
      {initials}
    </span>
  );
}
