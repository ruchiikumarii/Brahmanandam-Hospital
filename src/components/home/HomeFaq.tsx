import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data/institutional";
import { Section, SectionHeading, cn } from "@/components/ui";

/** The hospital's published FAQ, shown on the homepage as an accordion. */
export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tone="soft" backdrop="soft">
      <SectionHeading
        eyebrow="Help & Information"
        title="Frequently Asked Questions"
        subtitle="Quick answers about visiting Brahmanandam Hospital, Sonari."
      />

      <ul className="mx-auto mt-10 grid max-w-3xl gap-3">
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
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`home-faq-${i}`}
                  id={`home-faq-btn-${i}`}
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
              </h3>
              <div
                id={`home-faq-${i}`}
                role="region"
                aria-labelledby={`home-faq-btn-${i}`}
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

      <p className="mt-8 text-center">
        <Link
          to="/faq"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
        >
          See all frequently asked questions
          <ArrowRight size={17} strokeWidth={2.2} />
        </Link>
      </p>
    </Section>
  );
}
