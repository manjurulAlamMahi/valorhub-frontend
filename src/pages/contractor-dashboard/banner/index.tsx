import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { catalogApi, type BannerData } from "@/services/contractor";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const MAX_SIZE = 5 * 1024 * 1024;
// Shown until the contractor uploads their own banner
const DEFAULT_IMAGE = "/images/contractor-dashboard/banner.jpg";

export default function Banner() {
  const query = useApi<BannerData>("/contractor/banner");

  return (
    <>
      <SEO
        title="Banner"
        description="Manage your homepage banner on ValorHub."
        robots="noindex, nofollow"
      />
      <div className="space-y-5 px-4 pt-6 pb-6 sm:px-6">
        <QueryBoundary query={query}>
          {(banner) => (
            <BannerEditor banner={banner} onChange={query.refetch} />
          )}
        </QueryBoundary>
      </div>
    </>
  );
}

function BannerEditor({
  banner,
  onChange,
}: {
  banner: BannerData;
  onChange: () => void;
}) {
  const [headline, setHeadline] = useState(banner.banner_headline ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const image = banner.banner_image ?? DEFAULT_IMAGE;

  const run = async (task: () => Promise<unknown>, success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await task();
      onChange();
      setMessage({ type: "success", text: success });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof ApiError
            ? (Object.values(err.fieldErrors)[0]?.[0] ?? err.message)
            : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  };

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
    void run(
      () => catalogApi.updateBanner({ image: file }),
      `${file.name} is now your banner image.`,
    );
  };

  return (
    <>
      {banner.is_available ? (
        <p className="rounded-[10px] bg-[#edf0fc] px-4 py-3 text-[13px] font-semibold text-[#26225f]">
          Elite Plan: Your business is featured in the homepage rotating banner.
          This is a paid-tier exclusive placement.
          {!banner.is_live && " Upload a banner image to go live."}
        </p>
      ) : (
        <p className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-[#fff7e0] px-4 py-3 text-[13px] font-semibold text-[#8c660d]">
          The homepage banner is an Elite plan feature.
          <Link
            to="/contractor/dashboard/subscription"
            className="text-[#c41e3a] hover:underline"
          >
            Upgrade to Elite
          </Link>
        </p>
      )}

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
            {headline || banner.banner_headline}
          </p>
        </div>

        {banner.is_available && (
          <>
            <form
              className="flex flex-col gap-2 sm:flex-row sm:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                void run(
                  () =>
                    catalogApi.updateBanner({
                      headline: headline.trim() || null,
                    }),
                  "Headline saved.",
                );
              }}
            >
              <div className="flex-1">
                <label
                  htmlFor="banner-headline"
                  className="block pb-1.5 text-xs font-semibold text-[#26225f]"
                >
                  Banner headline
                </label>
                <input
                  id="banner-headline"
                  maxLength={160}
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="w-full rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3.5 py-2.5 text-sm text-[#26225f] outline-none focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10"
                />
              </div>
              <button
                type="submit"
                disabled={busy || headline === (banner.banner_headline ?? "")}
                className="rounded-[10px] border border-[#26225f] px-4 py-2.5 text-sm font-semibold text-[#26225f] hover:bg-[#eeedf8] disabled:opacity-40"
              >
                Save headline
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white focus-within:ring-3 focus-within:ring-[#c41e3a]/30 hover:bg-[#a51a31]">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  disabled={busy}
                  onChange={(event) => {
                    upload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
                {busy ? "Saving…" : "Upload New Banner Image"}
              </label>
              {banner.banner_image && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("Remove your banner image?"))
                      void run(
                        () => catalogApi.deleteBanner(),
                        "Banner removed.",
                      );
                  }}
                  className="text-sm font-medium text-[#c41e3a] hover:underline disabled:opacity-50"
                >
                  Remove banner
                </button>
              )}
            </div>
          </>
        )}

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
    </>
  );
}
