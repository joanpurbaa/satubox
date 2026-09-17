import AppLogo from "./AppLogo";
import { apps } from "@/lib/apps";

export default function AppMarquee() {
  const items = [...apps, ...apps];

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface-alt py-3">
      {/* Fade edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      />

      <div
        className="marquee-track flex w-max items-center gap-4 px-4"
        aria-hidden="true"
      >
        {items.map((app, i) => (
          <div
            key={`${app.name}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
          >
            <AppLogo src={app.src} name={app.name} size={50} className="rounded-full" />
            <span className="text-sm font-medium text-white">
              {app.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}