import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { qualityFocusAreas } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";

export default function QualityAndSafetyPage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Quality and Safety" }]}
        title="Quality and Safety"
        description="Quality care and patient safety at Brahmanandam Hospital, Sonari - regulatory compliance, clinical risk management, infection control, patient safety and continuous quality improvement."
      />
      <PageHero
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Quality and Safety" }]}
        eyebrow="Clinical Governance"
        title="Quality and Safety"
        subtitle="Quality care and patient safety are our top priorities. Our team maintains high standards through ongoing monitoring and adherence to best medical practices."
        icon={<Icon name="shield-check" size={14} className="text-secondary" />}
      />

      <Section tone="white">
        <p
          data-reveal
          className="mx-auto max-w-2xl text-center text-[0.9375rem] leading-relaxed text-muted"
        >
          Our quality programme concentrates on eight key domains, each reviewed
          through regular internal audits at the Sonari campus.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qualityFocusAreas.map((area, i) => (
            <li
              key={area.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 4) * 80}ms` } as React.CSSProperties}
              className="relative rounded-[1.125rem] border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="absolute top-4 right-5 font-display text-[1.5rem] leading-none font-extrabold text-[rgba(47,59,128,.07)]">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                <Icon name={area.icon} size={19} />
              </span>
              <h2 className="mt-4 text-[1rem] leading-snug font-extrabold">
                {area.title}
              </h2>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                {area.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <EmergencyBanner />
    </>
  );
}
