import { Link } from "react-router-dom";
import { CalendarCheck, Clock } from "lucide-react";
import type { Doctor } from "@/lib/data/doctors";
import { DoctorAvatar } from "./DoctorAvatar";

export function DoctorCard({
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
        <DoctorAvatar doctor={doctor} size={76} className="h-19 w-19" />
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-[rgba(190,53,58,.07)] px-2.5 py-1 text-[0.6875rem] font-bold text-secondary">
            {doctor.roleLabel}
          </span>
          <h3 className="mt-1.5 truncate text-[1.125rem] font-extrabold">
            {doctor.name}
          </h3>
          {doctor.qualification ? (
            <p className="mt-0.5 line-clamp-2 text-[0.8125rem] text-muted">
              {doctor.qualification}
            </p>
          ) : (
            <p className="mt-0.5 text-[0.8125rem] text-muted">
              {doctor.specialtyLabel}
            </p>
          )}
          {doctor.onCall ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-secondary">
              <Clock size={14} strokeWidth={2.1} />
              Available on call
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[rgba(47,59,128,.05)] px-3.5 py-2.5">
        <span className="shrink-0 text-[0.8125rem] text-muted">OPD:</span>
        <span className="text-right text-[0.8125rem] font-bold text-primary">
          {doctor.opdShort}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2.5 pt-4">
        <Link
          to={`/doctors/${doctor.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[rgba(47,59,128,.06)] text-[0.8125rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
        >
          VIEW PROFILE
        </Link>
        <Link
          to={`/appointment?doctor=${doctor.slug}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-secondary text-[0.8125rem] font-bold text-white transition-colors hover:bg-secondary-700"
        >
          BOOK SLOT
          <CalendarCheck size={15} strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  );
}
