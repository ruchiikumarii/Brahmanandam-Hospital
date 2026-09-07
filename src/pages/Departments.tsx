import { Link } from "react-router-dom";
import { ChevronRight, MapPinned, Navigation, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { departments } from "@/lib/data/departments";
import { DepartmentsExplorer } from "@/components/departments/DepartmentsExplorer";
import { campusWayfinding } from "@/lib/data/content";
import { doctors } from "@/lib/data/doctors";
import { clinicalDirectory, tpaPartners } from "@/lib/data/institutional";
import { site } from "@/lib/data/site";
import { EkgLine } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { Seo } from "@/components/Seo";


export default function DepartmentsPage() {
  return (
    <>
      <Seo
        title="Departments | Multispeciality Hospital in Sonari, Jamshedpur"
        description="Explore 20+ specialities at Brahmanandam Hospital, Sonari - cardiology and cath lab, orthopaedics, gynaecology, paediatrics, general surgery, emergency and trauma care, ICU, radiology and pathology in Jamshedpur."
      />

      <section className="relative isolate overflow-hidden bg-tint-soft-grad pb-10 lg:pb-12">
        <Breadcrumbs
        items={[{ label: "Departments & Clinical Centres" }]}
        right={
        <>
        <span className="flex items-center gap-2 font-semibold text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {departments.length} Speciality Units Operational
        </span>
        <span className="text-muted">Kagal Nagar Campus, Sonari</span>
        </>
        }
        />
        <div
          aria-hidden="true"
          data-parallax="-45"
          className="pointer-events-none absolute -top-20 left-1/3 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(190,53,58,.06), transparent 70%)",
          }}
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-center">
          <div data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-3.5 py-2 text-[0.6875rem] font-extrabold tracking-[0.1em] text-primary uppercase">
              <ShieldCheck size={14} className="text-secondary" />
              Centre of Clinical Excellence • Jamshedpur
            </p>
            <h1 className="mt-4 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
              Our Clinical Departments &amp; Centres of Excellence
            </h1>
            <EkgLine className="mt-3" width={200} />
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-muted sm:text-base">
              Advanced diagnostic infrastructure, tertiary critical care, and
              board-certified clinicians across 12+ specialized departments in
              Sonari, Jamshedpur.
            </p>
          </div>

          <ul
            data-reveal="right"
            className="grid grid-cols-2 gap-3 rounded-[1.125rem] border border-line bg-white p-5 shadow-card lg:justify-self-end"
          >
            <li className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgba(190,53,58,.07)] text-secondary">
                <Icon name="activity" size={20} />
              </span>
              <span>
                <span className="block font-display text-[1.5rem] leading-none font-extrabold text-primary">
                  24/7
                </span>
                <span className="mt-1 block text-[0.8125rem] text-muted">
                  Emergency &amp; Cath Lab
                </span>
              </span>
            </li>
            <li className="flex items-center gap-3 border-l border-line pl-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
                <Icon name="scalpel" size={20} />
              </span>
              <span>
                <span className="block font-display text-[1.5rem] leading-none font-extrabold text-primary">
                  {doctors.length}+
                </span>
                <span className="mt-1 block text-[0.8125rem] text-muted">
                  Super-Specialists
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="relative isolate bg-white pb-14">
        <div className="shell">
          <DepartmentsExplorer />
        </div>
      </section>

      <section className="relative isolate bg-lavender py-12 lg:py-14">
        <div className="shell">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Full Clinical Roster</p>
            <h2 className="mt-2 text-[1.625rem] leading-tight font-extrabold sm:text-[2rem]">
              All Specialities at Sonari
            </h2>
            <EkgLine className="mx-auto mt-2" width={110} />
            <p className="mt-3 text-[0.9375rem] text-muted">
              All {clinicalDirectory.length} specialities and diagnostic services available
              at the Kagal Nagar campus. Select one to open its department page.
            </p>
          </div>

          <ul
            className="card-row card-row--base-2 card-row--sm-3 card-row--lg-4 mt-9 gap-2.5"
            style={{ "--row-gap": "0.625rem" } as React.CSSProperties}
          >
            {clinicalDirectory.map((item, i) => {
              const inner = (
                <>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(47,59,128,.07)] text-primary">
                    <Icon name="stethoscope" size={15} />
                  </span>
                  <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug font-semibold text-ink">
                    {item.name}
                  </span>
                  {item.badge ? (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-extrabold tracking-wide ${
                        item.badge === "New"
                          ? "bg-[rgba(15,157,110,.1)] text-success"
                          : "bg-[rgba(190,53,58,.08)] text-secondary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </>
              );
              const cls =
                "flex h-full items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-3 transition-all duration-200";
              return (
                <li
                  key={item.name}
                  data-reveal="zoom"
                  style={{ "--reveal-delay": `${Math.min(i * 35, 320)}ms` } as React.CSSProperties}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`${cls} hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative isolate bg-tint-soft-grad py-12 lg:py-14">
        <div className="shell grid gap-4 lg:grid-cols-2">
          <div
            data-reveal="left"
            className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.09)] px-3 py-1.5 text-[0.75rem] font-bold text-success">
              <ShieldCheck size={14} />
              TPA &amp; Insurance Helpdesk
            </p>
            <h2 className="mt-4 text-[1.375rem] leading-tight font-extrabold sm:text-[1.625rem]">
              Cashless Hospitalization &amp; Insurance Approval
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Brahmanandam Hospital is empanelled with major TPAs and private
              health insurers. Our dedicated insurance facilitation cell processes
              queries and admission pre-authorizations seamlessly.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {tpaPartners.slice(0, 6).map((name) => (
                <li
                  key={name}
                  className="rounded-lg bg-[rgba(47,59,128,.05)] px-3 py-2.5 text-center text-[0.8125rem] font-semibold text-muted"
                >
                  {name}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-[0.875rem] text-muted">
                TPA Cell Extension: <strong className="text-ink">Ext 104</strong>{" "}
                (Ground Floor)
              </p>
              <Link
                to="/insurance"
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-bold text-secondary hover:underline"
              >
                Check Full Empanelled List
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          <div
            data-reveal="right"
            className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-3 py-1.5 text-[0.75rem] font-bold text-primary">
              <MapPinned size={14} />
              Campus Wayfinding
            </p>
            <h2 className="mt-4 text-[1.375rem] leading-tight font-extrabold sm:text-[1.625rem]">
              OPD Registration &amp; Consultation Counters
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              All OPD consultations, token issuance, and specialty consultation
              chambers are centrally organized for minimal patient transit.
            </p>
            <ul className="mt-5 grid gap-2.5">
              {campusWayfinding.map((item, i) => (
                <li
                  key={item.title}
                  className="rounded-xl bg-[rgba(47,59,128,.05)] p-4"
                >
                  <p className="flex items-start gap-2 text-[0.9375rem] font-bold text-primary">
                    <Icon
                      name={i === 0 ? "clipboard-check" : "scan"}
                      size={16}
                      className="mt-0.5 shrink-0 text-secondary"
                    />
                    {item.title}
                  </p>
                  <p className="mt-1 pl-6 text-[0.875rem] leading-relaxed text-ink">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-[0.8125rem] text-muted">{site.address.full}</p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-bold text-primary hover:text-secondary"
              >
                Get Campus Directions
                <Navigation size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
