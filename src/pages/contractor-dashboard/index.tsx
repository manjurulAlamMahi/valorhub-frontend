import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Clock,
  ClipboardCheck,
  FileText,
  Shield,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";
import Panel from "./_components/panel";
import StatusPill from "./_components/status-pill";
import TierBadge from "./_components/tier-badge";
import {
  contractor,
  messages,
  projects,
  projectStatuses,
  quickActions,
  quoteRequests,
  quoteStatuses,
  reviews,
  starIcon,
  stats,
  type StatTone,
} from "./data/contractor-dashboard";

const BASE = "/contractor/dashboard";

const toneStyles: Record<
  StatTone,
  { box: string; note: string; icon?: LucideIcon }
> = {
  blue: {
    box: "bg-[#eff6ff] text-[#3b82f6]",
    note: "text-[#3b82f6]",
    icon: FileText,
  },
  green: {
    box: "bg-[#ecfdf5] text-[#10b981]",
    note: "text-[#10b981]",
    icon: ClipboardCheck,
  },
  amber: {
    box: "bg-[#fffbeb] text-[#f59e0b]",
    note: "text-[#f59e0b]",
    icon: Wallet,
  },
  violet: {
    box: "bg-[#f5f3ff] text-[#8b5cf6]",
    note: "text-[#8b5cf6]",
    icon: TrendingUp,
  },
  rating: { box: "bg-[#fffbeb]", note: "text-[#f59e0b]" },
  pink: {
    box: "bg-[#fdf2f8] text-[#ec4899]",
    note: "text-[#ec4899]",
    icon: Clock,
  },
};

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 18
      ? "Good afternoon"
      : "Good evening";
};

const rowBorder = "border-b border-[#0f172a]/10 last:border-b-0";

export default function ContractorDashboard() {
  return (
    <>
      <SEO
        title="Contractor Dashboard"
        description="Manage your quote requests, projects, invoices and reviews on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="mx-auto max-w-320 space-y-6 p-4 sm:p-6">
        <section className="flex flex-col gap-5 rounded-2xl bg-[#262262] p-5 sm:p-7 xl:flex-row xl:items-center">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl leading-7 font-bold text-white">
                {greeting()}, {contractor.firstName}!
              </h1>
              <TierBadge label={`${contractor.tier} Member`} />
              <span className="text-secondary-foreground inline-flex h-5.5 items-center gap-1 rounded-full border border-[#e9d4ff] bg-[#eeedf8] px-2.25 text-xs leading-4 font-semibold">
                <Shield aria-hidden className="size-2.5" strokeWidth={2.5} />
                Veteran Owned
              </span>
              <span className="inline-flex h-5.5 items-center gap-1 rounded-full border border-[#bedbff] bg-[#eff6ff] px-2.25 text-xs leading-4 font-semibold text-[#1447e6]">
                <BadgeCheck
                  aria-hidden
                  className="size-2.5"
                  strokeWidth={2.5}
                />
                ID.me Verified
              </span>
            </div>
            <p className="text-sm leading-5 text-white/60">
              {contractor.business} · {contractor.location} · Member since{" "}
              {contractor.memberSince}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="rounded-lg bg-white/12 px-4 py-2 text-sm leading-5 font-semibold text-white transition-colors hover:bg-white/20"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
          {stats.map((stat) => {
            const tone = toneStyles[stat.tone];
            const Icon = tone.icon;
            return (
              <li key={stat.label}>
                <Link
                  to={stat.href}
                  className="block h-full rounded-xl border border-[#efefef] bg-white p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
                >
                  <span
                    className={cn(
                      "grid size-9 place-content-center rounded-lg",
                      tone.box,
                    )}
                  >
                    {Icon ? (
                      <Icon aria-hidden className="size-4.5" />
                    ) : (
                      <img
                        src={starIcon}
                        alt=""
                        className="size-4.5 object-cover"
                      />
                    )}
                  </span>
                  <p className="pt-3 text-2xl leading-8 font-bold text-[#0f172a]">
                    {stat.value}
                  </p>
                  <p className="pt-0.5 text-xs leading-4 font-medium text-[#64748b]">
                    {stat.label}
                  </p>
                  <p className={cn("pt-1 text-xs leading-4", tone.note)}>
                    {stat.note}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="grid gap-6 xl:grid-cols-3">
          <Panel
            title="Active Projects"
            href={`${BASE}/projects`}
            className="xl:col-span-2"
          >
            <ul>
              {projects.map((project) => (
                <li
                  key={project.id}
                  className={cn("space-y-2 px-5 py-4", rowBorder)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                        {project.title}
                      </p>
                      <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                        {project.client} · Due {project.due}
                      </p>
                    </div>
                    <StatusPill {...projectStatuses[project.status]} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      role="progressbar"
                      aria-label={`${project.title} progress`}
                      aria-valuenow={project.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]"
                    >
                      <div
                        className="h-full rounded-full bg-[#211d53]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs leading-4 font-medium text-[#64748b]">
                      {project.progress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recent Messages" href={`${BASE}/messages`}>
            <ul>
              {messages.map((message) => (
                <li key={message.id} className={rowBorder}>
                  <Link
                    to={`${BASE}/messages`}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#f8fafc]"
                  >
                    <img
                      src={message.avatar}
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                          {message.name}
                        </p>
                        <p className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                          {message.time}
                        </p>
                      </div>
                      <p className="truncate pt-0.5 text-xs leading-4 text-[#64748b]">
                        {message.text}
                      </p>
                    </div>
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", {
                        "bg-[#c41e3a]": message.unread,
                      })}
                    >
                      {message.unread && (
                        <span className="sr-only">Unread</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Panel title="Recent Quote Requests" href={`${BASE}/quotes`}>
            <ul>
              {quoteRequests.slice(0, 3).map((quote) => (
                <li
                  key={quote.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5",
                    rowBorder,
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                        {quote.name}
                      </p>
                      <StatusPill {...quoteStatuses[quote.status]} />
                    </div>
                    <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                      {quote.service} · {quote.location}
                    </p>
                    <p className="pt-0.5 text-xs leading-4 text-[#94a3b8]">
                      {quote.budget} · {quote.date}
                    </p>
                  </div>
                  <Link
                    to={`${BASE}/quotes`}
                    className="rounded-lg px-3 py-1.5 text-xs leading-4 font-medium text-[#1b3a6b] hover:bg-[#f1f5f9]"
                  >
                    View
                    <span className="sr-only"> quote from {quote.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recent Reviews" href={`${BASE}/reviews`}>
            <ul className="space-y-3 p-4">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-lg bg-[#f6f6f6] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.avatar}
                        alt=""
                        className="size-7 rounded-full bg-[#1b3a6b] object-cover"
                      />
                      <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                        {review.name}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                      {review.date}
                    </p>
                  </div>
                  <div
                    role="img"
                    aria-label={`Rated ${review.rating} out of 5`}
                    className="flex gap-0.5 pt-1.5"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <img
                        key={index}
                        src={starIcon}
                        alt=""
                        className={cn("size-4.5 object-cover", {
                          "opacity-20 grayscale": index >= review.rating,
                        })}
                      />
                    ))}
                  </div>
                  <p className="pt-1.5 text-xs leading-[19.5px] text-[#475569]">
                    {review.text}
                  </p>
                  <p className="pt-1 text-xs leading-4 font-medium text-[#94a3b8]">
                    {review.project}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
