import { SEO } from "@/components/seo/SEO";
import Pagination from "@/components/shared/pagination";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  contractorApi,
  type ContractorProject,
  type ProjectStatus,
  type ProjectsData,
} from "@/services/contractor";
import { useCallback, useState } from "react";
import Modal, {
  cancelButton,
  modalField,
  modalLabel,
} from "../_components/modal";
import StatusPill from "../_components/status-pill";
import { projectStatuses } from "../data/contractor-dashboard";

type Filter = "all" | ProjectStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "scheduled", label: "Scheduled" },
  { value: "pending_materials", label: "Pending Materials" },
  { value: "completed", label: "Completed" },
];

const statusOptions = Object.entries(projectStatuses) as [
  ProjectStatus,
  { label: string },
][];

function ProgressDialog({
  project,
  onClose,
  onSaved,
}: {
  project: ContractorProject;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [progress, setProgress] = useState(project.progress_percent);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await contractorApi.updateProgress(project.id, {
        progress_percent: progress,
        status,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update project.",
      );
      setSaving(false);
    }
  };

  return (
    <Modal
      label={`Update ${project.title}`}
      onClose={onClose}
      onSubmit={() => void save()}
      className="max-w-105"
    >
      <div>
        <p className="text-base font-bold text-[#212633]">{project.title}</p>
        <p className="text-[13px] text-[#8c949e]">{project.customer.name}</p>
      </div>

      <div>
        <label htmlFor="project-progress" className={modalLabel}>
          Progress: {progress}%
        </label>
        <input
          id="project-progress"
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(event) => {
            const value = Number(event.target.value);
            setProgress(value);
            // 100% means done; pulling back from 100% reopens the job
            if (value === 100) setStatus("completed");
            else if (status === "completed") setStatus("in_progress");
          }}
          className="w-full accent-[#262262]"
        />
      </div>

      <div>
        <label htmlFor="project-status" className={modalLabel}>
          Status
        </label>
        <select
          id="project-status"
          value={status}
          onChange={(event) => {
            const value = event.target.value as ProjectStatus;
            setStatus(value);
            if (value === "completed") setProgress(100);
          }}
          className={modalField}
        >
          {statusOptions.map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {status === "completed" && (
          <p className="pt-1.5 text-xs text-[#8c949e]">
            Completing a job lets the customer leave a review.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#c41e3a]">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#262262] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#211d53] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ContractorProject | null>(null);
  const query = useApi<ProjectsData>("/contractor/projects", {
    status: filter === "all" ? null : filter,
    page,
  });
  const close = useCallback(() => setEditing(null), []);
  const label = filters.find((item) => item.value === filter)?.label ?? "";

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
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={filter === item.value}
                aria-controls="project-list"
                onClick={() => {
                  setFilter(item.value);
                  setPage(1);
                }}
                className={cn(
                  "flex h-7 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  filter === item.value
                    ? "bg-[#1b3a6b] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {item.label}
                {query.data && (
                  <span className="opacity-60">
                    {query.data.counts[item.value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div id="project-list" role="tabpanel">
          <QueryBoundary query={query}>
            {({ items, pagination }) =>
              items.length > 0 ? (
                <>
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
                            {project.customer.name}
                            {project.due_date &&
                              ` · Due ${project.due_date}`} ·{" "}
                            {project.total_amount_display}
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center gap-3 max-md:row-start-2 md:col-span-1">
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
                        <div className="flex items-center gap-2 justify-self-end max-md:col-start-2 max-md:row-start-1">
                          <StatusPill
                            {...(projectStatuses[project.status] ?? {
                              label: project.status_label,
                              tone: "blue",
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => setEditing(project)}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#1b3a6b] hover:bg-[#f1f5f9]"
                          >
                            Update
                            <span className="sr-only"> {project.title}</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Pagination
                    page={pagination.current_page}
                    totalPages={pagination.last_page}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#64748b]">
                  {filter === "all"
                    ? "No projects yet. Accepted quotes become projects here."
                    : `No ${label.toLowerCase()} projects.`}
                </p>
              )
            }
          </QueryBoundary>
        </div>
      </div>

      {editing && (
        <ProgressDialog
          key={editing.id}
          project={editing}
          onClose={close}
          onSaved={query.refetch}
        />
      )}
    </>
  );
}
