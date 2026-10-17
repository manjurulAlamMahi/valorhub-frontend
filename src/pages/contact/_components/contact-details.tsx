import { MapPin } from "lucide-react";
import { contact } from "../data/contact";

export default function ContactDetails() {
  return (
    <aside className="space-y-4 lg:w-95 lg:shrink-0">
      <dl className="bg-secondary-foreground space-y-4.5 rounded-2xl p-6 leading-[normal]">
        {contact.details.map((detail) => (
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

      <a
        href={contact.map.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${contact.map.label} in Google Maps`}
        className="relative grid h-55 place-content-center overflow-hidden rounded-2xl border border-[#e6eaf2] bg-[rgba(166,173,178,0.2)]"
      >
        <img
          src={contact.map.image}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <span className="relative flex items-center gap-1 text-sm leading-[normal] font-medium text-[#c92032]">
          <MapPin aria-hidden className="size-4 fill-[#c92032] text-white" />
          {contact.map.label}
        </span>
      </a>
    </aside>
  );
}
