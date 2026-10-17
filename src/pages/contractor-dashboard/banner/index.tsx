import { SEO } from "@/components/seo/SEO";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { contractor } from "../data/contractor-dashboard";

const MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_IMAGE = "/images/contractor-dashboard/banner.jpg";

export default function Banner() {
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Release the previous local preview when it is replaced
  useEffect(
    () => () => {
      if (image.startsWith("blob:")) URL.revokeObjectURL(image);
    },
    [image],
  );

  const upload = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type))
      return setMessage({
        type: "error",
        text: "Please choose a JPG or PNG image.",
      });
    if (file.size > MAX_SIZE)
      return setMessage({
        type: "error",
        text: "That image is larger than 5MB.",
      });
    setImage(URL.createObjectURL(file));
    setMessage({
      type: "success",
      text: `${file.name} is now your banner image.`,
    });
  };

  return (
    <>
      <SEO
        title="Banner"
        description="Manage your homepage banner on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 px-4 pt-6 pb-6 sm:px-6">
        <p className="rounded-[10px] bg-[#edf0fc] px-4 py-3 text-[13px] font-semibold text-[#26225f]">
          Elite Plan: Your business is featured in the homepage rotating banner.
          This is a paid-tier exclusive placement.
        </p>

        <section className="space-y-4 rounded-xl border border-[#26225f]/10 bg-white p-4 sm:p-6">
          <h1 className="text-base font-bold text-[#26225f]">
            Current Banner Preview
          </h1>

          <div className="relative h-45 overflow-hidden rounded-[10px] bg-[#0f172a]">
            <img
              src={image}
              alt=""
              className={
                image === DEFAULT_IMAGE
                  ? // Same crop as the Figma frame for the stock photo
                    "absolute top-[-182.11%] left-0 h-[300.26%] w-full max-w-none"
                  : "size-full object-cover"
              }
            />
            <p className="absolute inset-x-4 bottom-6 text-lg leading-tight font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] sm:inset-x-6 sm:text-[22px]">
              {contractor.business} — Trusted Veteran-Owned Roofing &amp;
              Remodeling
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white focus-within:ring-3 focus-within:ring-[#c41e3a]/30 hover:bg-[#a51a31]">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(event) => {
                upload(event.target.files?.[0]);
                event.target.value = "";
              }}
              className="sr-only"
            />
            Upload New Banner Image
          </label>

          <p className="text-xs text-[#26225f]/60">
            Recommended: 1440 × 340px, JPG or PNG, up to 5MB.
          </p>

          {message && (
            <p
              role={message.type === "error" ? "alert" : "status"}
              className={
                message.type === "error"
                  ? "text-xs text-[#c41e3a]"
                  : "flex items-center gap-1.5 text-xs text-[#16a34a]"
              }
            >
              {message.type === "success" && (
                <CircleCheck aria-hidden className="size-3.5" />
              )}
              {message.text}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
