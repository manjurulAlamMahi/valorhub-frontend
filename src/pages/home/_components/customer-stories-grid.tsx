import { customerStories } from "../data/customer-stories";

export default function CustomerStoriesGrid() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {customerStories.stories.map((story) => (
        <div key={story.id} className="rounded-[18px] border p-6">
          <h1 className="font-mono text-5xl leading-12 font-extrabold text-black/30">
            “
          </h1>
          {Array.from({ length: story.ratings }).map((_, index) => (
            <img
              src="/svgs/star-fill.svg"
              alt="Star"
              key={index}
              className="mb-4 inline-block aspect-square size-[14.333px] object-contain not-last:mr-0.5"
            />
          ))}
          <p className="text-base leading-6 text-black/60">{story.reviews}</p>

          <div className="mt-6 flex items-center gap-3 pt-6">
            <img
              src={story.author.avatar}
              alt={story.author.name}
              className="size-10 rounded-full object-cover"
            />

            <div>
              <h2 className="font-mono text-base font-bold text-black">
                {story.author.name}
              </h2>
              <p className="text-xs leading-4 text-black/40">
                <span>{story.author.address}</span>
                <span> · </span>
                <span>{story.author.service}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
