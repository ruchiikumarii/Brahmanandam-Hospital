import { Link } from "react-router-dom";
import { ArrowRight, Clock, Phone } from "lucide-react";
import {
  aboutHospital,
  coreServiceBlurbs,
  emergencyHeadline,
  emergencySubhead,
  openingHours,
} from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { EkgLine, Section, SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

/**
 * The six core service descriptions and the hospital summary, reproduced
 * verbatim from the hospital's published site content.
 */
export function CoreServices() {
  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Our Services"
        title="Comprehensive Care Across Every Department"
        subtitle={aboutHospital}
        ekg={false}
      />

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coreServiceBlurbs.map((service, i) => (
          <li
            key={service.title}
            data-reveal
            style={revealDelay(i % 3, 90)}
          >
            <Link
              to={service.href}
              className="group flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary transition-colors group-hover:bg-[rgba(47,59,128,.11)]">
                <Icon name={service.icon} size={22} />
              </span>
              <h3 className="mt-5 text-[1.125rem] leading-snug font-extrabold">
                {service.title}
              </h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">
                {service.text}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.875rem] font-bold text-primary transition-colors group-hover:text-secondary">
                Learn more
                <ArrowRight size={15} strokeWidth={2.3} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** 24×7 emergency strip — headline and opening hours as published. */
export function EmergencyHours() {
  return (
    <section className="relative isolate bg-lavender py-12 lg:py-14">
      <div className="shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div data-reveal="left">
          <p className="eyebrow">Emergency Service</p>
          <h2 className="mt-2 text-[1.625rem] leading-tight font-extrabold sm:text-[2rem]">
            {emergencyHeadline}
          </h2>
          <EkgLine className="mt-2" width={150} />
          <p className="mt-3 text-[1.0625rem] font-bold text-secondary">
            {emergencySubhead}
          </p>
          <a
            href={site.phoneHref}
            className="mt-6 inline-flex h-[3.25rem] items-center gap-2.5 rounded-full bg-secondary px-7 text-[0.9375rem] font-extrabold text-white transition-colors hover:bg-secondary-700"
          >
            <Phone size={17} strokeWidth={2.2} />
            {site.phoneDisplay}
          </a>
        </div>

        <div
          data-reveal="right"
          className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card"
        >
          <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
            <Clock size={14} className="text-secondary" />
            24×7 Emergency Services
          </p>
          <ul className="mt-4 grid gap-2.5">
            {openingHours.map((row) => (
              <li
                key={row.days}
                className="flex items-center justify-between gap-4 rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-3"
              >
                <span className="text-[0.875rem] font-semibold text-ink">
                  {row.days}
                </span>
                <span className="text-[0.875rem] font-extrabold text-success">
                  {row.hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
