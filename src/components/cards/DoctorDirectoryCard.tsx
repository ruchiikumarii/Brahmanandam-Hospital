import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import type { Doctor } from "@/lib/data/doctors";
import { DoctorAvatar } from "./DoctorAvatar";

/**
 * A timing that only says "ask at reception" tells the reader nothing the days
 * line has not already said, so it is left out rather than printed as filler.
 */
const isPlaceholderTiming = (timing: string) =>
  /please confirm with reception/i.test(timing);

/**
 * Every card is the same height by construction, not by luck: each slot reserves
 * the space for its longest case and clamps beyond it.
 *
 * The qualification and the Ex-Consultant lines share one clamped line, because
 * only six of the thirty-two doctors have either. Given a slot of their own they
 * would have left a two-line hole in the other twenty-six cards, since equal
 * heights mean every card pays for the tallest one. The full list is on the
 * doctor's own page, which the card links to twice.
 */
export function DoctorDirectoryCard({
  doctor,
  style,
}: {
  doctor: Doctor;
  style?: React.CSSProperties;
}) {
  const timing = isPlaceholderTiming(doctor.opdTiming) ? null : doctor.opdTiming;
  const detail = [doctor.qualification, ...(doctor.credentials ?? [])]
    .filter(Boolean)
    .join(" · ");

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

        <div className="min-w-0 flex-1">
          <span className="inline-block max-w-full truncate rounded-full bg-[rgba(47,59,128,.07)] px-2.5 py-1 text-[0.6875rem] font-extrabold tracking-[0.06em] text-primary uppercase">
            {doctor.specialty}
          </span>
          <h3 className="mt-1.5 line-clamp-2 min-h-[2.4em] text-[1.0625rem] leading-[1.2] font-extrabold">
            <Link to={`/doctors/${doctor.slug}`} className="hover:text-secondary">
              {doctor.name}
            </Link>
          </h3>
          {/* The badge above already names the speciality, so this says the
              consultant's role instead of repeating it. */}
          <p className="mt-1 line-clamp-2 min-h-[2.6em] text-[0.8125rem] leading-[1.3] font-semibold text-secondary">
            {doctor.designation}
          </p>
        </div>
      </div>

      <p
        title={detail ?? undefined}
        className="mt-1.5 line-clamp-1 min-h-[1.3em] text-[0.75rem] leading-[1.3] text-muted"
      >
        {detail}
      </p>

      <dl className="mt-3 flex min-h-[2.6rem] gap-2.5 text-[0.8125rem]">
        <dt className="sr-only">OPD days and timing</dt>
        <CalendarDays size={15} className="mt-0.5 shrink-0 text-primary" />
        <dd className="min-w-0">
          <span className="block font-bold text-primary">{doctor.daysLabel}</span>
          {timing ? (
            <span className="mt-0.5 line-clamp-1 text-muted">{timing}</span>
          ) : null}
        </dd>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-4">
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
