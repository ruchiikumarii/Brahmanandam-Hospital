import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { quickActions } from "@/lib/data/content";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function QuickActions() {
  return (
    <section className="relative isolate bg-lavender py-10 sm:py-12">
      <div className="shell grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action, i) => {
          const isHelpline = action.variant === "helpline";
          const isEmergency = action.variant === "emergency";
          const external = action.href.startsWith("tel:");

          const inner = (
            <>
              {/* decorative corner wash */}
              {isEmergency ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full"
                  style={{ background: "rgba(190,53,58,.07)" }}
                />
              ) : null}

              <div className="relative flex items-start justify-between">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl",
                    isHelpline
                      ? "bg-white/14 text-white"
                      : isEmergency
                        ? "bg-[rgba(190,53,58,.09)] text-secondary"
                        : "bg-[rgba(47,59,128,.07)] text-primary",
                  )}
                >
                  <Icon name={action.icon} size={20} />
                </span>
                {isEmergency ? (
                  <span className="text-[0.6875rem] font-bold text-secondary">24×7</span>
                ) : (
                  <ArrowUpRight
                    size={18}
                    className={cn(
                      "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      isHelpline ? "text-white/70" : "text-muted",
                    )}
                  />
                )}
              </div>

              {isHelpline ? (
                <div className="relative mt-6">
                  <p className="text-[0.6875rem] font-bold tracking-[0.1em] text-white/70 uppercase">
                    Direct Helpline
                  </p>
                  <p className="mt-1.5 font-display text-[1.5rem] leading-none font-extrabold text-white">
                    {site.phone}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-snug text-white/70">
                    {action.text}
                  </p>
                </div>
              ) : (
                <div className="relative mt-6">
                  <h3
                    className={cn(
                      "text-[1.0625rem] font-extrabold tracking-[0.01em] uppercase",
                      isEmergency ? "!text-secondary" : "!text-primary",
                    )}
                  >
                    {action.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                    {action.text}
                  </p>
                </div>
              )}
            </>
          );

          const className = cn(
            "group relative isolate flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.125rem] p-5 transition-all duration-200",
            isHelpline
              ? "bg-primary shadow-[0_18px_40px_-24px_rgba(47,59,128,.9)] hover:-translate-y-1 hover:bg-primary-800"
              : "border border-line bg-white shadow-card hover:-translate-y-1 hover:shadow-lift",
          );
          const style = revealDelay(i, 90);

          return external ? (
            <a
              key={action.title}
              href={action.href}
              data-reveal
              style={style}
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link
              key={action.title}
              to={action.href}
              data-reveal
              style={style}
              className={className}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function DirectHelplineStrip() {
  return (
    <a
      href={site.phoneHref}
      className="inline-flex items-center gap-2 text-[0.875rem] font-bold text-secondary hover:underline"
    >
      <Phone size={15} /> {site.phone}
      <ArrowRight size={14} />
    </a>
  );
}
