import { Building2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { FacilityCard } from "@/components/cards/FacilityCard";
import { facilities, campusWayfinding } from "@/lib/data/content";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";
import { Seo } from "@/components/Seo";


const campusFacts = [
  { value: "6", label: "Core clinical facilities" },
  { value: "24×7", label: "Emergency & pharmacy" },
  { value: "1:1", label: "ICU nursing ratio" },
];

export default function FacilitiesPage() {
  return (
    <>
      <Seo
        title="Hospital Facilities"
        description="Trauma centre, ICU and critical care, laminar airflow operation theatres, modern diagnostics, 24x7 in-house pharmacy and ambulance fleet at Brahmanandam Hospital, Sonari, Jamshedpur."
      />
      <PageHero
        crumbs={[{ label: "Hospital Facilities" }]}
        eyebrow="Infrastructure • Kagal Nagar Campus"
        title="Departments & Facilities Built for Acute Care"
        subtitle="Modern clinical spaces engineered for acute interventions, zero hospital-acquired infections, and peaceful patient recovery in Sonari, Jamshedpur."
        icon={<Building2 size={14} className="text-secondary" />}
        aside={
          <ul className="grid grid-cols-3 divide-x divide-line rounded-[1.125rem] border border-line bg-white px-2 py-5 shadow-card">
            {campusFacts.map((fact) => (
              <li key={fact.label} className="px-3 text-center">
                <p className="font-display text-[1.5rem] leading-none font-extrabold text-primary">
                  {fact.value}
                </p>
                <p className="mt-2 text-[0.6875rem] leading-snug font-semibold text-muted">
                  {fact.label}
                </p>
              </li>
            ))}
          </ul>
        }
      />

      <Section tone="white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, i) => (
            <FacilityCard
              key={facility.slug}
              facility={facility}
              priority={i < 3}
              style={revealDelay(i % 3, 90)}
            />
          ))}
        </div>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="Campus Wayfinding"
          title="Finding Your Way Around"
          subtitle="OPD registration, token issuance, and specialty chambers are organised for minimal patient transit."
          ekg={false}
        />
        <ul className="mx-auto mt-9 grid max-w-3xl gap-3">
          {campusWayfinding.map((item, i) => (
            <li
              key={item.title}
              className="rounded-[1.125rem] border border-line bg-white p-5 shadow-card"
            >
              <p className="flex items-start gap-2.5 text-[1rem] font-extrabold text-primary">
                <Icon
                  name={i === 0 ? "clipboard-check" : "scan"}
                  size={17}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                {item.title}
              </p>
              <p className="mt-1.5 pl-7 text-[0.9375rem] leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
          <li className="rounded-[1.125rem] bg-primary p-5 text-white">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-white/70 uppercase">
              Hospital Address
            </p>
            <p className="mt-2 text-[1rem] font-bold text-white">
              {site.address.line1}
            </p>
            <p className="text-[0.9375rem] text-white/75">{site.address.line2}</p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-secondary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Get Campus Directions
            </a>
          </li>
        </ul>
      </Section>

      <EmergencyBanner />
    </>
  );
}
