import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock,
  DoorOpen,
  ExternalLink,
  Phone,
  Stethoscope,
} from "lucide-react";
import { doctors, doctorsByDepartment, getDoctor } from "@/lib/data/doctors";
import { getDepartment } from "@/lib/data/departments";
import { site } from "@/lib/data/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { DoctorAvatar } from "@/components/cards/DoctorAvatar";
import { Seo, physicianSchema } from "@/components/Seo";
import NotFoundPage from "@/pages/NotFound";
import { EkgLine } from "@/components/ui";

export default function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = slug ? getDoctor(slug) : undefined;
  if (!doctor) return <NotFoundPage />;

  const department = getDepartment(doctor.departmentSlug);
  const colleagues = doctorsByDepartment(doctor.departmentSlug).filter(
    (d) => d.slug !== doctor.slug,
  );
  const others = (colleagues.length ? colleagues : doctors).slice(0, 4);

  return (
    <>
      <Seo
        crumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: doctor.specialtyLabel, href: "/doctors" },
          { label: doctor.name },
        ]}
        schema={physicianSchema(doctor)}
        title={`${doctor.name} - ${doctor.designation}`}
        description={`${doctor.name}, ${doctor.designation} at Brahmanandam Hospital, Sonari, Jamshedpur. OPD ${doctor.daysLabel}, ${doctor.opdTiming}. Book a consultation or call ${site.phone}.`}
      />

      <div className="relative isolate bg-tint-soft-grad pb-14">
        <Breadcrumbs
          items={[
            { label: "Doctors", href: "/doctors" },
            { label: doctor.specialtyLabel, href: "/doctors" },
            { label: doctor.name },
          ]}
          right={
            <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.09)] px-3 py-1.5 text-[0.75rem] font-bold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {doctor.onCall ? "Available on call" : "Regular OPD"}
            </span>
          }
        />

        <div className="shell">
          {/* ------------------------------------------------ Header card */}
          <div
            data-reveal
            className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-7"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <DoctorAvatar
                  doctor={doctor}
                  size={168}
                  rounded="rounded-2xl"
                  className="h-40 w-40 shrink-0 self-start sm:h-42 sm:w-42"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[rgba(47,59,128,.07)] px-3 py-1.5 text-[0.75rem] font-bold text-primary">
                      {doctor.specialtyLabel}
                    </span>
                    <span className="rounded-full bg-[rgba(190,53,58,.07)] px-3 py-1.5 text-[0.75rem] font-bold text-secondary">
                      {doctor.opdRoom}
                    </span>
                  </div>

                  <h1 className="mt-3 text-[1.875rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.25rem]">
                    {doctor.name}
                  </h1>
                  {doctor.qualification ? (
                    <p className="mt-2 text-[0.9375rem] font-bold text-secondary">
                      {doctor.qualification}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[0.9375rem] font-semibold text-ink">
                    {doctor.designation}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-[0.875rem] text-muted">
                    <Building2 size={15} className="text-primary" />
                    Brahmanandam Hospital, Sonari, Jamshedpur
                  </p>

                  {doctor.credentials?.length ? (
                    <ul className="mt-4 grid gap-2 border-t border-line pt-4">
                      {doctor.credentials.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2.5 text-[0.875rem] text-muted"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              {/* Booking rail */}
              <aside className="rounded-[1.125rem] bg-[rgba(47,59,128,.05)] p-5">
                <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                  Book a Consultation
                </p>
                <EkgLine className="mt-2" width={120} />

                <dl className="mt-4 grid gap-3">
                  <div>
                    <dt className="text-[0.75rem] text-muted">OPD days</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-bold text-primary">
                      {doctor.daysLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.75rem] text-muted">Consulting hours</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-semibold text-ink">
                      {doctor.opdTiming}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.75rem] text-muted">Chamber</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-semibold text-ink">
                      {doctor.opdRoom}
                    </dd>
                  </div>
                </dl>

                <Link
                  to={`/appointment?doctor=${doctor.slug}`}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-[0.9375rem] font-bold text-white transition-colors hover:bg-secondary-700"
                >
                  Book Appointment
                  <ArrowRight size={17} strokeWidth={2.3} />
                </Link>
                <a
                  href={site.phoneHref}
                  className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[0.875rem] font-bold text-primary transition-colors hover:bg-white/70"
                >
                  <Phone size={15} className="text-secondary" />
                  {site.phone}
                </a>
                <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-muted">
                  Timings may change. Please confirm with hospital reception.
                </p>
              </aside>
            </div>
          </div>

          {/* ------------------------------------------------- OPD schedule */}
          <section
            data-reveal
            className="mt-6 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-7"
          >
            <h2 className="flex items-center gap-3 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
              <span className="h-6 w-[3px] rounded-full bg-secondary" />
              OPD Schedule
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.07em] text-primary uppercase">
                  <CalendarDays size={14} className="text-secondary" />
                  Days
                </p>
                <p className="mt-2 text-[1rem] font-extrabold text-ink">
                  {doctor.daysLabel}
                </p>
              </div>
              <div className="rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.07em] text-primary uppercase">
                  <Clock size={14} className="text-secondary" />
                  Timing
                </p>
                <p className="mt-2 text-[0.9375rem] leading-snug font-bold text-ink">
                  {doctor.opdTiming}
                </p>
              </div>
              <div className="rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.07em] text-primary uppercase">
                  <DoorOpen size={14} className="text-secondary" />
                  Chamber
                </p>
                <p className="mt-2 text-[0.9375rem] leading-snug font-bold text-ink">
                  {doctor.opdRoom}
                </p>
              </div>
            </div>

            {department ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <p className="flex items-center gap-2 text-[0.875rem] text-muted">
                  <Stethoscope size={16} className="text-primary" />
                  Department:{" "}
                  <Link
                    to={`/departments/${department.slug}`}
                    className="font-bold text-primary hover:text-secondary"
                  >
                    {department.name}
                  </Link>
                </p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[0.875rem] font-bold text-secondary hover:underline"
                >
                  Hospital location
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : null}
          </section>

          {/* --------------------------------------------- Other consultants */}
          {others.length ? (
            <section data-reveal className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[1.25rem] font-extrabold">
                  {colleagues.length
                    ? `Other consultants in ${department?.shortName ?? doctor.specialtyLabel}`
                    : "Other specialists at Sonari"}
                </h2>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 text-[0.875rem] font-bold text-primary hover:text-secondary"
                >
                  View all doctors <ArrowRight size={15} />
                </Link>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {others.map((d) => (
                  <li key={d.slug}>
                    <Link
                      to={`/doctors/${d.slug}`}
                      className="flex h-full items-center gap-3 rounded-xl border border-line bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <DoctorAvatar doctor={d} size={52} className="h-13 w-13" />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] font-bold text-primary">
                          {d.name}
                        </span>
                        <span className="block truncate text-[0.75rem] text-muted">
                          {d.roleLabel}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <EmergencyBanner />
    </>
  );
}
