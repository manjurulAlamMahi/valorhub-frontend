import { SEO } from "@/components/seo/SEO";
import UserAvatar from "@/components/shared/user-avatar";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import {
  contractorApi,
  type ContractorOverview,
  type ReviewsData,
} from "@/services/contractor";
import type { ConversationSummary, Paged } from "@/services/customer";
import {
  BadgeCheck,
  CircleCheckBig,
  ClipboardCheck,
  FileText,
  Shield,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import QueryBoundary from "@/components/shared/query-boundary";
import Panel from "./_components/panel";
import StatusPill from "./_components/status-pill";
import TierBadge from "./_components/tier-badge";
import {
  leadStatuses,
  projectStatuses,
  quickActions,
  starIcon,
} from "./data/contractor-dashboard";

const BASE = "/contractor/dashboard";

type StatTone = "blue" | "green" | "amber" | "violet" | "rating" | "pink";

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
    icon: CircleCheckBig,
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
const emptyRow = "px-5 py-6 text-center text-sm text-[#64748b]";

export default function ContractorDashboard() {
  const query = useApi<ContractorOverview>("/contractor/dashboard");

  return (
    <>
      <SEO
        title="Contractor Dashboard"
        description="Manage your quote requests, projects, invoices and reviews on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="mx-auto max-w-320 space-y-6 p-4 sm:p-6">
        <QueryBoundary query={query}>
          {(data) => <Overview data={data} onChange={query.refetch} />}
        </QueryBoundary>
      </div>
    </>
  );
}

function AvailabilitySwitch({
  available,
  onChange,
}: {
  available: boolean;
  onChange: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    setSaving(true);
    setError("");
    try {
      await contractorApi.setAvailability(!available);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={available}
        aria-label="Available today"
        disabled={saving}
        onClick={() => void toggle()}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full bg-white/25 transition-colors disabled:opacity-60",
          { "bg-[#10b981]": available },
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform",
            { "translate-x-4": available },
          )}
        />
      </button>
      <span className="text-xs font-semibold text-white">
        {available ? "Available today" : "Not available today"}
      </span>
      {error && (
        <span role="alert" className="text-xs text-[#fca5a5]">
          {error}
        </span>
      )}
    </div>
  );
}

