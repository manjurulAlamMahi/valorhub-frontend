import { contractorList } from "../data/contractor-list";

export default function ContractorListStats() {
  return (
    <ul className="flex flex-wrap gap-4">
      {contractorList.stats.map((stat) => (
        <li
          key={stat.label}
          className="min-w-18 rounded-2xl border border-white/15 bg-white/10 px-4.25 py-3.25 text-center"
        >
          <p className="font-mono text-xl leading-7 font-extrabold text-white">
            {stat.value}
          </p>
          <p className="pt-0.5 text-[10px] leading-3.75 tracking-[0.25px] text-white/60 uppercase">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
