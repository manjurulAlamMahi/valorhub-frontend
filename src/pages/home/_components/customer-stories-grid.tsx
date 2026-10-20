import UserAvatar from "@/components/shared/user-avatar";
import type { Testimonial } from "@/services/public";

export default function CustomerStoriesGrid({
  testimonials,
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials
        ? testimonials.map((story) => (
            <div key={story.id} className="rounded-[18px] border p-6">
              <h1 className="font-mono text-5xl leading-12 font-extrabold text-black/30">
                “
              </h1>
              <div
                role="img"
                aria-label={`Rated ${story.rating} out of 5`}
                className="mb-4 flex gap-0.5"
              >
                {Array.from({ length: story.rating }).map((_, index) => (
                  <img
                    src="/svgs/star-fill.svg"
                    alt=""
                    key={index}
                    className="aspect-square size-[14.333px] object-contain"
                  />
                ))}
              </div>
              <p className="text-base leading-6 text-black/60">
                {story.comment}
              </p>

              <div className="mt-6 flex items-center gap-3 pt-6">
                <UserAvatar name={story.author_name} className="size-10" />

                <div>
                  <h2 className="font-mono text-base font-bold text-black">
                    {story.author_name}
                  </h2>
                  <p className="text-xs leading-4 text-black/40">
                    <span>{story.author_location}</span>
                    <span> · </span>
                    <span>{story.project_title}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        : Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              aria-hidden
              className="h-72 animate-pulse rounded-[18px] bg-[#f1f2f6]"
            />
          ))}
    </div>
  );
}
