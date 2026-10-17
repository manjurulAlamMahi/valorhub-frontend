import { Construction } from "lucide-react";
import { Link } from "react-router";

// Placeholder for dashboard sections that aren't designed yet
export default function ComingSoon() {
  return (
    <div className="mx-auto max-w-320 p-4 sm:p-6">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-[#efefef] bg-white px-6 py-20 text-center">
        <span className="grid size-12 place-content-center rounded-full bg-[#eeedf8]">
          <Construction aria-hidden className="size-6 text-[#262262]" />
        </span>
        <h1 className="text-lg font-semibold text-[#0f172a]">Coming soon</h1>
        <p className="max-w-sm text-sm text-[#64748b]">
          This section of your dashboard is on its way.
        </p>
        <Link
          to="/contractor/dashboard"
          className="mt-2 rounded-lg bg-[#262262] px-4 py-2 text-sm font-semibold text-white hover:bg-[#211d53]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
