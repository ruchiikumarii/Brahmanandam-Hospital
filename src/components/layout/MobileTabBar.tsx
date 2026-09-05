import { CalendarCheck, Home, Menu, Siren, Stethoscope } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/components/ui";
import { site } from "@/lib/data/site";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
  { label: "Appointment", href: "/appointment", icon: CalendarCheck, primary: true },
  { label: "Emergency", href: site.phoneHref, icon: Siren, danger: true },
  { label: "Menu", href: "#menu", icon: Menu, action: true },
];

export function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Quick navigation"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md xl:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ label, href, icon: IconCmp, primary, danger, action }) => {
          const active =
            !danger &&
            (href === "/" ? pathname === "/" : pathname.startsWith(href));
          const inner = (
            <>
              <span
                className={cn(
                  "grid place-items-center transition-all",
                  primary
                    ? "-mt-5 h-11 w-11 rounded-full bg-secondary text-white shadow-[0_8px_20px_-8px_rgba(190,53,58,.8)]"
                    : "h-6 w-6",
                  !primary && danger && "text-secondary",
                  !primary && !danger && (active ? "text-primary" : "text-muted"),
                )}
              >
                <IconCmp size={primary ? 20 : 19} strokeWidth={active || primary ? 2.3 : 1.9} />
              </span>
              <span
                className={cn(
                  "mt-1 text-[0.625rem] font-bold",
                  danger
                    ? "text-secondary"
                    : active || primary
                      ? "text-primary"
                      : "text-muted",
                )}
              >
                {label}
              </span>
              {active && !primary ? (
                <span className="absolute top-0 h-[2px] w-8 rounded-full bg-secondary" />
              ) : null}
            </>
          );

          if (action) {
            return (
              <li key={label} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("bh:toggle-menu"))
                  }
                  aria-label="Open navigation menu"
                  className="relative flex h-[3.75rem] w-full flex-col items-center justify-center"
                >
                  {inner}
                </button>
              </li>
            );
          }

          return (
            <li key={label} className="relative">
              {danger ? (
                <a
                  href={href}
                  className="relative flex h-[3.75rem] flex-col items-center justify-center"
                  aria-label={`Call emergency ${site.phone}`}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  to={href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex h-[3.75rem] flex-col items-center justify-center"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
