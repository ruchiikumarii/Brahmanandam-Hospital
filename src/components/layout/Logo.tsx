import { Link } from "react-router-dom";
import { cn } from "@/components/ui";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-[0.9rem] bg-primary text-white",
        className,
      )}
      aria-hidden="true"
    >
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <path
          d="M13.4 4h5.2v8.4H27v5.2h-8.4V26h-5.2v-8.4H5v-5.2h8.4z"
          fill="currentColor"
          opacity=".95"
        />
        <path
          d="M5 22.6h5.1l1.6-3.1 2.6 6 2.1-4.2 1.3 1.3H27"
          stroke="#BE353A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  invert = false,
  compact = false,
}: {
  invert?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5"
      aria-label="Brahmanandam Hospital — home"
    >
      <LogoMark className={cn(compact ? "h-9 w-9" : "h-11 w-11")} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-extrabold tracking-[-0.02em]",
            compact ? "text-[1.05rem]" : "text-[1.25rem]",
            invert ? "text-white" : "text-primary",
          )}
        >
          Brahmanandam
        </span>
        <span
          className={cn(
            "mt-1 text-[0.5625rem] font-bold tracking-[0.14em] uppercase",
            invert ? "text-white/65" : "text-muted",
          )}
        >
          Multi Specialty Centre Sonari
        </span>
      </span>
    </Link>
  );
}
