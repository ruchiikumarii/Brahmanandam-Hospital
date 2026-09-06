import Image from "@/components/ui/Img";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CircleCheck, Clock, Phone, Stethoscope } from "lucide-react";
import { getDepartment } from "@/lib/data/departments";
import { doctorsByDepartment, getDoctor } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { DoctorDirectoryCard } from "@/components/cards/DoctorDirectoryCard";
import { Icon } from "@/components/ui/Icon";
import { EkgLine } from "@/components/ui";
import { Seo, departmentSchema } from "@/components/Seo";
import NotFoundPage from "@/pages/NotFound";

export default function DepartmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dept = slug ? getDepartment(slug) : undefined;
  if (!dept) return <NotFoundPage />;

  const deptDoctors = doctorsByDepartment(dept.slug);
  const lead = dept.lead.doctorSlug ? getDoctor(dept.lead.doctorSlug) : undefined;

  return (
    <>
      <Seo
        crumbs={[
          { label: "Departments", href: "/departments" },
          { label: dept.shortName },
        ]}
        schema={departmentSchema(dept)}
        title={dept.name}
        description={`${dept.summary} ${dept.name} at Brahmanandam Hospital, Sonari, Jamshedpur.`}
      />

      <section className="relative isolate overflow-hidden bg-tint-soft-grad pb-10 lg:pb-12">
        <Breadcrumbs
        items={[
        { label: "Departments", href: "/departments" },
        { label: dept.shortName },
        ]}
        right={
        <span className="flex items-center gap-2 font-semibold text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {dept.badge}
        </span>
        }
        />
        <div className="shell relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-3.5 py-2 text-[0.6875rem] font-extrabold tracking-[0.1em] text-primary uppercase">
              <Icon name={dept.icon} size={14} className="text-secondary" />
              Centre of Clinical Excellence
            </p>
            <h1 className="mt-4 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
              {dept.name}
            </h1>
            <EkgLine className="mt-3" width={170} />
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-muted sm:text-base">
              {dept.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={
                  dept.primaryAction.href.startsWith("tel:")
                    ? "/appointment"
                    : dept.primaryAction.href
                }
                className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
              >
                Book Department OPD
                <ArrowRight size={16} strokeWidth={2.3} />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-6 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.04)]"
              >
                <Phone size={15} className="text-secondary" />
                {site.phone}
              </a>
            </div>
          </div>

          <div className="rounded-[1.125rem] border border-line bg-white p-6 shadow-card lg:justify-self-end">
            <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
              OPD &amp; Availability
            </p>
            <dl className="mt-4 grid gap-3">
              {dept.opd.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-[0.8125rem] text-muted">{row.label}</dt>
                  <dd className="text-right text-[0.875rem] font-bold text-primary">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="grid gap-6">
            <div
              data-reveal
              className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
            >
              <h2 className="flex items-center gap-3 text-[1.375rem] font-extrabold">
                <span className="h-6 w-[3px] rounded-full bg-secondary" />
                Department Overview
              </h2>
              <div className="mt-5 grid gap-4 text-[0.9375rem] leading-[1.8] text-muted">
                {dept.overview.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>

            <div
              data-reveal
              className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
            >
              <h2 className="flex items-center gap-3 text-[1.375rem] font-extrabold">
                <span className="h-6 w-[3px] rounded-full bg-secondary" />
                Procedures &amp; Clinical Services
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {dept.procedures.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl bg-[rgba(47,59,128,.04)] px-4 py-3 text-[0.875rem] text-ink"
                  >
                    <CircleCheck size={16} className="mt-0.5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal
              className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
            >
              <h2 className="flex items-center gap-3 text-[1.375rem] font-extrabold">
                <span className="h-6 w-[3px] rounded-full bg-secondary" />
                Infrastructure &amp; Equipment
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {dept.equipment.map((eq) => (
                  <li key={eq.title} className="rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                    <h3 className="text-[0.9375rem] font-bold">{eq.title}</h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                      {eq.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {deptDoctors.length ? (
              <div>
                <h2 className="flex items-center gap-3 text-[1.375rem] font-extrabold">
                  <span className="h-6 w-[3px] rounded-full bg-secondary" />
                  Consultants in this Department
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {deptDoctors.map((d) => (
                    <DoctorDirectoryCard key={d.slug} doctor={d} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside data-reveal="right" className="grid gap-4 lg:sticky lg:top-[6.5rem]">
            <div className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
              <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                {dept.lead.label}
              </p>
              {lead ? (
                <>
                  <div className="mt-3 flex items-center gap-3">
                    <Image
                      src={lead.photo}
                      alt={lead.name}
                      width={140}
                      height={140}
                      sizes="60px"
                      className="h-15 w-15 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block text-[1rem] font-extrabold text-primary">
                        {lead.name}
                      </span>
                      <span className="block text-[0.8125rem] text-muted">
                        {dept.lead.meta}
                      </span>
                    </span>
                  </div>
                  <Link
                    to={`/doctors/${lead.slug}`}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
                  >
                    <Stethoscope size={15} />
                    View Full Profile
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-3 text-[1.0625rem] font-extrabold text-primary">
                    {dept.lead.name}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-muted">{dept.lead.meta}</p>
                </>
              )}
              <Link
                to={`/appointment?department=${dept.slug}`}
                className="mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
              >
                Book Department OPD
                <ArrowRight size={16} strokeWidth={2.3} />
              </Link>
            </div>

            <div className="rounded-[1.25rem] bg-primary p-5 text-white">
              <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.09em] text-white/70 uppercase">
                <Clock size={14} className="text-secondary-400" />
                Round-the-clock support
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/80">
                Emergency, ICU, diagnostics and pharmacy operate 24×7 at the
                Sonari campus. Call our helpline for immediate assistance.
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
              >
                <Phone size={15} />
                {site.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <EmergencyBanner />
    </>
  );
}
