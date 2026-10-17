import { whyChooseUs } from "../data/why-choose-us";

export default function WhyChooseUsGrid() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {whyChooseUs.commitments.map((commitment) => (
        <div
          key={commitment.id}
          className="bg-secondary/50 rounded-[10px] border p-4"
        >
          <div className="bg-secondary grid size-11 place-content-center space-y-1.5 rounded-xl">
            <img
              src={commitment.icon}
              alt={commitment.title}
              className="size-5 object-contain"
            />
          </div>
          <h3 className="font-mono text-lg leading-6.5 font-semibold text-black">
            {commitment.title}
          </h3>
          <p className="text-sm leading-[22.75px] text-black/60">
            {commitment.description}
          </p>
        </div>
      ))}
    </div>
  );
}
