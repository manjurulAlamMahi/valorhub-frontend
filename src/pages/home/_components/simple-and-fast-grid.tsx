import { simpleAndFast } from "../data/simple-and-fast";

export default function SimpleAndFastGrid() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {simpleAndFast.approaches.map((approach, index) => (
        <div key={approach.id} className="rounded-[16px] border bg-white p-6">
          <div className="flex items-center justify-between">
            <div
              className="grid size-12 place-content-center rounded-2xl"
              style={{ backgroundColor: approach.color }}
            >
              <img
                src={approach.icon}
                alt={approach.title}
                className="size-5.5 object-contain"
              />
            </div>

            <h1
              className="font-mono text-6xl leading-15 font-extrabold"
              style={{ color: approach.color }}
            >
              0{index + 1}
            </h1>
          </div>
          <h3 className="mt-4 mb-2 font-mono text-lg leading-7 font-bold">
            {approach.title}
          </h3>
          <p className="text-sm leading-[22.75px] text-black/60">
            {approach.description}
          </p>
        </div>
      ))}
    </div>
  );
}
