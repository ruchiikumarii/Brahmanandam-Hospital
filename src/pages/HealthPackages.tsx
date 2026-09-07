import { Link } from "react-router-dom";
import { CircleCheck, Clock, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Seo } from "@/components/Seo";
import { healthPackages } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui";

const crumbs = [{ label: "Health Packages" }];

const howItWorks = [
  {
    title: "Call or book online",
    text: "Ring the helpdesk on 8271827999 or submit the appointment form to reserve a slot.",
    icon: "phone",
  },
  {
    title: "Come fasting in the morning",
    text: "Most panels need an 8–10 hour fast. Report between 7:00 AM and 10:00 AM at the collection counter.",
    icon: "clipboard-check",
  },
  {
    title: "Samples & scans the same visit",
    text: "Blood collection, ECG and imaging are completed in a single visit at the Kagal Nagar campus.",
    icon: "microscope",
  },
  {
    title: "Reports & doctor review",
    text: "Routine reports are ready the same day, followed by a consolidated review with the physician.",
    icon: "check-circle",
  },
];

export default function HealthPackagesPage() {
  return (
    <>
      <Seo
        crumbs={crumbs}
        title="Preventive Health Check-up Packages"
        description="Preventive health check-up packages at Brahmanandam Hospital, Sonari, Jamshedpur - basic health check, diabetes care, cardiac screening, women's health, senior citizen and executive check-ups with same-day reports."
      />

      <PageHero
        crumbs={crumbs}
        eyebrow="Preventive Health Check-up • Sonari"
        title="Health Check-up Packages"
        subtitle="Early detection keeps small problems small. Each package below is completed in a single visit at the Kagal Nagar campus, with same-day routine reports and a consolidated physician review."
        icon={<Icon name="clipboard-check" size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              Book a health check
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Package contents can be tailored to your age, history and your
              doctor&rsquo;s advice. Call the helpdesk for the current price
              list and fasting instructions.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              <Phone size={15} />
              {site.phone}
            </a>
            <Link
              to="/appointment"
              className="mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[rgba(47,59,128,.06)] text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
            >
              Book Online
            </Link>
          </div>
        }
      />

      <Section tone="white">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {healthPackages.map((pkg, i) => (
            <li
              key={pkg.name}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <article className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                  <Icon name={pkg.icon} size={21} />
                </span>
                <h2 className="mt-5 text-[1.125rem] font-extrabold">{pkg.name}</h2>
                <p className="mt-1.5 text-[0.8125rem] font-semibold text-secondary">
                  {pkg.forWhom}
                </p>

                <p className="mt-4 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">
                  Includes
                </p>
                <ul className="mt-2.5 grid gap-2">
                  {pkg.includes.map((test) => (
                    <li
                      key={test}
                      className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink"
                    >
                      <CircleCheck size={15} className="mt-0.5 shrink-0 text-success" />
                      {test}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="text-[0.8125rem] text-muted">
                    Price on request
                  </span>
                  <a
                    href={site.phoneHref}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-secondary px-4 text-[0.8125rem] font-bold text-white transition-colors hover:bg-secondary-700"
                  >
                    <Phone size={14} />
                    Enquire
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mx-auto mt-8 max-w-3xl rounded-xl bg-[rgba(190,53,58,.05)] px-4 py-3.5 text-center text-[0.8125rem] leading-relaxed text-muted"
        >
          Package contents are indicative and may be adjusted by the consulting
          physician based on your age, medical history and symptoms. Call{" "}
          <a href={site.phoneHref} className="font-bold text-secondary hover:underline">
            {site.phone}
          </a>{" "}
          for current pricing and fasting instructions.
        </p>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="How It Works"
          title="One visit, same-day reports"
          subtitle="Sample collection, imaging and the physician review are all completed at the Sonari campus."
          ekg={false}
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="relative rounded-[1.125rem] border border-line bg-white p-6 shadow-card"
            >
              <span className="absolute top-5 right-5 font-display text-[1.75rem] leading-none font-extrabold text-[rgba(47,59,128,.07)]">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
                <Icon name={step.icon} size={19} />
              </span>
              <h3 className="mt-5 text-[1rem] leading-snug font-extrabold">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex items-center justify-center gap-2 text-[0.875rem] text-muted">
          <Clock size={15} className="text-primary" />
          Sample collection 7:00 AM – 8:00 PM · Emergency lab open 24×7
        </p>
      </Section>

      <EmergencyBanner />
    </>
  );
}
