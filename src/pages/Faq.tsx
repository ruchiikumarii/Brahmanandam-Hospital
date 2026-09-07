import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo, faqSchema } from "@/components/Seo";
import { faqs } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section, cn } from "@/components/ui";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Seo
        crumbs={[{ label: "FAQ" }]}
        schema={faqSchema(faqs)}
        title="Frequently Asked Questions"
        description="Answers to common questions about Brahmanandam Hospital, Sonari - location, working hours, appointments, available specialities, insurance and online consultation."
      />
      <PageHero
        crumbs={[{ label: "FAQ" }]}
        eyebrow="Help & Information"
        title="Frequently Asked Questions"
        subtitle="Quick answers about visiting Brahmanandam Hospital, Sonari - timings, appointments, specialities, insurance and more."
        icon={<Icon name="clipboard-check" size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              Still have a question?
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Our helpdesk answers calls round the clock and responds to
              inquiries within 15 minutes during OPD hours.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              <Phone size={15} />
              {site.phone}
            </a>
          </div>
        }
      />

      <Section tone="white">
        <ul className="mx-auto grid max-w-3xl gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                data-reveal
                style={{ "--reveal-delay": `${Math.min(i * 60, 300)}ms` } as React.CSSProperties}
                className={cn(
                  "overflow-hidden rounded-[1.125rem] border bg-white transition-colors",
                  isOpen ? "border-primary/25 shadow-card" : "border-line",
                )}
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={cn(
                        "text-[1rem] leading-snug font-bold",
                        isOpen ? "text-secondary" : "text-primary",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                        isOpen
                          ? "rotate-180 bg-secondary text-white"
                          : "bg-[rgba(47,59,128,.06)] text-primary",
                      )}
                    >
                      <ChevronDown size={17} strokeWidth={2.4} />
                    </span>
                  </button>
                </h2>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  hidden={!isOpen}
                  className="px-5 pb-5"
                >
                  <p className="border-t border-line pt-4 text-[0.9375rem] leading-[1.8] text-muted">
                    {item.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          data-reveal
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[0.9375rem] text-muted">
            Prefer to speak to someone? Send us a message and we will call you
            back.
          </p>
          <Link
            to="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
          >
            Contact Us
          </Link>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
