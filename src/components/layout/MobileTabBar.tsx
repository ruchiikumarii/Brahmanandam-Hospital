import { Link, useLocation } from "react-router-dom";
import { CalendarCheck, Home, Menu, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/components/ui";
import { site } from "@/lib/data/site";

type Tab = {
  label: string;
  href: string;
  icon: typeof Home;
  /** Centre action, raised out of the bar. */
  primary?: boolean;
  /** Emergency line — always red. */
  danger?: boolean;
  /** WhatsApp — always green. */
  chat?: boolean;
  /** Opens the header drawer instead of navigating. */
  action?: boolean;
  external?: boolean;
};

const tabs: Tab[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Call", href: site.phoneHref, icon: Phone, danger: true, external: true },
  { label: "Appointment", href: "/appointment", icon: CalendarCheck, primary: true },
  {
    label: "WhatsApp",
    href: site.whatsapp,
    icon: MessageCircle,
    chat: true,
    external: true,
  },
  { label: "Menu", href: "#menu", icon: Menu, action: true },
];

export function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Quick actions"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md xl:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ label, href, icon: IconCmp, primary, danger, chat, action, external }) => {
          const active =
            !danger &&
            !chat &&
            !action &&
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
                  !primary && chat && "text-success",
                  !primary && !danger && !chat && (active ? "text-primary" : "text-muted"),
                )}
              >
                <IconCmp
                  size={primary ? 20 : 19}
                  strokeWidth={active || primary ? 2.3 : 1.9}
                />
              </span>
              <span
                className={cn(
                  "mt-1 text-[0.625rem] font-bold",
                  danger
                    ? "text-secondary"
                    : chat
                      ? "text-success"
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

          const cls =
            "relative flex h-[3.75rem] w-full flex-col items-center justify-center";

          return (
            <li key={label} className="relative">
              {action ? (
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("bh:toggle-menu"))
                  }
                  aria-label="Open navigation menu"
                  className={cls}
                >
                  {inner}
                </button>
              ) : external ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  aria-label={
                    danger
                      ? `Call the 24x7 hospital helpline ${site.phone}`
                      : `Chat with the hospital on WhatsApp`
                  }
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  to={href}
                  aria-current={active ? "page" : undefined}
                  className={cls}
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