function Overview({
  data,
  onChange,
}: {
  data: ContractorOverview;
  onChange: () => void;
}) {
  const { user } = useAuth();
  const messages = useApi<Paged<ConversationSummary>>("/messages", {
    per_page: 3,
  });
  const reviews = useApi<ReviewsData>("/contractor/reviews", { per_page: 2 });
  const { contractor, metrics } = data;
  const firstName = contractor.owner_name.split(" ")[0];
  const memberSince = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : null;

  const stats: {
    value: string | number;
    label: string;
    note: string;
    tone: StatTone;
    href: string;
  }[] = [
    {
      value: metrics.active_leads_count,
      label: "New Quote Requests",
      note: "Awaiting your quote",
      tone: "blue",
      href: `${BASE}/quotes`,
    },
    {
      value: metrics.active_projects_count,
      label: "Active Projects",
      note: "In progress",
      tone: "green",
      href: `${BASE}/projects`,
    },
    {
      value: metrics.total_earnings_display,
      label: "Total Earnings",
      note: "From paid invoices",
      tone: "amber",
      href: `${BASE}/invoices`,
    },
    {
      value: metrics.monthly_earnings_display,
      label: "Monthly Revenue",
      note: "This month",
      tone: "violet",
      href: `${BASE}/invoices`,
    },
    {
      value: metrics.review_count ? metrics.avg_rating.toFixed(1) : "—",
      label: "Average Rating",
      note: `Based on ${metrics.review_count} review${metrics.review_count === 1 ? "" : "s"}`,
      tone: "rating",
      href: `${BASE}/reviews`,
    },
    {
      value: metrics.completed_projects_count,
      label: "Completed Jobs",
      note: "All time",
      tone: "pink",
      href: `${BASE}/projects`,
    },
  ];

  return (
    <>
      <section className="flex flex-col gap-5 rounded-2xl bg-[#262262] p-5 sm:p-7 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl leading-7 font-bold text-white">
              {greeting()}, {firstName}!
            </h1>
            <TierBadge
              label={contractor.membership_tier.replace(
                " Verified Membership",
                " Member",
              )}
            />
            {contractor.is_veteran_owned && (
              <span className="text-secondary-foreground inline-flex h-5.5 items-center gap-1 rounded-full border border-[#e9d4ff] bg-[#eeedf8] px-2.25 text-xs leading-4 font-semibold">
                <Shield aria-hidden className="size-2.5" strokeWidth={2.5} />
                Veteran Owned
              </span>
            )}
            {contractor.is_id_verified && (
              <span className="inline-flex h-5.5 items-center gap-1 rounded-full border border-[#bedbff] bg-[#eff6ff] px-2.25 text-xs leading-4 font-semibold text-[#1447e6]">
                <BadgeCheck
                  aria-hidden
                  className="size-2.5"
                  strokeWidth={2.5}
                />
                ID.me Verified
              </span>
            )}
          </div>
          <p className="text-sm leading-5 text-white/60">
            {[
              contractor.business_name,
              contractor.location.replace(/^,\s*|,\s*$/g, ""),
              memberSince && `Member since ${memberSince}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div className="pt-2">
            <AvailabilitySwitch
              available={contractor.is_available_today}
              onChange={onChange}
            />
          </div>
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
          {data.ongoing_projects.length === 0 ? (
            <p className={emptyRow}>No projects yet.</p>
          ) : (
            <ul>
              {data.ongoing_projects.map((project) => (
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
                        {project.customer_name}
                        {project.due_date && ` · Due ${project.due_date}`}
                      </p>
                    </div>
                    <StatusPill
                      {...(projectStatuses[project.status] ?? {
                        label: project.status,
                        tone: "blue",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      role="progressbar"
                      aria-label={`${project.title} progress`}
                      aria-valuenow={project.progress_percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]"
                    >
                      <div
                        className="h-full rounded-full bg-[#211d53]"
                        style={{ width: `${project.progress_percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs leading-4 font-medium text-[#64748b]">
                      {project.progress_percent}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Messages" href={`${BASE}/messages`}>
          {!messages.data ? (
            <p className={emptyRow}>
              {messages.error ? messages.error.message : "Loading…"}
            </p>
          ) : messages.data.items.length === 0 ? (
            <p className={emptyRow}>No messages yet.</p>
          ) : (
            <ul>
              {messages.data.items.map((conversation) => (
                <li key={conversation.id} className={rowBorder}>
                  <Link
                    to={`${BASE}/messages?c=${conversation.id}`}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#f8fafc]"
                  >
                    <UserAvatar
                      name={conversation.other_user.name}
                      src={mediaUrl(conversation.other_user.avatar)}
                      className="size-8"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                          {conversation.other_user.name}
                        </p>
                        <p className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                          {conversation.last_message?.sent_human}
                        </p>
                      </div>
                      <p className="truncate pt-0.5 text-xs leading-4 text-[#64748b]">
                        {conversation.last_message?.body ?? "No messages yet"}
                      </p>
                    </div>
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", {
                        "bg-[#c41e3a]": conversation.unread_count > 0,
                      })}
                    >
                      {conversation.unread_count > 0 && (
                        <span className="sr-only">Unread</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Recent Quote Requests" href={`${BASE}/quotes`}>
          {data.recent_leads.length === 0 ? (
            <p className={emptyRow}>No quote requests yet.</p>
          ) : (
            <ul>
              {data.recent_leads.slice(0, 3).map((lead) => (
                <li
                  key={lead.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5",
                    rowBorder,
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                        {lead.customer_name}
                      </p>
                      <StatusPill
                        {...(leadStatuses[lead.status] ?? {
                          label: lead.status,
                          tone: "blue",
                        })}
                      />
                    </div>
                    <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                      {lead.project_title}
                      {lead.location.replace(/^,\s*|,\s*$/g, "") &&
                        ` · ${lead.location.replace(/^,\s*|,\s*$/g, "")}`}
                    </p>
                    <p className="pt-0.5 text-xs leading-4 text-[#94a3b8]">
                      {lead.budget_display} · {lead.requested_human}
                    </p>
                  </div>
                  <Link
                    to={`${BASE}/quotes?lead=${lead.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs leading-4 font-medium text-[#1b3a6b] hover:bg-[#f1f5f9]"
                  >
                    View
                    <span className="sr-only">
                      {" "}
                      quote request from {lead.customer_name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Reviews" href={`${BASE}/reviews`}>
          {!reviews.data ? (
            <p className={emptyRow}>
              {reviews.error ? reviews.error.message : "Loading…"}
            </p>
          ) : reviews.data.items.length === 0 ? (
            <p className={emptyRow}>No reviews yet.</p>
          ) : (
            <ul className="space-y-3 p-4">
              {reviews.data.items.map((review) => (
                <li key={review.id} className="rounded-lg bg-[#f6f6f6] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={review.customer.name}
                        src={mediaUrl(review.customer.avatar)}
                        className="size-7"
                      />
                      <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                        {review.customer.name}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                      {review.date_formatted}
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
                  {review.comment && (
                    <p className="pt-1.5 text-xs leading-[19.5px] text-[#475569]">
                      {review.comment}
                    </p>
                  )}
                  {review.project && (
                    <p className="pt-1 text-xs leading-4 font-medium text-[#94a3b8]">
                      {review.project.title}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
