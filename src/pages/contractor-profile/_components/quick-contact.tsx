import { FileText, Mail, MapPin, Phone } from "lucide-react";
import type { ContractorProfile } from "@/services/public";
import { Link } from "react-router";
import { contractorProfile } from "../data/contractor-profile";

const { contact: copy } = contractorProfile;

export default function QuickContact({
  contractorId,
  contact,
}: {
  contractorId: number;
  contact: ContractorProfile["quick_contact"];
}) {
  return (
    <aside className="h-fit space-y-4 rounded-2xl border border-black/10 bg-white p-6 lg:sticky lg:top-48">
      <div className="space-y-2">
        <h2 className="text-[17.7px] leading-6.75 font-bold text-[#0a0a0a]">
          {copy.title}
        </h2>
        <p className="text-[13.1px] leading-5 text-[#64748b]">
          {contact.headline}
        </p>
      </div>

      <Link
        to={`/request-quote?contractor=${contractorId}`}
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15.6px] leading-6 font-bold text-white transition-colors"
      >
        <FileText aria-hidden className="size-5" />
        {copy.cta}
      </Link>

      <ul className="space-y-2.5 text-[13px] leading-4 text-[#64748b]">
        <li className="flex items-center gap-1.5">
          <MapPin aria-hidden className="size-4" />
          {contact.location}
        </li>
        <li>
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
            className="hover:text-secondary-foreground flex items-center gap-1.5"
          >
            <Phone aria-hidden className="size-4" />
            {contact.phone}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-secondary-foreground flex items-center gap-1.5"
          >
            <Mail aria-hidden className="size-4" />
            {contact.email}
          </a>
        </li>
      </ul>
    </aside>
  );
}
