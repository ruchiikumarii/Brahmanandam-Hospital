import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { DoctorsDirectory } from "@/components/doctors/DoctorsDirectory";
import { clinicalStandards } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui";
import { Seo } from "@/components/Seo";


const stats = [
  { value: "32+", label: "Specialists", tone: "text-primary" },
  { value: "24×7", label: "Emergency OT", tone: "text-success" },
  { value: "4.9★", label: "Care Index", tone: "text-secondary" },
];

export default function DoctorsPage() {
  return (
    <>
      <Seo
        title="Our Medical Faculty & Specialists"
        description="Browse board-certified physicians, senior surgeons and clinical consultants at Brahmanandam Hospital, Sonari, Jamshedpur. Filter by specialty, OPD day and timing, then book a consultation online."
      />

      <section className="relative isolate overflow-hidden bg-white pb-10 lg:pb-12">
        <Breadcrumbs items={[{ label: "Doctors Directory" }]} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-20 h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(47,59,128,.08), transparent 68%)",
          }}
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-3.5 py-2 text-[0.6875rem] font-extrabold tracking-[0.1em] text-primary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Sonari Clinical Departmental Registry
            </p>
            <h1 className="mt-4 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3.125rem]">
              Our Medical Faculty &amp; Specialists
            </h1>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-muted sm:text-base">
              Consult with board-certified physicians, senior surgeons, and
              clinical consultants dedicated to compassionate, evidence-based
              patient care at Brahmanandam Hospital, Sonari, Jamshedpur.
            </p>
          </div>

          <ul
            data-reveal="right"
            className="grid grid-cols-3 divide-x divide-line rounded-[1.125rem] bg-tint px-2 py-5 lg:justify-self-end"
          >
            {stats.map((stat) => (
              <li key={stat.label} className="px-3 text-center">
                <p
                  className={`font-display text-[1.5rem] leading-none font-extrabold sm:text-[1.75rem] ${stat.tone}`}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.6875rem] font-bold tracking-[0.07em] text-muted uppercase">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative isolate bg-tint-soft-grad py-10 lg:py-12">
        <div className="shell">
          <DoctorsDirectory />
        </div>
      </section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="Clinical Standards"
          title="Why Consult at Brahmanandam Hospital?"
          subtitle="Setting benchmarks in safety, surgical excellence, and individualized patient recovery across East Singhbhum."
          ekg={false}
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {clinicalStandards.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(47,59,128,.07)] text-primary">
                <Icon name={item.icon} size={20} />
              </span>
              <h3 className="mt-5 text-[1.125rem] font-extrabold">{item.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <EmergencyBanner />
    </>
  );
}
