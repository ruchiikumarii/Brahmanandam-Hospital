import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { patientRights } from "@/lib/data/institutional";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";

export default function PatientRightsPage() {
  return (
    <>
      <Seo
        title="Patient and Attendant Rights"
        description="Patient and attendant rights at Brahmanandam Hospital, Sonari — dignity, privacy, clear medical information, safety, cost transparency and access to medical records."
      />
      <PageHero
        crumbs={[
          { label: "Patient Care", href: "/patient-services" },
          { label: "Patient and Attendant Rights" },
        ]}
        eyebrow="Patient Care Services"
        title="Patient and Attendant Rights"
        subtitle="Every patient deserves compassionate care, respect and transparency. We are committed to protecting these rights throughout your healthcare experience."
        icon={<Icon name="hand-heart" size={14} className="text-secondary" />}
      />

      <Section tone="white">
        <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {patientRights.map((right, i) => (
            <li
              key={right.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
              className="flex gap-4 rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
                <Icon name={right.icon} size={19} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[1.0625rem] leading-snug font-extrabold">
                  {right.title}
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {right.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mx-auto mt-10 max-w-3xl rounded-[1.25rem] bg-[rgba(47,59,128,.05)] px-6 py-6 text-center text-[0.9375rem] leading-relaxed text-muted"
        >
          Brahmanandam Hospital, Sonari is dedicated to delivering
          patient-centered healthcare that respects the rights, dignity and
          well-being of every individual.
        </p>
      </Section>

      <EmergencyBanner />
    </>
  );
}
