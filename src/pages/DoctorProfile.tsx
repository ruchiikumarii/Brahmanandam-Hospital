import Image from "@/components/ui/Img";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Asterisk,
  BadgeCheck,
  Building2,
  CalendarClock,
  CircleCheck,
  Clock,
  DoorOpen,
  ExternalLink,
  Phone,
  Sparkles,
} from "lucide-react";
import { doctors, getDoctor } from "@/lib/data/doctors";
import { getDepartment } from "@/lib/data/departments";
import { site } from "@/lib/data/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProfileBookingCard } from "@/components/doctors/ProfileBookingCard";
import { Icon } from "@/components/ui/Icon";
import { Stars, cn } from "@/components/ui";
import { Seo, physicianSchema } from "@/components/Seo";
import NotFoundPage from "@/pages/NotFound";

function SectionCard({
  title,
  meta,
  children,
  id,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-reveal
      className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
          <span className="h-6 w-[3px] rounded-full bg-secondary" />
          {title}
        </h2>
        {meta ? <div className="text-[0.8125rem] text-muted">{meta}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = slug ? getDoctor(slug) : undefined;
  if (!doctor) return <NotFoundPage />;

  const photo = doctor.profilePhoto ?? doctor.photo;
  const department = getDepartment(doctor.departmentSlug);

  return (
    <>
      <Seo
        crumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: doctor.specialtyLabel, href: "/doctors" },
          { label: doctor.name },
        ]}
        image={doctor.photo}
        schema={physicianSchema(doctor)}
        title={`${doctor.name} — ${doctor.headline}`}
        description={`${doctor.name}, ${doctor.qualification}. ${doctor.designation} at Brahmanandam Hospital, Sonari, Jamshedpur. OPD ${doctor.daysLabel}, ${doctor.opdTiming}. Book a consultation online.`}
      />

      <div className="relative isolate bg-tint-soft-grad pb-14">
        <Breadcrumbs
        items={[
        { label: "Doctors", href: "/doctors" },
        { label: doctor.specialtyLabel, href: "/doctors" },
        { label: doctor.name },
        ]}
        right={
        <>
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.09)] px-3 py-1.5 text-[0.75rem] font-bold text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        OPD In-Chamber Today
        </span>
        <span className="text-muted">
        Sonari Unit • {doctor.chamber.split(",")[0]}
        </span>
        </>
        }
        />
        <div className="shell">
          {/* -------------------------------------------------- Header card */}
          <div
            data-reveal
            className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-7"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative shrink-0 self-start">
                  <Image
                    src={photo}
                    alt={`${doctor.name}, ${doctor.designation}`}
                    width={720}
                    height={727}
                    priority
                    sizes="(max-width: 639px) 100vw, 210px"
                    className="h-[15.5rem] w-full rounded-2xl object-cover object-top sm:h-[15.5rem] sm:w-[13.125rem]"
                  />
                  <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[0.6875rem] font-bold whitespace-nowrap text-white shadow-lg">
                    <BadgeCheck size={13} className="text-[#5ee3ab]" />
                    Senior Board Verified
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[rgba(47,59,128,.07)] px-3 py-1.5 text-[0.75rem] font-bold text-primary">
                      {department?.name ?? doctor.specialtyLabel}
                    </span>
                    <span className="rounded-full bg-[rgba(190,53,58,.07)] px-3 py-1.5 text-[0.75rem] font-bold text-secondary">
                      {doctor.chamber.replace(",", " •")}
                    </span>
                  </div>

                  <h1 className="mt-3 text-[1.875rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.25rem]">
                    {doctor.name}
                  </h1>
                  <p className="mt-2 text-[0.9375rem] font-bold text-secondary">
                    {doctor.qualification}
                  </p>
                  <p className="mt-1 text-[0.9375rem] font-semibold text-ink">
                    {doctor.designation}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-[0.875rem] text-muted">
                    <Building2 size={15} className="text-primary" />
                    Brahmanandam Multi Specialty Centre, Sonari, Jamshedpur
                  </p>

                  <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5 sm:gap-4">
                    {doctor.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="sr-only">{metric.label}</dt>
                        <dd>
                          <span
                            className={cn(
                              "font-display text-[1.125rem] leading-none font-extrabold sm:text-[1.375rem]",
                              metric.tone === "secondary"
                                ? "text-secondary"
                                : "text-primary",
                            )}
                          >
                            {metric.value}
                          </span>
                          <span className="mt-1 block text-[0.8125rem] text-muted">
                            {metric.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
                    <span className="flex items-center gap-2">
                      <Stars rating={doctor.rating} size={15} />
                      <strong className="font-display text-[1.0625rem] font-extrabold text-ink">
                        {doctor.rating}
                      </strong>
                      <span className="text-[0.875rem] text-muted">
                        ({doctor.reviews} reviews)
                      </span>
                    </span>
                  </div>

                  <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem]">
                    <li className="text-[0.75rem] font-extrabold tracking-[0.04em] text-secondary uppercase">
                      Top rated in Sonari &amp; Kadma
                    </li>
                    {doctor.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-1.5 text-muted">
                        <CircleCheck size={14} className="text-success" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fee panel */}
              <aside className="rounded-[1.125rem] bg-[rgba(47,59,128,.05)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.6875rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                    Consultation Fee
                  </p>
                  <span className="rounded-full bg-[rgba(15,157,110,.1)] px-2.5 py-1 text-[0.6875rem] font-bold text-success">
                    Valid 7 Days
                  </span>
                </div>
                <a
                  href={site.phoneHref}
                  className="mt-3 flex items-center gap-2 font-display text-[1.5rem] leading-none font-extrabold text-primary hover:text-secondary"
                >
                  <Phone size={19} className="text-secondary" />
                  {site.phone}
                </a>
                <p className="mt-2 text-[0.875rem] text-muted">
                  Call the OPD desk for the current consultation fee.
                </p>

                <div className="mt-4 rounded-xl border border-[rgba(190,53,58,.18)] bg-white p-3.5">
                  <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-secondary">
                    <Clock size={14} />
                    Next Slot Available:
                  </p>
                  <p className="mt-1 text-[1.0625rem] font-extrabold text-primary">
                    {doctor.nextSlot}
                  </p>
                </div>

                <Link
                  to={`/appointment?doctor=${doctor.slug}`}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-[0.9375rem] font-bold text-white transition-colors hover:bg-secondary-700"
                >
                  Book Consultation
                  <ArrowRight size={17} strokeWidth={2.3} />
                </Link>
                <a
                  href={site.phoneHref}
                  className="mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[0.875rem] font-bold text-primary transition-colors hover:bg-white/70"
                >
                  <Phone size={15} className="text-secondary" />
                  Emergency OPD: {site.phone}
                </a>
              </aside>
            </div>
          </div>

          {/* --------------------------------------------- Body + sticky rail */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22.5rem] lg:items-start">
            <div className="grid gap-6">
              <SectionCard title={`About ${doctor.name}`}>
                <div className="grid gap-4 text-[0.9375rem] leading-[1.8] text-muted">
                  {doctor.about.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {doctor.highlights.map((h, i) => (
                    <li
                      key={h.title}
                      className="rounded-xl bg-[rgba(47,59,128,.05)] p-4"
                    >
                      <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                        <Icon
                          name={
                            ["heart-pulse", "siren", "shield-check"][i % 3]
                          }
                          size={16}
                          className="text-secondary"
                        />
                        {h.title}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                        {h.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard
                title="Areas of Clinical Expertise"
                meta={<span>{doctor.specialtyLabel} Practice</span>}
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {doctor.expertise.map((item) => (
                    <li
                      key={item.title}
                      className="rounded-xl bg-[rgba(47,59,128,.04)] p-4 transition-colors hover:bg-[rgba(47,59,128,.07)]"
                    >
                      <h3 className="flex items-start gap-2 text-[0.9375rem] font-bold">
                        <Sparkles size={15} className="mt-0.5 shrink-0 text-secondary" />
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Academic Background &amp; Fellowships">
                <ul className="grid gap-5">
                  {doctor.education.map((item) => (
                    <li key={item.degree} className="flex gap-4">
                      <span
                        className={cn(
                          "grid h-11 w-11 shrink-0 place-items-center rounded-full text-[0.625rem] font-extrabold",
                          item.accent
                            ? "bg-[rgba(190,53,58,.08)] text-secondary"
                            : "bg-[rgba(47,59,128,.07)] text-primary",
                        )}
                      >
                        {item.code}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[1rem] font-extrabold">{item.degree}</h3>
                        <p
                          className={cn(
                            "mt-0.5 text-[0.875rem] font-semibold",
                            item.accent ? "text-secondary" : "text-primary",
                          )}
                        >
                          {item.institute}
                        </p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-muted">
                          {item.note}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard
                title="OPD Schedule &amp; Consult Chambers"
                meta={
                  <span className="flex items-center gap-2 font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Verified Today
                  </span>
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[rgba(47,59,128,.04)] px-4 py-3.5">
                  <p className="flex items-start gap-3">
                    <DoorOpen size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="block text-[0.9375rem] font-bold text-primary">
                        {doctor.chamberShort}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] text-muted">
                        OPD Block A, Brahmanandam Multi Specialty Centre, Sonari
                      </span>
                    </span>
                  </p>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-[0.875rem] font-bold text-secondary hover:underline"
                  >
                    View Map
                    <ExternalLink size={14} />
                  </a>
                </div>

                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {doctor.schedule.map((s) => (
                    <li
                      key={s.label}
                      className={cn(
                        "rounded-xl p-4",
                        s.tone === "secondary"
                          ? "bg-blush"
                          : "bg-[rgba(47,59,128,.05)]",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[0.6875rem] font-extrabold tracking-[0.07em] uppercase",
                          s.tone === "secondary" ? "text-secondary" : "text-primary",
                        )}
                      >
                        {s.label}
                      </p>
                      <p className="mt-2 text-[1.0625rem] leading-tight font-extrabold text-ink">
                        {s.time}
                      </p>
                      <p className="mt-1 text-[0.8125rem] text-muted">{s.days}</p>
                      <span
                        className={cn(
                          "mt-3 inline-block rounded-md px-2.5 py-1 text-[0.6875rem] font-bold",
                          s.tone === "secondary"
                            ? "bg-secondary text-white"
                            : s.tone === "primary"
                              ? "bg-white text-primary"
                              : "bg-[rgba(47,59,128,.12)] text-primary",
                        )}
                      >
                        {s.badge}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard
                title="Patient Testimonials"
                meta={<span>Verified Jamshedpur Patients</span>}
              >
                <ul className="grid gap-4 sm:grid-cols-2">
                  {doctor.testimonials.map((t) => (
                    <li
                      key={t.name}
                      className="rounded-xl bg-[rgba(47,59,128,.04)] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Stars rating={5} size={13} />
                        <span className="text-[0.75rem] text-muted">{t.when}</span>
                      </div>
                      <blockquote className="mt-3 text-[0.875rem] leading-[1.75] text-ink italic">
                        &ldquo;{t.text}&rdquo;
                      </blockquote>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[0.75rem] font-bold text-white">
                          {t.initials}
                        </span>
                        <span>
                          <span className="block text-[0.9375rem] font-bold text-primary">
                            {t.name}
                          </span>
                          <span className="block text-[0.75rem] text-muted">
                            {t.location}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* Emergency / critical care */}
              <section
                data-reveal="zoom"
                className="relative overflow-hidden rounded-[1.25rem] p-6 sm:p-8"
                style={{
                  background:
                    "radial-gradient(600px 340px at 92% 110%, rgba(190,53,58,.34), transparent 62%), linear-gradient(112deg,#2f3b80,#333f8c)",
                }}
              >
                <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <span className="inline-block rounded-md bg-white/12 px-2.5 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-white uppercase">
                      Inpatient &amp; Critical Emergency Care
                    </span>
                    <h2 className="mt-3 text-[1.375rem] leading-tight font-extrabold !text-white sm:text-[1.625rem]">
                      {doctor.emergency.title}
                    </h2>
                    <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-white/75">
                      {doctor.emergency.text}
                    </p>
                  </div>
                  <a
                    href={site.phoneHref}
                    className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full bg-secondary px-6 text-[0.9375rem] font-extrabold whitespace-nowrap text-white transition-colors hover:bg-secondary-700"
                  >
                    <Asterisk size={18} strokeWidth={2.6} />
                    {doctor.emergency.cta}: {site.phone}
                  </a>
                </div>
              </section>
            </div>

            {/* Sticky booking rail */}
            <div data-reveal="right" className="lg:sticky lg:top-[6.5rem]">
              <ProfileBookingCard doctor={doctor} />
            </div>
          </div>

          {/* Other specialists */}
          <section data-reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-[1.25rem] font-extrabold">
                <CalendarClock size={20} className="text-secondary" />
                Other Specialists at Sonari
              </h2>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 text-[0.875rem] font-bold text-primary hover:text-secondary"
              >
                View full registry <ArrowRight size={15} />
              </Link>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {doctors
                .filter((d) => d.slug !== doctor.slug)
                .slice(0, 4)
                .map((d) => (
                  <li key={d.slug}>
                    <Link
                      to={`/doctors/${d.slug}`}
                      className="flex h-full items-center gap-3 rounded-xl border border-line bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <Image
                        src={d.photo}
                        alt=""
                        width={120}
                        height={120}
                        sizes="52px"
                        className="h-13 w-13 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] font-bold text-primary">
                          {d.name}
                        </span>
                        <span className="block truncate text-[0.75rem] text-muted">
                          {d.specialtyLabel}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
