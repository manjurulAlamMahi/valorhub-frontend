import type { ServiceRequest } from "@/services/customer";
import type { ReactNode } from "react";
import StatusBadge from "./status-badge";

type RequestRowProps = {
  request: ServiceRequest;
  showDate?: boolean;
  action?: ReactNode;
};

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";

export default function RequestRow({
  request,
  showDate = false,
  action,
}: RequestRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[15px] font-medium text-[#1e293b]">
          {request.project_title}
        </p>
        <p className="text-[13px] text-[#64748b]">
          {request.recipient?.business_name ?? "Sent to nearby contractors"}
          {showDate &&
            request.requested_at &&
            ` · Posted ${formatDate(request.requested_at)}`}
        </p>
      </div>
      <StatusBadge status={request.status} />
      {action}
    </li>
  );
}
