import type { ContactInfo } from "@/services/public";
import { MapPin } from "lucide-react";
import { contact } from "../data/contact";

export default function ContactDetails({
  details,
}: {
  details?: ContactInfo["support_details"];
}) {
  const rows = details
    ? [
        {
          label: "Email",
          value: details.email,
          href: `mailto:${details.email}`,
        },
        {
          label: "Phone",
          value: details.phone,
          href: `tel:${details.phone.replace(/[^\d+]/g, "")}`,
        },
        { label: "Address", value: details.address },
        { label: "Support hours", value: details.office_hours },
      ]
    : [];

  return (
    <aside className="space-y-4 lg:w-95 lg:shrink-0">
      <dl className="bg-secondary-foreground min-h-60 space-y-4.5 rounded-2xl p-6 leading-[normal]">
        {rows.map((detail) => (
          <div key={detail.label} className="space-y-0.5">
            <dt className="text-xs font-medium text-[#d9d9f2]">
              {detail.label}
            </dt>
            <dd className="text-sm font-bold text-white">
              {detail.href ? (
                <a href={detail.href} className="hover:underline">
                  {detail.value}
                </a>
              ) : (
                detail.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {details && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${details.map_location.pin_label} in Google Maps`}
          className="relative grid h-55 place-content-center overflow-hidden rounded-2xl border border-[#e6eaf2] bg-[rgba(166,173,178,0.2)]"
        >
          <img
            src={contact.map.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <span className="relative flex items-center gap-1 text-sm leading-[normal] font-medium text-[#c92032]">
            <MapPin aria-hidden className="size-4 fill-[#c92032] text-white" />
            {details.map_location.city}, {details.map_location.state}
          </span>
        </a>
      )}
    </aside>
  );
}
