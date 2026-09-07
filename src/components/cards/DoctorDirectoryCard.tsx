import { Link } from "react-router-dom";
import { CalendarDays, DoorClosed, Phone } from "lucide-react";
import type { Doctor } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import { DoctorAvatar } from "./DoctorAvatar";

export function DoctorDirectoryCard({
  doctor,
  style,
}: {
  doctor: Doctor;
  style?: React.CSSProperties;
}) {
  return (
    <article
      data-reveal
      style={style}
      className="flex h-full flex-col rounded-[1.125rem] border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex gap-4">
        <div className="relative shrink-0 self-start">
          <DoctorAvatar
            doctor={doctor}
            size={84}
            rounded="rounded-2xl"
            className="h-[5.25rem] w-[5.25rem]"
          />
          {!doctor.onCall ? (
            <span
              className="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-[2.5px] border-white bg-success"
              title="Regular OPD hours"
              aria-label="Regular OPD hours"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-[rgba(47,59,128,.07)] px-2.5 py-1 text-[0.6875rem] font-extrabold tracking-[0.06em] text-primary uppercase">
            {doctor.specialty}
          </span>
          <h3 className="mt-1.5 text-[1.1875rem] leading-tight font-extrabold">
            <Link to={`/doctors/${doctor.slug}`} className="hover:text-secondary">
              {doctor.name}
            </Link>
          </h3>
          {doctor.qualification ? (
            <p className="mt-1 text-[0.8125rem] text-muted">{doctor.qualification}</p>
          ) : null}
          <p className="mt-1 text-[0.8125rem] font-semibold text-secondary">
            {doctor.designation}
          </p>
        </div>
      </div>

      {doctor.credentials?.length ? (
        <ul className="mt-4 grid gap-1.5 rounded-xl bg-[rgba(47,59,128,.05)] px-3.5 py-2.5">
          {doctor.credentials.map((c) => (
            <li key={c} className="text-[0.75rem] leading-snug text-muted">
              {c}
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-4 grid gap-2.5 text-[0.8125rem]">
        <div className="flex gap-2.5">
          <dt className="sr-only">OPD days and timing</dt>
          <CalendarDays size={15} className="mt-0.5 shrink-0 text-primary" />
          <dd>
            <span className="font-bold text-primary">{doctor.daysLabel}</span>
            <span className="mt-0.5 block text-muted">{doctor.opdTiming}</span>
          </dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Chamber</dt>
          <DoorClosed size={15} className="mt-0.5 shrink-0 text-primary" />
          <dd className="text-muted">
            Chamber:{" "}
            <strong className="font-bold text-primary">{doctor.opdRoom}</strong>
          </dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Consultation fee</dt>
          <Phone size={15} className="mt-0.5 shrink-0 text-primary" />
          <dd className="text-muted">
            Consultation fee:{" "}
            <a
              href={site.phoneHref}
              className="font-bold text-primary hover:text-secondary"
            >
              call {site.phone}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-5">
        <Link
          to={`/appointment?doctor=${doctor.slug}`}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-secondary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
        >
          Book Consultation
        </Link>
        <Link
          to={`/doctors/${doctor.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-[0.875rem] font-bold text-primary transition-colors hover:border-primary/40 hover:bg-[rgba(47,59,128,.04)]"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}
