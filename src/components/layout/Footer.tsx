import { Link } from "react-router-dom";
import { ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { clinicalServiceLinks, patientCareNav, site } from "@/lib/data/site";
import {
  footerAbout,
  footerCompanyLinks,
  footerQuickLinks,
} from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";

const serviceIcons = [
  "siren",
  "activity",
  "scalpel",
  "scan",
  "microscope",
  "pill",
  "ambulance",
  "clipboard-check",
];

/** Brand glyphs — lucide dropped brand icons, so these are inline paths. */
const socialPaths: Record<string, string> = {
  Facebook:
    "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.49-1.46h1.51V4.46A20.6 20.6 0 0 0 14.28 4C12 4 10.5 5.4 10.5 7.95V10.5H8v3h2.5V21z",
  Instagram:
    "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8m0 1.8a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2M17 6.4a1 1 0 1 0 0 2.1 1 1 0 0 0 0-2.1M8.2 3h7.6A5.2 5.2 0 0 1 21 8.2v7.6a5.2 5.2 0 0 1-5.2 5.2H8.2A5.2 5.2 0 0 1 3 15.8V8.2A5.2 5.2 0 0 1 8.2 3m0 1.9A3.3 3.3 0 0 0 4.9 8.2v7.6a3.3 3.3 0 0 0 3.3 3.3h7.6a3.3 3.3 0 0 0 3.3-3.3V8.2a3.3 3.3 0 0 0-3.3-3.3z",
  YouTube:
    "M21.6 8.1a2.5 2.5 0 0 0-1.76-1.77C18.28 5.9 12 5.9 12 5.9s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 8.1 26 26 0 0 0 2 12a26 26 0 0 0 .4 3.9 2.5 2.5 0 0 0 1.76 1.77c1.56.43 7.84.43 7.84.43s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-3.9M10.1 15V9l5.2 3z",
  WhatsApp:
    "M12.04 2.5a9.44 9.44 0 0 0-8.1 14.28L2.5 21.5l4.85-1.4A9.44 9.44 0 1 0 12.04 2.5m0 1.9a7.55 7.55 0 1 1-3.85 14.04l-.28-.16-2.87.83.85-2.8-.18-.29A7.55 7.55 0 0 1 12.04 4.4m-3.3 3.5c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.7 2.7 4.18 3.68 2.06.81 2.48.65 2.93.61.45-.04 1.44-.59 1.65-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.19-.46-.39-.4-.54-.41z",
};

const socials = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "WhatsApp", href: site.whatsapp },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-[1.0625rem] font-bold !text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="no-print relative isolate overflow-hidden bg-primary text-white">
      {/* subtle brand backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(680px 380px at 8% 0%, rgba(255,255,255,.07), transparent 62%), radial-gradient(620px 420px at 96% 88%, rgba(190,53,58,.28), transparent 60%)",
        }}
      />

      <div className="shell relative pt-10 pb-6 lg:pt-12">
        {/* CTA banner */}
        <div
          data-reveal="zoom"
          className="relative overflow-hidden rounded-2xl px-6 py-7 sm:px-9 sm:py-8"
          style={{
            background:
              "linear-gradient(103deg, #be353a 0%, #a82c31 52%, #8f2429 100%)",
          }}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 h-full opacity-25"
            width="420"
            height="120"
            viewBox="0 0 420 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60h150l14-34 18 68 15-50 12 16h211"
              stroke="rgba(255,255,255,.7)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.375rem] leading-tight font-extrabold !text-white sm:text-[1.625rem]">
                Need Immediate Medical Attention or OPD Slot?
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] text-white/85">
                Consult our board-certified clinical specialists and senior
                surgeons in Sonari, Jamshedpur.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/appointment"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[0.9375rem] font-bold text-secondary transition-colors hover:bg-white/90"
              >
                Book Appointment Now
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/45 px-7 text-[0.9375rem] font-bold text-white transition-colors hover:bg-white/12"
              >
                <Phone size={17} strokeWidth={2.2} />
                {site.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div
          data-reveal
          className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.15fr_.72fr_.72fr_1fr_.95fr_1.05fr] xl:gap-6"
        >
          <div>
            {/* The lockup already carries the name and the "Multi Speciality
                Centre Sonari" line, so the separate name and tagline pill are
                gone. White knock-out: the colour logo's blue half vanishes on
                navy. */}
            <Logo variant="white" className="h-12 w-auto lg:h-14" />
            <p className="mt-4 max-w-xs text-[0.875rem] leading-[1.75] text-white/70">
              {footerAbout}
            </p>
            <ul className="mt-6 flex gap-2.5">
              {socials.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={socialPaths[label]} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Company</ColumnTitle>
            <ul className="mt-4 grid gap-2.5">
              {footerCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 text-[0.875rem] text-white/75 transition-colors hover:text-white"
                  >
                    <ChevronRight
                      size={13}
                      className="text-secondary-400 transition-transform group-hover:translate-x-0.5"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Clinical Services</ColumnTitle>
            <ul className="mt-4 grid gap-2.5">
              {clinicalServiceLinks.map((item, i) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-2 text-[0.875rem] text-white/75 transition-colors hover:text-white"
                  >
                    <Icon
                      name={serviceIcons[i]}
                      size={15}
                      className="text-secondary-400"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Quick Links</ColumnTitle>
            <ul className="mt-4 grid gap-2.5">
              {footerQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 text-[0.875rem] text-white/75 transition-colors hover:text-white"
                  >
                    <ChevronRight
                      size={13}
                      className="text-secondary-400 transition-transform group-hover:translate-x-0.5"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Patient Care</ColumnTitle>
            <ul className="mt-4 grid gap-2.5">
              {patientCareNav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-1.5 text-[0.875rem] text-white/75 transition-colors hover:text-white"
                  >
                    <ChevronRight
                      size={13}
                      className="text-secondary-400 transition-transform group-hover:translate-x-0.5"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Get in Touch</ColumnTitle>
            <ul className="mt-4 grid gap-3.5 text-[0.875rem]">
              <li className="flex gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-secondary-400" />
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="leading-[1.65] text-white/75 transition-colors hover:text-white"
                >
                  {site.address.line1},<br />
                  {site.address.line2}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-secondary-400" />
                <a
                  href={site.phoneHref}
                  className="font-bold text-white hover:underline"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-secondary-400" />
                <span className="grid gap-1">
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-white/75 transition-colors hover:text-white"
                  >
                    {site.email}
                  </a>
                  <a
                    href={`mailto:${site.emailAlt}`}
                    className="break-all text-white/75 transition-colors hover:text-white"
                  >
                    {site.emailAlt}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="shrink-0 text-secondary-400" />
                <span className="font-semibold text-[#5ee3ab]">{site.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with EKG accent */}
        <div className="relative mt-11 h-px w-full bg-white/15">
          <span className="absolute left-1/2 -top-px h-[3px] w-24 -translate-x-1/2 rounded-full bg-secondary" />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-[0.8125rem] text-white/65 sm:flex-row">
          <p>© 2026 Brahmanandam Hospital Sonari || All Right Reserved</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold text-white/80">
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/patient-charter" className="hover:text-white">
                Patient Charter
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
