import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { csrInitiatives, csrVision } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { EkgLine, Section, SectionHeading } from "@/components/ui";

export default function CsrPage() {
  return (
    <>
      <Seo
        title="Corporate Social Responsibility (CSR)"
        description="CSR at Brahmanandam Hospital, Sonari — free health check-up camps, community health awareness, women and child health support, and help for underprivileged patients in Jamshedpur."
      />
      <PageHero
        crumbs={[{ label: "CSR" }]}
        eyebrow="Community • Jamshedpur"
        title="Corporate Social Responsibility"
        subtitle="Healthcare goes beyond hospital walls. We are committed to improving community well-being through compassion and service."
        icon={<Icon name="hand-heart" size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              Our CSR Vision
            </p>
            <EkgLine className="mt-2" width={120} />
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              {csrVision}
            </p>
          </div>
        }
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="What We Do"
          title="Key CSR Initiatives"
          subtitle="Programmes run through the year in Sonari and the surrounding areas of Jamshedpur."
          ekg={false}
        />

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {csrInitiatives.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <article className="relative flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <span className="absolute top-5 right-6 font-display text-[1.75rem] leading-none font-extrabold text-[rgba(190,53,58,.09)]">
                  0{i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
                  <Icon name={item.icon} size={21} />
                </span>
                <h2 className="mt-5 text-[1.0625rem] leading-snug font-extrabold">
                  {item.title}
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {item.text}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="lavender">
        <div
          data-reveal="zoom"
          className="mx-auto max-w-3xl rounded-[1.25rem] border border-line bg-white p-7 text-center shadow-card sm:p-10"
        >
          <h2 className="text-[1.5rem] leading-tight font-extrabold sm:text-[1.75rem]">
            Partner with us on a health camp
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            Schools, panchayats, resident welfare associations and corporates in
            and around Jamshedpur can request a free screening camp or an
            awareness session at their premises.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={site.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Call {site.phone}
            </a>
            <a
              href={`mailto:${site.email}?subject=CSR%20health%20camp%20request`}
              className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.04)]"
            >
              Email the CSR desk
            </a>
          </div>
          <p className="mt-5 text-[0.8125rem] text-muted">{site.address.full}</p>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
