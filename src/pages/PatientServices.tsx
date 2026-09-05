import { Link } from "react-router-dom";
import { ArrowRight, Ban } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { patientSupportServices } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";

const quickLinks = [
  { label: "Admission Process", href: "/admission-process" },
  { label: "Discharge Process", href: "/discharge-process" },
  { label: "Guidelines for Visitors", href: "/visitor-guidelines" },
  { label: "Patient & Attendant Rights", href: "/patient-rights" },
  { label: "TPA & Insurance", href: "/insurance" },
  { label: "Frequently Asked Questions", href: "/faq" },
];

export default function PatientServicesPage() {
  return (
    <>
      <Seo
        title="Patient Services"
        description="Support facilities at Brahmanandam Hospital, Sonari — 24x7 pharmacy, blood bank coordination, ambulance, laundry, patient assistance, safe drinking water and cafeteria."
      />
      <PageHero
        crumbs={[{ label: "Patient Services" }]}
        eyebrow="Patient Care Services"
        title="Patient Services & Support Facilities"
        subtitle="We are committed to providing comprehensive healthcare services along with essential support facilities to ensure comfort, safety and convenience."
        icon={<Icon name="hand-heart" size={14} className="text-secondary" />}
      />

      <Section tone="white">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patientSupportServices.map((service, i) => (
            <li
              key={service.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <article className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                    <Icon name={service.icon} size={21} />
                  </span>
                  <span className="rounded-full bg-[rgba(15,157,110,.09)] px-2.5 py-1 text-[0.6875rem] font-bold whitespace-nowrap text-success">
                    {service.note}
                  </span>
                </div>
                <h2 className="mt-5 text-[1.0625rem] leading-snug font-extrabold">
                  {service.title}
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {service.text}
                </p>
              </article>
            </li>
          ))}

          <li data-reveal style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
            <div className="flex h-full flex-col justify-center rounded-[1.125rem] border border-[rgba(190,53,58,.18)] bg-blush p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-white">
                <Ban size={21} />
              </span>
              <h2 className="mt-5 text-[1.0625rem] font-extrabold !text-secondary">
                No-Smoking Campus
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                For the safety and health of every patient, attendant and staff
                member, the entire hospital is a designated no-smoking zone.
              </p>
            </div>
          </li>
        </ul>
      </Section>

      <Section tone="lavender">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div data-reveal="left">
            <p className="eyebrow">Before You Visit</p>
            <h2 className="mt-2 text-[1.625rem] leading-tight font-extrabold sm:text-[1.875rem]">
              Patient care guides in one place
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Admission and discharge formalities, visitor rules, your rights as
              a patient, and insurance support — all documented so there are no
              surprises.
            </p>
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Ambulance & Helpline: {site.phone}
            </a>
          </div>

          <ul data-reveal="right" className="grid gap-2.5 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="flex h-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-[0.875rem] font-bold text-primary transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  {link.label}
                  <ArrowRight size={15} strokeWidth={2.3} className="shrink-0 text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
