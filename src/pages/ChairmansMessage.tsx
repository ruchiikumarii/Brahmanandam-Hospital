import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { chairmanMessage } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { EkgLine } from "@/components/ui";

export default function ChairmansMessagePage() {
  const m = chairmanMessage;

  return (
    <>
      <Seo
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Chairman's Message" }]}
        title="Chairman's Message"
        description={`A message from ${m.name}, Chairman of Brahmanandam Hospital, Sonari, on compassion, integrity and accessible quality healthcare for Jamshedpur.`}
      />
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Chairman's Message" }]}
        eyebrow="Leadership • Brahmanandam Hospital"
        title="Chairman's Message"
        subtitle="Healthcare is not just a service but a responsibility toward society — a principle that has shaped this institution from the very beginning."
        icon={<Icon name="hand-heart" size={14} className="text-secondary" />}
      />

      <section className="bg-white py-12 lg:py-14">
        <div className="shell">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-10">
            <aside
              data-reveal="left"
              className="rounded-[1.25rem] border border-line bg-white p-6 text-center shadow-card lg:sticky lg:top-[6.5rem]"
            >
              <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary font-display text-[1.75rem] font-extrabold text-white">
                {m.initials}
              </span>
              <h2 className="mt-4 text-[1.1875rem] font-extrabold">{m.name}</h2>
              <p className="mt-1 text-[0.875rem] font-semibold text-secondary">
                {m.role}
              </p>
              <p className="mt-1 text-[0.8125rem] text-muted">{m.organisation}</p>
              <EkgLine className="mx-auto mt-4" width={120} />
            </aside>

            <article data-reveal className="min-w-0">
              <Quote
                size={40}
                className="text-[rgba(47,59,128,.12)]"
                aria-hidden="true"
              />
              <div className="mt-3 grid gap-4 text-[1rem] leading-[1.85] text-muted">
                {m.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <p className="font-display text-[1.125rem] font-extrabold text-primary">
                  {m.name}
                </p>
                <p className="text-[0.875rem] text-muted">
                  {m.role}, {m.organisation}
                </p>
              </div>

              <Link
                to="/ceo-message"
                className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-primary transition-colors hover:text-secondary"
              >
                Read the CEO&rsquo;s message
                <ArrowRight size={17} strokeWidth={2.2} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <EmergencyBanner />
    </>
  );
}
