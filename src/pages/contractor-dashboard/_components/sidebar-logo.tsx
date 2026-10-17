import { cn } from "@/lib/utils";

const LOGO = "/images/contractor-dashboard/logo";

// White ValorHub lockup for the navy sidebar, assembled from the Figma vectors
const pieces: [string, string][] = [
  ["shield.svg", "inset-[0_83.06%_29.67%_1.78%]"],
  ["v9.svg", "inset-[7.57%_81.31%_0_0]"],
  ["v10.svg", "inset-[25.68%_91.08%_53.91%_4.01%]"],
  ["v11.svg", "inset-[21.57%_93.36%_64.33%_2.91%]"],
  ["v1.svg", "inset-[21.78%_67.51%_14.02%_21.74%]"],
  ["v2.svg", "inset-[26.44%_58.71%_26.57%_30.55%]"],
  ["v3.svg", "inset-[26.44%_52.31%_26.57%_41.79%]"],
  ["v8.svg", "inset-[25.37%_41.22%_25.45%_47.45%]"],
  ["v4.svg", "inset-[26.44%_32.5%_26.57%_59.81%]"],
  ["v5.svg", "inset-[21.18%_21.61%_21.32%_69.72%]"],
  ["v6.svg", "inset-[26.44%_11.09%_25.32%_80.17%]"],
  ["v7.svg", "inset-[26.44%_2.52%_26.57%_90.69%]"],
  ["tm.svg", "inset-[26.48%_0_68.63%_97.89%]"],
];

export default function SidebarLogo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ValorHub"
      className={cn("relative block h-[28.027px] w-31 shrink-0", className)}
    >
      {pieces.map(([file, inset]) => (
        <img
          key={file}
          src={`${LOGO}/${file}`}
          alt=""
          className={cn("absolute block max-w-none", inset)}
        />
      ))}
      <span className="absolute inset-[84.02%_1.58%_-1.86%_30.68%] text-[4.528px] leading-none tracking-[0.8604px] whitespace-nowrap text-white">
        Veteran - Owned Businesses
      </span>
    </span>
  );
}
