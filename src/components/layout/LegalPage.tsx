import { Link } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/data/site";

export type LegalSection = { heading: string; paragraphs: string[]; points?: string[] };

export function LegalPage({
  crumb,
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero
        crumbs={[{ label: crumb }]}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        icon={<FileText size={14} className="text-secondary" />}
      />

      <section className="bg-white py-12 lg:py-14">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <p className="rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-3 text-[0.8125rem] text-muted">
              Last updated: {updated}. This page describes hospital practice at the
              Sonari campus. For clarification, call{" "}
              <a href={site.phoneHref} className="font-bold text-secondary hover:underline">
                {site.phone}
              </a>
              .
            </p>

            <div className="mt-8 grid gap-8">
              {sections.map((section) => (
                <section key={section.heading} data-reveal>
                  <h2 className="text-[1.25rem] leading-snug font-extrabold">
                    {section.heading}
                  </h2>
                  <div className="mt-3 grid gap-3 text-[0.9375rem] leading-[1.8] text-muted">
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                  {section.points ? (
                    <ul className="mt-4 grid gap-2.5">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.9375rem] text-muted">
                Questions about this policy? Our patient relations desk can help.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/contact"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-[0.875rem] font-bold text-white hover:bg-primary-800"
                >
                  Contact Us
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.875rem] font-bold text-primary shadow-card hover:bg-white/70"
                >
                  <Phone size={15} />
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
