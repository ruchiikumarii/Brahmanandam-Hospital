import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import type { Crumb } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/data/site";
import type { ContentBlock } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";

/**
 * Shared long-form page shell used by the institutional and patient-care
 * pages: breadcrumb, hero, prose/bullet/numbered sections, then a help strip.
 */
export function ContentPage({
  crumbs,
  eyebrow,
  title,
  subtitle,
  icon,
  aside,
  sections,
  children,
  footerNote,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  subtitle: string;
  icon?: string;
  aside?: ReactNode;
  sections?: ContentBlock[];
  children?: ReactNode;
  footerNote?: string;
}) {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        icon={icon ? <Icon name={icon} size={14} className="text-secondary" /> : undefined}
        aside={aside}
      />

      <section className="bg-white py-12 lg:py-14">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            {sections?.map((block, i) => (
              <section
                key={block.heading ?? `block-${i}`}
                data-reveal
                className={i === 0 ? "" : "mt-8"}
              >
                {block.heading ? (
                  <h2 className="flex items-center gap-3 text-[1.25rem] leading-snug font-extrabold sm:text-[1.375rem]">
                    <span className="h-5 w-[3px] shrink-0 rounded-full bg-secondary" />
                    {block.heading}
                  </h2>
                ) : null}
                {block.paragraphs?.length ? (
                  <div
                    className={`grid gap-3 text-[0.9375rem] leading-[1.8] text-muted ${
                      block.heading ? "mt-3" : ""
                    }`}
                  >
                    {block.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                ) : null}
                {block.points?.length ? (
                  block.numbered ? (
                    <ol className="mt-4 grid gap-2.5">
                      {block.points.map((point, n) => (
                        <li
                          key={point.slice(0, 40)}
                          className="flex items-start gap-3 rounded-xl bg-[rgba(47,59,128,.04)] px-4 py-3 text-[0.9375rem] leading-relaxed text-ink"
                        >
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[0.6875rem] font-bold text-white">
                            {n + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="mt-4 grid gap-2.5">
                      {block.points.map((point) => (
                        <li
                          key={point.slice(0, 40)}
                          className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )
                ) : null}
              </section>
            ))}

            {children}

            {footerNote ? (
              <p
                data-reveal
                className="mt-9 rounded-xl bg-[rgba(190,53,58,.05)] px-4 py-3.5 text-[0.875rem] leading-relaxed text-muted"
              >
                {footerNote}
              </p>
            ) : null}

            <div
              data-reveal
              className="mt-10 flex flex-col gap-3 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-[0.9375rem] text-muted">
                Need help or want to speak to our team? We are available 24×7.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={site.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
                >
                  <Phone size={15} />
                  {site.phone}
                </a>
                <Link
                  to="/appointment"
                  className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[0.875rem] font-bold text-primary shadow-card transition-colors hover:bg-white/70"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
