import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { CustomerDashboard } from "@/services/customer";
import { Link } from "react-router";
import QueryBoundary from "@/components/shared/query-boundary";
import RequestRow from "./_components/request-row";

export default function DashboardOverview() {
  const { user } = useAuth();
  const query = useApi<CustomerDashboard>("/customer/dashboard");
  const firstName = user?.name.split(" ")[0] ?? "";

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

      <QueryBoundary query={query}>
        {({ metrics, recent_requests }) => {
          const cards = [
            {
              label: "Active Requests",
              value: metrics.active_requests,
              className: "text-secondary-foreground",
            },
            {
              label: "Pending Quotes",
              value: metrics.pending_quotes,
              className: "text-[#c92032]",
            },
            {
              label: "Completed Jobs",
              value: metrics.completed_jobs,
              className: "text-[#16a34a]",
            },
            {
              label: "Total Spent",
              value: metrics.total_spent_display,
              className: "text-[#1e293b]",
            },
          ];

          return (
            <>
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
                  <h2 className="text-lg font-bold text-[#1e293b]">
                    Recent requests
                  </h2>
                  <Link
                    to="/dashboard/requests"
                    className="text-sm font-medium text-[#c92032] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {recent_requests.length > 0 ? (
                  <ul className="space-y-4">
                    {recent_requests.slice(0, 3).map((request) => (
                      <RequestRow key={request.id} request={request} />
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-[#e6eaf2] p-10 text-center text-sm text-[#64748b]">
                    No requests yet.{" "}
                    <Link
                      to="/request-quote"
                      className="font-medium text-[#c92032] hover:underline"
                    >
                      Request a quote
                    </Link>
                  </p>
                )}
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </section>
  );
}
