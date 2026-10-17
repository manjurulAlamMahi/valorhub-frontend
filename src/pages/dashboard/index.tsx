import { cn } from "@/lib/utils";
import { Link } from "react-router";
import RequestRow from "./_components/request-row";
import { formatMoneyShort, stats, user } from "./data/dashboard";
import { useDashboard } from "./data/dashboard-store";

export default function DashboardOverview() {
  const { state } = useDashboard();
  const firstName = state.settings.name.split(" ")[0] || user.firstName;

  const cards = [
    {
      label: "Active Requests",
      value: state.requests.filter((r) =>
        ["pending", "in_progress"].includes(r.status),
      ).length,
      className: "text-secondary-foreground",
    },
    {
      label: "Pending Quotes",
      value: Object.values(state.quoteStatus).filter((s) => s === "pending")
        .length,
      className: "text-[#c92032]",
    },
    {
      label: "Completed Jobs",
      value: stats.completedJobs,
      className: "text-[#16a34a]",
    },
    {
      label: "Total Spent",
      value: formatMoneyShort(stats.totalSpent),
      className: "text-[#1e293b]",
    },
  ];

  return (
    <section className="space-y-6 rounded-2xl bg-white p-4">
      <div className="space-y-2 leading-[normal]">
        <h1 className="text-[26px] font-bold text-[#1e293b]">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-[#64748b]">
          Here is what is happening with your service requests.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 leading-[normal] lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col-reverse gap-1.5 rounded-xl border border-[#e6eaf2] p-5"
          >
            <dt className="text-[13px] text-[#64748b]">{card.label}</dt>
            <dd className={cn("text-2xl font-bold", card.className)}>
              {card.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-4">
        <div className="flex items-center justify-between leading-[normal]">
          <h2 className="text-lg font-bold text-[#1e293b]">Recent requests</h2>
          <Link
            to="/dashboard/requests"
            className="text-sm font-medium text-[#c92032] hover:underline"
          >
            View all
          </Link>
        </div>
        <ul className="space-y-4">
          {state.requests.slice(0, 3).map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </ul>
      </div>
    </section>
  );
}
