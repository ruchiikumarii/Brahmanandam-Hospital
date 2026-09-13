import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck,
  ChevronDown,
  Menu,
  Phone,
  Siren,
  X,
} from "lucide-react";
import { mainNav, site, type NavItem } from "@/lib/data/site";
import { cn } from "@/components/ui";
import { Logo } from "./Logo";

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    window.addEventListener("bh:toggle-menu", toggle);
    return () => window.removeEventListener("bh:toggle-menu", toggle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close an open desktop dropdown on outside click or Escape. */
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    if (pathname.startsWith(item.href)) return true;
    return Boolean(item.children?.some((c) => pathname === c.href));
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/92 backdrop-blur-md transition-shadow",
          scrolled
            ? "border-line shadow-[0_6px_24px_-20px_rgba(47,59,128,.6)]"
            : "border-transparent",
        )}
      >
        {/*
          The emergency number lives here rather than in the main row: the
          whole header is sticky, so it stays on screen either way, and the
          main row then has room for the nav without overrunning the shell.
        */}
        <div className="hidden bg-primary text-white lg:block">
          <div className="shell flex h-9 items-center justify-between gap-6 text-[0.75rem]">
            <p className="flex min-w-0 items-center gap-2 text-white/85">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-400" />
              <span className="truncate">
                {site.address.line1}, {site.address.line2}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-4">
              <a
                href={`mailto:${site.email}`}
                className="hidden text-white/85 hover:text-white xl:inline"
              >
                {site.email}
              </a>
              <span className="hidden text-white/25 xl:inline">|</span>
              <a
                href={site.phoneHref}
                className="flex items-center gap-1.5 whitespace-nowrap text-white/85 hover:text-white"
              >
                <Siren size={13} className="text-secondary-400" />
                24×7 Emergency
                <strong className="font-extrabold text-white">{site.phone}</strong>
              </a>
              <span className="text-white/25">|</span>
              <span className="font-semibold whitespace-nowrap text-white">
                {site.hours}
              </span>
            </div>
          </div>
        </div>

        <div className="shell flex h-[4.25rem] items-center gap-3 lg:h-[4.75rem]">
          <div className="shrink-0">
            <Logo priority />
          </div>

          {/*
            The nav takes the space between the logo and the buttons and centres
            itself in it, so the row reads as balanced instead of left-packed.
            Everything else is shrink-0, so the widths have to add up. The tight
            case is the 73.75rem (1180px) breakpoint: a 1132px shell, less
            logo 182, buttons 218 and gaps 24, leaves 708px for seven items
            that need 523. It was 1400px while the nav had nine items; at 7 it
            fits well below that, and laptops at 110-125% zoom (1240-1400px
            wide) were getting a hamburger beside an empty gap. It is in rem on
            purpose: a media query's rem follows the visitor's default font
            size, so anyone who has asked for larger text keeps the hamburger
            until the enlarged nav really fits.
          */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className="hidden min-w-0 flex-1 justify-center min-[73.75rem]:flex"
          >
            <ul className="flex items-center">
              {mainNav.map((item) => {
                const active = isActive(item);

                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative inline-flex h-9 items-center rounded-full px-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                          active
                            ? "text-primary"
                            : "text-muted hover:bg-[rgba(47,59,128,.045)] hover:text-primary",
                        )}
                      >
                        {item.label}
                        {active ? (
                          <span className="absolute inset-x-2 -bottom-[3px] h-[2px] rounded-full bg-secondary" />
                        ) : null}
                      </Link>
                    </li>
                  );
                }

                const expanded = openMenu === item.label;
                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-haspopup="true"
                      onClick={() => setOpenMenu(expanded ? null : item.label)}
                      className={cn(
                        "relative inline-flex h-9 items-center gap-1 rounded-full px-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted hover:bg-[rgba(47,59,128,.045)] hover:text-primary",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        strokeWidth={2.4}
                        className={cn(
                          "transition-transform duration-200",
                          expanded && "rotate-180",
                        )}
                      />
                      {active ? (
                        <span className="absolute inset-x-2 -bottom-[3px] h-[2px] rounded-full bg-secondary" />
                      ) : null}
                    </button>

                    <div
                      className={cn(
                        "absolute top-full left-0 z-50 w-[16.5rem] pt-2 transition-all duration-200",
                        expanded
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0",
                      )}
                    >
                      <ul className="overflow-hidden rounded-[1rem] border border-line bg-white p-1.5 shadow-[0_24px_48px_-24px_rgba(47,59,128,.45)]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              className={cn(
                                "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[0.8125rem] font-semibold transition-colors",
                                pathname === child.href
                                  ? "bg-[rgba(47,59,128,.07)] text-primary"
                                  : "text-muted hover:bg-[rgba(47,59,128,.05)] hover:text-primary",
                              )}
                            >
                              {child.label}
                              {pathname === child.href ? (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2.5 min-[73.75rem]:ml-0">
            <a
              href={site.phoneHref}
              title={`24×7 emergency - call ${site.phone}`}
              className="hidden h-10 w-10 place-items-center rounded-full bg-secondary text-white transition-colors hover:bg-secondary-700 md:grid"
            >
              <Phone size={17} strokeWidth={2.2} />
              <span className="sr-only">
                Call the 24×7 emergency line, {site.phone}
              </span>
            </a>

            <Link
              to="/appointment"
              className="hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-[0.8125rem] font-bold whitespace-nowrap text-white transition-colors hover:bg-primary-800 lg:inline-flex"
            >
              <CalendarCheck size={16} strokeWidth={2.2} />
              Book Appointment
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-primary min-[73.75rem]:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </header>

      {/* Rendered outside <header>: its backdrop-filter would become the
          containing block for this fixed panel and collapse it. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.25rem] bottom-0 z-[60] overflow-y-auto border-t border-line bg-white lg:top-[7rem] min-[73.75rem]:hidden"
      >
        <nav aria-label="Mobile" className="shell py-5 pb-24">
          <ul className="grid gap-1">
            {mainNav.map((item) => {
              const active = isActive(item);

              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-[0.9375rem] font-semibold transition-colors",
                        active
                          ? "bg-[rgba(47,59,128,.07)] text-primary"
                          : "text-ink hover:bg-tint",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      ) : null}
                    </Link>
                  </li>
                );
              }

              const expanded = openMobileGroup === item.label;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setOpenMobileGroup(expanded ? null : item.label)
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[0.9375rem] font-semibold transition-colors",
                      active
                        ? "bg-[rgba(47,59,128,.07)] text-primary"
                        : "text-ink hover:bg-tint",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={17}
                      strokeWidth={2.3}
                      className={cn(
                        "text-muted transition-transform duration-200",
                        expanded && "rotate-180 text-secondary",
                      )}
                    />
                  </button>
                  <ul hidden={!expanded} className="mt-1 grid gap-0.5 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          to={child.href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[0.875rem] font-medium transition-colors",
                            pathname === child.href
                              ? "text-secondary"
                              : "text-muted hover:text-primary",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1 w-1 shrink-0 rounded-full",
                              pathname === child.href
                                ? "bg-secondary"
                                : "bg-primary-200",
                            )}
                          />
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid gap-2.5">
            <Link
              to="/appointment"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-[0.875rem] font-bold text-white"
            >
              <CalendarCheck size={17} /> Book an Appointment
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white"
            >
              <Siren size={17} /> 24×7 Emergency: {site.phone}
            </a>
          </div>

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">
            {site.address.line1}
            <br />
            {site.address.line2}
          </p>
        </nav>
      </div>
    </>
  );
}
