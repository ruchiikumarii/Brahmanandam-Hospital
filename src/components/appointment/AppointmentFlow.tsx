import Image from "@/components/ui/Img";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  CreditCard,
  DoorOpen,
  Hourglass,
  MessageSquareText,
  Phone,
  Pill,
  ShieldCheck,
  Siren,
  Sunrise,
  Sunset,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";
import { departments, getDepartment } from "@/lib/data/departments";
import { doctors, getDoctor } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import {
  buildCalendar,
  genders,
  isSlotAvailable,
  firstBookableDay,
  monthKeysOf,
  opdSessions,
  visitCategories,
} from "@/lib/slots";
import {
  buildReference,
  buildToken,
  useAppointment,
} from "@/lib/appointment-context";
import { saveAppointment } from "@/lib/appointments";
import { AppointmentStepper } from "./Stepper";
import { Icon } from "@/components/ui/Icon";
import { EkgLine, cn } from "@/components/ui";

const bookableDepartments = departments.filter(
  (d) => !["emergency-trauma-care", "icu-critical-care"].includes(d.slug),
);

const assurances = [
  { icon: CircleCheck, text: "No advance online payment required", tone: "text-success" },
  { icon: XCircle, text: "100% Free Cancellation before chamber", tone: "text-success" },
  { icon: Zap, text: "Instant Digital Pass & OPD Token", tone: "text-secondary" },
];

const perks = [
  {
    icon: "activity",
    title: "Same-Day Diagnostics",
    text: "ECG, 2D-Echo, Blood Profiles ready in 45m",
  },
  {
    icon: "pill",
    title: "In-House Pharmacy",
    text: "Ground Floor 24×7 Medicine Counter",
  },
  {
    icon: "person-standing",
    title: "Senior Citizen Priority",
    text: "Elevator & Wheelchair assistance at gate",
  },
];

