import type { ReactNode } from "react";
import type { ServiceRequest } from "../data/dashboard";
import StatusBadge from "./status-badge";

type RequestRowProps = {
  request: ServiceRequest;
  showDate?: boolean;
  action?: ReactNode;
};

export default function RequestRow({
  request,
  showDate = false,
  action,
}: RequestRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[15px] font-medium text-[#1e293b]">
          {request.title}
        </p>
        <p className="text-[13px] text-[#64748b]">
          {request.contractor}
          {showDate && ` · Posted ${request.postedAt}`}
        </p>
      </div>
      <StatusBadge status={request.status} />
      {action}
    </li>
  );
}
