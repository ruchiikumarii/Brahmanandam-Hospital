import { Link } from "react-router-dom";
import { revealDelay } from "@/lib/use-scroll-reveal";
import { BadgeCheck, CalendarDays, Phone, ShieldCheck } from "lucide-react";
import { site } from "@/lib/data/site";
import { trustPoints } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";
import { HeroBookingCard } from "./HeroBookingCard";

const toneClass: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* subtle brand backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 520px at 76% -12%, rgba(47,59,128,.09), transparent 60%), radial-gradient(720px 420px at -8% 18%, rgba(190,53,58,.05), transparent 58%), linear-gradient(180deg,#fbfbff 0%,#ffffff 62%)",
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[42%] -z-10 w-full opacity-[.2]"
        height="80"
        viewBox="0 0 1400 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40h520l16-26 20 54 18-40 14 12h812"
          stroke="rgba(190,53,58,.55)"
          strokeWidth="1.2"
        />
      </svg>
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(47,59,128,.08), transparent 70%)" }}
      />

      <div className="shell grid items-center gap-10 py-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:py-16">
        <div>
          <p
            data-reveal="fade"
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3.5 py-2 text-[0.6875rem] font-bold tracking-[0.09em] uppercase shadow-[0_2px_10px_-6px_rgba(47,59,128,.4)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-primary">Trusted Multi-Specialty Care</span>
            <span className="h-1 w-1 rounded-full bg-primary-200" />
            <span className="font-semibold normal-case tracking-normal text-muted">
              Sonari, Jamshedpur
            </span>
          </p>

          <h1
            data-reveal
            style={revealDelay(1)}
            className="mt-5 text-[2.25rem] leading-[1.06] font-extrabold tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]"
          >
            <span className="text-primary">Advanced Healthcare.</span>
            <br />
            <span className="text-secondary">Compassionate Care.</span>
          </h1>

          <p
            data-reveal
            style={revealDelay(2)}
            className="mt-5 max-w-xl text-[0.9375rem] leading-[1.75] text-muted sm:text-base"
          >
            Brahmanandam Hospital, Sonari is committed to providing world-class
            medical care with compassion, advanced surgical infrastructure, 24×7
            emergency preparedness, and senior board-certified specialists.
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {trustPoints.map((point, i) => (
              <li
                key={point.title}
                data-reveal
                style={revealDelay(i + 3, 80)}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-white/85 px-3 py-3 backdrop-blur-sm transition-colors hover:border-primary/25"
              >
                <Icon
                  name={point.icon}
                  size={18}
                  className={toneClass[point.tone]}
                />
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-[0.8125rem] font-bold text-primary">
                    {point.title}
                  </span>
                  <span className="truncate text-[0.75rem] text-muted">
                    {point.caption}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div
            data-reveal
            style={revealDelay(6, 70)}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/appointment"
              className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-secondary px-7 text-[0.875rem] font-extrabold tracking-[0.02em] text-white transition-colors hover:bg-secondary-700"
            >
              BOOK AN APPOINTMENT
              <CalendarDays size={18} strokeWidth={2.2} />
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-[0.875rem] font-extrabold tracking-[0.02em] text-white transition-colors hover:bg-primary-800"
            >
              <Phone size={17} strokeWidth={2.2} />
              24×7 EMERGENCY: {site.phone}
            </a>
          </div>

          <ul
            data-reveal="fade"
            style={revealDelay(7, 70)}
            className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-[0.8125rem] text-muted"
          >
            <li className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-success" />
              NABH Standards Oriented
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              22+ Cashless TPAs
            </li>
          </ul>
        </div>

        <div data-reveal="right" style={revealDelay(2, 90)} className="lg:pl-2">
          <HeroBookingCard />
        </div>
      </div>
    </section>
  );
}
