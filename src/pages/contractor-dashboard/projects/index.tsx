import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { useState } from "react";
import StatusPill from "../_components/status-pill";
import {
  projects,
  projectStatuses,
  type ProjectStatus,
} from "../data/contractor-dashboard";

const filters: { label: string; statuses: ProjectStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "In Progress", statuses: ["in_progress", "started"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Cancelled", statuses: ["cancelled"] },
];

export default function Projects() {
  const [active, setActive] = useState(0);
  const { label, statuses } = filters[active];
  const items = statuses
    ? projects.filter((project) => statuses.includes(project.status))
    : projects;

  return (
    <>
      <SEO
        title="Projects"
        description="Track progress on your active ValorHub projects."
        robots="noindex, nofollow"
      />

      <div className="space-y-4 p-4 sm:p-6">
        <div className="border-b border-[#f1f5f9] pb-4 sm:px-5 sm:pt-5">
          <div
            role="tablist"
            aria-label="Filter projects"
            className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0"
          >
            {filters.map((filter, index) => (
              <button
                key={filter.label}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="project-list"
                onClick={() => setActive(index)}
                className={cn(
                  "h-7 shrink-0 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  active === index
                    ? "bg-[#1b3a6b] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div id="project-list" role="tabpanel">
          {items.length > 0 ? (
            <ul className="overflow-hidden rounded-2xl bg-white">
              {items.map((project) => (
                <li
                  key={project.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-b border-[#0f172a]/10 px-5 py-4 last:border-b-0 md:grid-cols-[minmax(0,15rem)_1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                      {project.title}
                    </p>
                    <p className="pt-0.5 text-xs leading-4 text-[#64748b]">
                      {project.client} · Due {project.due}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 max-md:row-start-2 md:col-span-1">
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
                    <span className="w-16 max-md:hidden" />
                  </div>
                  <div className="justify-self-end max-md:col-start-2 max-md:row-start-1">
                    <StatusPill {...projectStatuses[project.status]} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#64748b]">
              No {label.toLowerCase()} projects yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
