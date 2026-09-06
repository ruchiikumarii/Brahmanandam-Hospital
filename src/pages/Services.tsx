import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { services } from "@/lib/data/content";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";
import { Seo } from "@/components/Seo";


export default function ServicesPage() {
  return (
    <>
      <Seo
        crumbs={[{ label: "Services" }]}
        title="Hospital Services in Jamshedpur | Emergency, ICU, OT & Diagnostics"
        description="24x7 emergency care, ICU and critical care, modular operation theatres, diagnostic imaging, clinical pathology, in-house pharmacy, ambulance and preventive health check-ups at Brahmanandam Hospital, Sonari, Jamshedpur."
      />
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow="Clinical Services • Sonari Campus"
        title="Complete Hospital Services Under One Roof"
        subtitle="From golden-hour emergency response to preventive screening, every service below runs on the Kagal Nagar campus with in-house diagnostics, pharmacy and intensive care backup."
        icon={<Stethoscope size={14} className="text-secondary" />}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              Always Available
            </p>
            <p className="mt-3 font-display text-[2.25rem] leading-none font-extrabold text-primary">
              24 × 7
            </p>
            <p className="mt-2 text-[0.875rem] text-muted">
              Emergency, ICU, pharmacy, lab and ambulance dispatch operate
              continuously.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Call {site.phone}
            </a>
          </div>
        }
      />

      <Section tone="white">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <li
              key={service.id}
              id={service.id}
              data-reveal
              style={revealDelay(i % 3, 90)}
              className="scroll-mt-28"
            >
              <article className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                  <Icon name={service.icon} size={22} />
                </span>
                <h2 className="mt-5 text-[1.1875rem] font-extrabold">
                  {service.title}
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {service.text}
                </p>
                <ul className="mt-4 grid gap-2 border-t border-line pt-4">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[0.8125rem] text-ink"
                    >
                      <CircleCheck size={15} className="mt-0.5 shrink-0 text-success" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <div
          data-reveal="zoom"
          className="mt-10 flex flex-col items-center gap-4 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] px-6 py-8 text-center"
        >
          <h2 className="text-[1.375rem] font-extrabold">
            Not sure which service you need?
          </h2>
          <p className="max-w-xl text-[0.9375rem] text-muted">
            Our OPD helpdesk can guide you to the right department, share
            investigation costs, and confirm a consultation slot the same day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/appointment"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
            >
              Book an Appointment
              <ArrowRight size={16} strokeWidth={2.3} />
            </Link>
            <Link
              to="/departments"
              className="inline-flex h-12 items-center rounded-full border border-line bg-white px-6 text-[0.875rem] font-bold text-primary transition-colors hover:bg-white/60"
            >
              Browse Departments
            </Link>
          </div>
        </div>
      </Section>

      <EmergencyBanner />
    </>
  );
}