export function AppointmentFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draft, setDraft, confirmBooking, hydrated } = useAppointment();

  const calendar = useMemo(() => buildCalendar(45), []);
  const months = useMemo(() => monthKeysOf(calendar).slice(0, 2), [calendar]);
  const firstOpen = useMemo(() => firstBookableDay(calendar), [calendar]);

  const [step, setStep] = useState(1);
  const [month, setMonth] = useState(months[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seeded, setSeeded] = useState(false);
  const bootstrapped = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Deep-link params (?doctor=…&department=…&step=…) read once, on first render. */
  const [urlSeed] = useState(() => ({
    doctor: searchParams.get("doctor") ?? "",
    department: searchParams.get("department") ?? "",
    step: Number(searchParams.get("step") ?? 0),
  }));

  /* -------- Seed state from URL / stored draft once the context hydrates -- */
  useEffect(() => {
    if (!hydrated || bootstrapped.current) return;
    bootstrapped.current = true;

    const patch: Record<string, string> = {};
    let target = 1;

    const seedDoctor = urlSeed.doctor ? getDoctor(urlSeed.doctor) : undefined;
    const seedDept = urlSeed.department
      ? getDepartment(urlSeed.department)
      : undefined;

    if (seedDoctor) {
      patch.doctor = seedDoctor.slug;
      patch.department = seedDoctor.departmentSlug;
      target = 3;
    } else if (seedDept) {
      patch.department = seedDept.slug;
      target = 2;
    }

    const resolvedDept = patch.department || draft.department;
    const resolvedDoctor = patch.doctor || draft.doctor;

    if (urlSeed.step >= 1 && urlSeed.step <= 4)
      target = Math.max(target, urlSeed.step);
    if (!resolvedDept) target = 1;
    else if (!resolvedDoctor) target = Math.min(target, 2);
    if (target >= 3 && !draft.date) patch.date = firstOpen.iso;

    if (Object.keys(patch).length) setDraft(patch);
    setStep(target);
    setSeeded(true);
  }, [hydrated, urlSeed, setDraft, draft.department, draft.doctor, draft.date, firstOpen]);

  /* Before the seed lands, prefer the URL so the first paint shows the right
     doctor; afterwards the draft is the single source of truth. */
  const activeDoctorSlug =
    !seeded && urlSeed.doctor && getDoctor(urlSeed.doctor)
      ? urlSeed.doctor
      : draft.doctor;
  const activeDepartmentSlug =
    !seeded && urlSeed.doctor && getDoctor(urlSeed.doctor)
      ? getDoctor(urlSeed.doctor)!.departmentSlug
      : !seeded && urlSeed.department && getDepartment(urlSeed.department)
        ? urlSeed.department
        : draft.department;

  const doctor = activeDoctorSlug ? getDoctor(activeDoctorSlug) : undefined;
  const department = activeDepartmentSlug
    ? getDepartment(activeDepartmentSlug)
    : undefined;

  const goTo = (next: number) => {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /* ------------------------------------------------------- Step handlers */

  const pickDepartment = (slug: string) => {
    const current = draft.doctor ? getDoctor(draft.doctor) : undefined;
    setDraft({
      department: slug,
      doctor: current && current.departmentSlug === slug ? current.slug : "",
    });
    goTo(2);
  };

  const pickDoctor = (slug: string) => {
    setDraft({ doctor: slug, date: draft.date || firstOpen.iso });
    goTo(3);
  };

  const submitBooking = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!draft.date) next.date = "Select an appointment date";
    if (!draft.time) next.time = "Select a preferred time slot";
    if (draft.patientName.trim().length < 3)
      next.patientName = "Enter the patient's full name";
    if (!/^[6-9]\d{9}$/.test(draft.mobile.trim()))
      next.mobile = "Enter a valid 10-digit mobile number";
    const ageNum = Number(draft.age);
    if (!draft.age || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120)
      next.age = "Enter a valid age";
    if (!draft.gender) next.gender = "Select the patient's gender";
    setErrors(next);

    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      document
        .querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const seed = `${draft.doctor}${draft.date}${draft.time}${draft.mobile}`;
    const booking = {
      ...draft,
      reference: buildReference(draft.department, seed),
      token: buildToken(seed),
      bookedAt: new Date().toISOString(),
      fee: doctor?.fee ?? 700,
    };

    confirmBooking(booking);

    /*
     * Record it for the front desk. The patient already has their reference and
     * OPD token, so this runs alongside the redirect rather than gating it — a
     * database problem must not cost them a confirmed booking.
     */
    void saveAppointment(booking, doctor?.name ?? "").then(({ ok }) => {
      if (!ok) confirmBooking({ ...booking, deskSyncFailed: true });
    });

    navigate("/appointment/confirmation");
  };

  const monthDays = calendar.filter((d) => d.monthKey === month && !d.isSunday);

  /* ------------------------------------------------------------- Render */

  return (
    <>
      <AppointmentStepper
        current={step}
        labels={{
          1: department?.shortName ?? "Department",
          2: doctor?.shortName ?? "Doctor",
        }}
        onStepChange={goTo}
      />

      <div className="relative isolate bg-tint-soft-grad py-8 lg:py-10">
        <div
          className="shell grid min-w-0 gap-5 lg:grid-cols-[19.5rem_1fr] lg:items-start"
          ref={panelRef}
        >
          {/* ------------------------------------------------ Left sidebar */}
          <aside className="grid min-w-0 gap-4 lg:sticky lg:top-[6.5rem]">
            <div className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.09)] px-2.5 py-1.5 text-[0.6875rem] font-bold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Verified Faculty
                </span>
                {doctor ? (
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-secondary hover:underline"
                  >
                    Change Doctor
                  </button>
                ) : null}
              </div>

              {doctor ? (
                <>
                  <div className="mt-4 flex gap-3.5">
                    <div className="relative shrink-0">
                      <Image
                        src={doctor.photo}
                        alt={doctor.name}
                        width={160}
                        height={160}
                        sizes="72px"
                        className="h-18 w-18 rounded-xl object-cover"
                      />
                      <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-primary text-white">
                        <BadgeCheck size={12} />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[1.0625rem] leading-tight font-extrabold text-primary">
                        {doctor.name}
                      </p>
                      <p className="mt-1 text-[0.8125rem] font-semibold text-secondary">
                        {doctor.headline}
                      </p>
                      <p className="mt-1 text-[0.75rem] text-muted">
                        {doctor.qualificationShort}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[rgba(47,59,128,.05)] p-3.5">
                    <div>
                      <dt className="text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
                        Consultation Fee
                      </dt>
                      <dd className="mt-1.5 font-display text-[1.25rem] leading-none font-extrabold text-primary">
                        ₹{doctor.fee}{" "}
                        <span className="text-[0.75rem] font-semibold text-muted">
                          / Visit
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
                        Payment Mode
                      </dt>
                      <dd className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-bold text-success">
                        <CreditCard size={14} />
                        Pay at Hospital
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-4 flex items-start gap-2.5 text-[0.875rem]">
                    <DoorOpen size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-bold text-primary">
                        {doctor.chamberShort}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] text-muted">
                        OPD Wing A, Brahmanandam Centre Sonari, Jamshedpur
                      </span>
                    </span>
                  </p>
                  <p className="mt-2.5 flex items-center gap-2.5 text-[0.875rem] text-muted">
                    <Hourglass size={15} className="shrink-0 text-success" />
                    Avg. waiting window:{" "}
                    <strong className="font-bold text-ink">10 - 15 Mins</strong>
                  </p>

                  <EkgLine className="mt-4 w-full" width={280} />

                  <div className="mt-4 flex gap-2.5 rounded-xl bg-[rgba(47,59,128,.05)] p-3.5">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="block text-[0.875rem] font-bold text-primary">
                        100% Hospital Assurance
                      </span>
                      <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                        Prior slot confirmation guarantees consultation. No
                        cancellation fee before scheduled slot.
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">
                  Choose a department and specialist to see chamber details,
                  consultation fee, and live OPD availability here.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[1.125rem] border border-[rgba(190,53,58,.16)] bg-blush p-4">
              <p className="flex gap-2.5">
                <Siren size={18} className="mt-0.5 shrink-0 text-secondary" />
                <span>
                  <span className="block text-[0.875rem] font-extrabold text-secondary">
                    Acute Medical Emergency?
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">
                    Immediate ICU &amp; CCU triage open 24×7
                  </span>
                </span>
              </p>
              <a
                href={site.phoneHref}
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-secondary px-3.5 text-[0.75rem] font-bold text-white transition-colors hover:bg-secondary-700"
              >
                Call ICU
              </a>
            </div>
          </aside>

          {/* --------------------------------------------------- Main panel */}
          <div className="grid min-w-0 gap-5">
            {step === 1 ? (
              <PanelCard
                title="Select Clinical Department"
                subtitle="Choose the speciality you want to consult at the Sonari campus."
              >
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {bookableDepartments.map((dept) => (
                    <li key={dept.slug}>
                      <button
                        type="button"
                        onClick={() => pickDepartment(dept.slug)}
                        aria-pressed={draft.department === dept.slug}
                        className={cn(
                          "flex h-full w-full flex-col items-start rounded-xl border p-4 text-left transition-all",
                          draft.department === dept.slug
                            ? "border-primary bg-[rgba(47,59,128,.06)]"
                            : "border-line bg-white hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift",
                        )}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[rgba(47,59,128,.06)] text-primary">
                          <Icon name={dept.icon} size={19} />
                        </span>
                        <span className="mt-3.5 text-[0.9375rem] leading-snug font-bold text-primary">
                          {dept.name}
                        </span>
                        <span className="mt-1.5 line-clamp-2 text-[0.8125rem] text-muted">
                          {dept.summary}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </PanelCard>
            ) : null}

            {step === 2 ? (
              <PanelCard
                title="Select Your Specialist"
                subtitle={
                  department
                    ? `Consultants available in ${department.name}.`
                    : "Consultants available at Sonari."
                }
                action={
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-primary hover:text-secondary"
                  >
                    <ArrowLeft size={14} /> Change Department
                  </button>
                }
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {(() => {
                    const list = draft.department
                      ? doctors.filter((d) => d.departmentSlug === draft.department)
                      : doctors;
                    const shown = list.length ? list : doctors;
                    return shown.map((d) => (
                      <li key={d.slug}>
                        <button
                          type="button"
                          onClick={() => pickDoctor(d.slug)}
                          aria-pressed={draft.doctor === d.slug}
                          className={cn(
                            "flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition-all",
                            draft.doctor === d.slug
                              ? "border-primary bg-[rgba(47,59,128,.06)]"
                              : "border-line bg-white hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift",
                          )}
                        >
                          <Image
                            src={d.photo}
                            alt=""
                            width={160}
                            height={160}
                            sizes="64px"
                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-[1rem] font-extrabold text-primary">
                              {d.name}
                            </span>
                            <span className="mt-0.5 block text-[0.8125rem] text-secondary">
                              {d.headline}
                            </span>
                            <span className="mt-1 block text-[0.75rem] text-muted">
                              {d.daysLabel} • ₹{d.fee} • {d.experienceYears}+ yrs
                            </span>
                          </span>
                        </button>
                      </li>
                    ));
                  })()}
                </ul>
                {!draft.department ? null : (
                  <p className="mt-4 text-[0.8125rem] text-muted">
                    Looking for a visiting super-specialist? Call OPD reception on{" "}
                    <a
                      href={site.phoneHref}
                      className="font-bold text-secondary hover:underline"
                    >
                      {site.phone}
                    </a>
                    .
                  </p>
                )}
              </PanelCard>
            ) : null}

            {step >= 3 ? (
              <form onSubmit={submitBooking} noValidate className="grid min-w-0 gap-5">
                {/* ---------------------------------------- Date selection */}
                <section
                  data-field="date"
                  className="min-w-0 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2.5 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
                        <span className="h-2 w-2 rounded-full bg-secondary" />
                        Select Appointment Date
                      </h2>
                      <p className="mt-1.5 pl-5 text-[0.875rem] text-muted">
                        Showing live OPD schedule for {months.join(" & ")}
                      </p>
                    </div>
                    <div
                      role="tablist"
                      aria-label="Month"
                      className="flex rounded-full bg-[rgba(47,59,128,.05)] p-1"
                    >
                      {months.map((m) => (
                        <button
                          key={m}
                          type="button"
                          role="tab"
                          aria-selected={month === m}
                          onClick={() => setMonth(m)}
                          className={cn(
                            "h-9 rounded-full px-4 text-[0.8125rem] font-bold transition-colors",
                            month === m
                              ? "bg-white text-primary shadow-card"
                              : "text-muted hover:text-primary",
                          )}
                          suppressHydrationWarning
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className="no-scrollbar mt-7 grid w-full min-w-0 grid-flow-col grid-rows-1 gap-x-3 gap-y-5 overflow-x-auto pt-1 pb-1 sm:grid-flow-row sm:grid-cols-3 lg:grid-cols-4"
                    suppressHydrationWarning
                  >
                    {monthDays.slice(0, 12).map((d) => {
                      const selected = draft.date === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => {
                            setDraft({ date: d.iso, time: "" });
                            setErrors((e) => ({ ...e, date: "", time: "" }));
                          }}
                          aria-pressed={selected}
                          className={cn(
                            "relative min-w-[8.5rem] rounded-xl px-3 py-4 text-center transition-all",
                            selected
                              ? "bg-primary text-white shadow-[0_16px_32px_-20px_rgba(47,59,128,.95)]"
                              : "bg-[rgba(47,59,128,.05)] text-ink hover:bg-[rgba(47,59,128,.1)]",
                          )}
                        >
                          {d.isToday ? (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-md bg-secondary px-2 py-0.5 text-[0.625rem] font-extrabold whitespace-nowrap text-white">
                              FASTEST SLOT
                            </span>
                          ) : null}
                          <span
                            className={cn(
                              "block text-[0.6875rem] font-bold tracking-[0.08em] uppercase",
                              selected ? "text-white/75" : "text-muted",
                            )}
                          >
                            {d.isToday ? "Today" : d.weekday}
                          </span>
                          <span className="mt-1 block font-display text-[1.75rem] leading-none font-extrabold">
                            {d.day}
                          </span>
                          <span
                            className={cn(
                              "mt-1 block text-[0.6875rem] font-semibold tracking-[0.06em]",
                              selected ? "text-white/75" : "text-muted",
                            )}
                          >
                            {d.isToday ? `${d.weekday}, ${d.monthShort}` : d.monthShort}
                          </span>
                          <span
                            className={cn(
                              "mt-2 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                              selected
                                ? "bg-white/15 text-[#8ff0c4]"
                                : "bg-transparent text-muted",
                            )}
                          >
                            {d.slotsOpen} Slots {selected ? "Left" : "Open"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.date ? (
                    <p className="mt-3 text-[0.8125rem] font-semibold text-secondary">
                      {errors.date}
                    </p>
                  ) : null}
                </section>

                {/* ---------------------------------------- Slot selection */}
                <section
                  data-field="time"
                  className="min-w-0 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2.5 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
                        <span className="h-2 w-2 rounded-full bg-secondary" />
                        Select Preferred Time Slot
                      </h2>
                      <p className="mt-1.5 pl-5 text-[0.875rem] text-muted">
                        Consultation time allocated: 15-20 minutes
                        {doctor ? ` with ${doctor.name}` : ""}
                      </p>
                    </div>
                    {draft.time ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.09)] px-3 py-1.5 text-[0.8125rem] font-bold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Selected: {draft.time}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-5">
                    {opdSessions.map((session) => (
                      <fieldset key={session.id}>
                        <legend className="mb-2.5 flex items-center gap-2 text-[0.875rem] font-bold text-primary">
                          {session.id === "morning" ? (
                            <Sunrise size={16} className="text-secondary" />
                          ) : (
                            <Sunset size={16} className="text-secondary" />
                          )}
                          {session.label} ({session.window})
                        </legend>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                          {session.slots.map((s) => {
                            const available = draft.date
                              ? isSlotAvailable(draft.date, s)
                              : true;
                            const selected = draft.time === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                disabled={!available}
                                onClick={() => {
                                  setDraft({ time: s });
                                  setErrors((e) => ({ ...e, time: "" }));
                                }}
                                aria-pressed={selected}
                                className={cn(
                                  "inline-flex h-12 items-center justify-center gap-1.5 rounded-lg text-[0.875rem] font-bold transition-all",
                                  selected
                                    ? "bg-secondary text-white shadow-[0_12px_24px_-16px_rgba(190,53,58,.95)]"
                                    : available
                                      ? "bg-[rgba(47,59,128,.05)] text-ink hover:bg-[rgba(47,59,128,.1)]"
                                      : "cursor-not-allowed bg-[rgba(47,59,128,.03)] text-muted/50 line-through",
                                )}
                                suppressHydrationWarning
                              >
                                {selected ? <CheckCircle2 size={15} /> : null}
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  {errors.time ? (
                    <p className="mt-3 text-[0.8125rem] font-semibold text-secondary">
                      {errors.time}
                    </p>
                  ) : null}
                </section>

                {/* ------------------------------------------ Patient info */}
                <section className="min-w-0 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2.5 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
                        <span className="h-2 w-2 rounded-full bg-secondary" />
                        Patient Information
                      </h2>
                      <p className="mt-1.5 pl-5 text-[0.875rem] text-muted">
                        Enter details of the patient who will attend the
                        consultation.
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(47,59,128,.06)] px-3 py-1.5 text-[0.75rem] font-bold text-primary">
                      Confidential Medical Record
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        id="ap-name"
                        field="patientName"
                        label="Full Patient Name"
                        required
                        placeholder="e.g. Ananya Chakraborty"
                        icon={<UserRound size={16} />}
                        value={draft.patientName}
                        error={errors.patientName}
                        autoComplete="name"
                        onChange={(v) => {
                          setDraft({ patientName: v });
                          setErrors((e) => ({ ...e, patientName: "" }));
                        }}
                      />
                      <div data-field="mobile">
                        <label htmlFor="ap-mobile" className="label">
                          Mobile Number (For WhatsApp / SMS Token){" "}
                          <span className="text-secondary">*</span>
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.9375rem] font-bold text-primary">
                            +91
                          </span>
                          <input
                            id="ap-mobile"
                            className="field pr-10 pl-13"
                            placeholder="98351 22894"
                            inputMode="numeric"
                            maxLength={10}
                            autoComplete="tel-national"
                            value={draft.mobile}
                            aria-invalid={errors.mobile ? "true" : undefined}
                            aria-describedby={errors.mobile ? "ap-mobile-err" : undefined}
                            onChange={(e) => {
                              setDraft({
                                mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                              });
                              setErrors((er) => ({ ...er, mobile: "" }));
                            }}
                          />
                          <MessageSquareText
                            size={16}
                            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-success"
                            aria-hidden="true"
                          />
                        </div>
                        {errors.mobile ? (
                          <p id="ap-mobile-err" className="mt-1 text-[0.75rem] font-medium text-secondary">
                            {errors.mobile}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <TextField
                        id="ap-age"
                        field="age"
                        label="Patient Age"
                        required
                        placeholder="48"
                        inputMode="numeric"
                        maxLength={3}
                        value={draft.age}
                        error={errors.age}
                        onChange={(v) => {
                          setDraft({ age: v.replace(/\D/g, "").slice(0, 3) });
                          setErrors((e) => ({ ...e, age: "" }));
                        }}
                      />
                      <SelectField
                        id="ap-gender"
                        field="gender"
                        label="Gender"
                        required
                        value={draft.gender}
                        error={errors.gender}
                        placeholder="Select gender"
                        options={genders}
                        onChange={(v) => {
                          setDraft({ gender: v });
                          setErrors((e) => ({ ...e, gender: "" }));
                        }}
                      />
                      <SelectField
                        id="ap-visit"
                        field="visitCategory"
                        label="Visit Category"
                        required
                        value={draft.visitCategory}
                        options={visitCategories}
                        onChange={(v) => setDraft({ visitCategory: v })}
                      />
                    </div>

                    <div>
                      <label htmlFor="ap-concern" className="label">
                        Chief Concern / Reason for Visit
                      </label>
                      <textarea
                        id="ap-concern"
                        rows={3}
                        className="field resize-y"
                        placeholder="Briefly describe symptoms, duration, and any ongoing medication…"
                        value={draft.chiefConcern}
                        onChange={(e) => setDraft({ chiefConcern: e.target.value })}
                      />
                    </div>

                    <label className="flex cursor-pointer gap-3.5 rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                      <input
                        type="checkbox"
                        checked={draft.insurance}
                        onChange={(e) => setDraft({ insurance: e.target.checked })}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#be353a]"
                      />
                      <span>
                        <span className="block text-[0.9375rem] font-bold text-primary">
                          Avail Cashless Insurance / TPA Assistance at Sonari Counter
                        </span>
                        <span className="mt-1 block text-[0.875rem] leading-relaxed text-muted">
                          We support Star Health, Care, HDFC ERGO, Medi Assist,
                          Paramount TPA &amp; Corporate Panels at Sonari Hospital
                          desk.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      to="/doctors"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.06)]"
                    >
                      <ArrowLeft size={16} />
                      Back to Doctors List
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full bg-secondary px-7 text-[0.9375rem] font-extrabold text-white transition-colors hover:bg-secondary-700"
                    >
                      Continue to Final Confirmation
                      <ArrowRight size={18} strokeWidth={2.3} />
                    </button>
                  </div>

                  <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-line pt-5 text-[0.8125rem]">
                    {assurances.map((a) => (
                      <li key={a.text} className="flex items-center gap-2 text-muted">
                        <a.icon size={15} className={a.tone} />
                        {a.text}
                      </li>
                    ))}
                  </ul>
                </section>

                <ul className="grid gap-4 rounded-[1.25rem] bg-[rgba(47,59,128,.05)] p-5 sm:grid-cols-3">
                  {perks.map((perk, i) => (
                    <li key={perk.title} className="flex items-start gap-3">
                      {i === 2 ? (
                        <Accessibility size={20} className="mt-0.5 shrink-0 text-primary" />
                      ) : i === 1 ? (
                        <Pill size={20} className="mt-0.5 shrink-0 text-primary" />
                      ) : (
                        <Icon
                          name={perk.icon}
                          size={20}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                      )}
                      <span>
                        <span className="block text-[0.9375rem] font-bold text-primary">
                          {perk.title}
                        </span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-muted">
                          {perk.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Helpers */

function PanelCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-[1.25rem] font-extrabold sm:text-[1.375rem]">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            {title}
          </h2>
          <p className="mt-1.5 pl-5 text-[0.875rem] text-muted">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({
  id,
  field,
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  icon,
  inputMode,
  maxLength,
  autoComplete,
}: {
  id: string;
  field: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  inputMode?: "numeric" | "text";
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div data-field={field}>
      <label htmlFor={id} className="label">
        {label} {required ? <span className="text-secondary">*</span> : null}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn("field", icon ? "pr-10" : "")}
          placeholder={placeholder}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
        {icon ? (
          <span
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-[0.75rem] font-medium text-secondary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  field,
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
}: {
  id: string;
  field: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div data-field={field}>
      <label htmlFor={id} className="label">
        {label} {required ? <span className="text-secondary">*</span> : null}
      </label>
      <select
        id={id}
        className="field appearance-none"
        value={value}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-[0.75rem] font-medium text-secondary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BookingAssistanceCard() {
  return (
    <div className="inline-flex items-center gap-3.5 rounded-[1.125rem] border border-line bg-white px-5 py-3.5 shadow-card">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgba(47,59,128,.06)] text-primary">
        <Phone size={19} />
      </span>
      <span>
        <span className="block text-[0.625rem] font-extrabold tracking-[0.1em] text-muted uppercase">
          Booking Assistance
        </span>
        <a
          href={site.phoneHref}
          className="mt-1 block font-display text-[1.25rem] leading-none font-extrabold text-primary hover:text-secondary"
        >
          {site.phone}
        </a>
      </span>
    </div>
  );
}

export function CalendarBadge() {
  return <CalendarDays size={16} aria-hidden="true" />;
}
