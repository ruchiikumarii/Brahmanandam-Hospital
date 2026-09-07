import { useNavigate } from "react-router-dom";
import { useMemo, useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Lock,
  ShieldPlus,
  Sunrise,
  Sunset,
  Video,
} from "lucide-react";
import type { Doctor } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import { useAppointment } from "@/lib/appointment-context";
import { buildCalendar, isSlotAvailable, opdSessions } from "@/lib/slots";
import { cn } from "@/components/ui";

export function ProfileBookingCard({ doctor }: { doctor: Doctor }) {
  const navigate = useNavigate();
  const { setDraft } = useAppointment();
  const calendar = useMemo(() => buildCalendar(8).filter((d) => !d.isSunday).slice(0, 4), []);

  const [mode, setMode] = useState<"opd" | "tele">("opd");
  const [date, setDate] = useState(calendar[0]?.iso ?? "");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [concern, setConcern] = useState("");
  const [insurance, setInsurance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!slot) next.slot = "Choose a consultation time slot";
    if (name.trim().length < 3) next.name = "Enter the patient's full name";
    if (!/^[6-9]\d{9}$/.test(mobile.trim()))
      next.mobile = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setDraft({
      department: doctor.departmentSlug,
      doctor: doctor.slug,
      date,
      time: slot,
      patientName: name.trim(),
      mobile: mobile.trim(),
      age: age.trim(),
      chiefConcern: concern.trim(),
      insurance,
      visitCategory: mode === "tele" ? "Teleconsultation" : "New In-Hospital OPD",
    });
    navigate("/appointment?step=4");
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label={`Schedule a consultation with ${doctor.name}`}
      className="overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-card"
    >
      <div className="bg-primary px-5 py-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.6875rem] font-extrabold tracking-[0.1em] text-white/70 uppercase">
            Instant Booking
          </p>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] font-extrabold">
OPD Booking
          </span>
        </div>
        <h2 className="mt-2 text-[1.375rem] font-extrabold !text-white">
          Schedule Consultation
        </h2>
        <p className="mt-1 text-[0.8125rem] text-white/70">
          {doctor.name} • {doctor.chamber.split(",")[0]}
        </p>
      </div>

      <div className="p-5">
        <fieldset>
          <legend className="mb-2 text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
            1. Mode of Consult
          </legend>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[rgba(47,59,128,.05)] p-1">
            {[
              { id: "opd" as const, label: "In-Hospital OPD", icon: Building2 },
              { id: "tele" as const, label: "Teleconsult", icon: Video },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                aria-pressed={mode === opt.id}
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-2 rounded-lg text-[0.8125rem] font-bold transition-colors",
                  mode === opt.id
                    ? "bg-primary text-white"
                    : "text-muted hover:text-primary",
                )}
              >
                <opt.icon size={15} />
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="mb-2 flex w-full items-center justify-between">
            <span className="text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
              2. Select Consultation Date
            </span>
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {calendar.map((d, i) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDate(d.iso)}
                aria-pressed={date === d.iso}
                className={cn(
                  "rounded-xl px-1 py-2.5 text-center transition-colors",
                  date === d.iso
                    ? "bg-primary text-white"
                    : "bg-[rgba(47,59,128,.05)] text-ink hover:bg-[rgba(47,59,128,.1)]",
                )}
                suppressHydrationWarning
              >
                <span
                  className={cn(
                    "block text-[0.5625rem] font-bold tracking-[0.06em] uppercase",
                    date === d.iso ? "text-white/70" : "text-muted",
                  )}
                >
                  {i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.weekday}
                </span>
                <span className="mt-1 block font-display text-[1.125rem] leading-none font-extrabold">
                  {d.day}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[0.625rem]",
                    date === d.iso ? "text-white/70" : "text-muted",
                  )}
                >
                  {d.monthShort.slice(0, 1) + d.monthShort.slice(1).toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="mb-2 text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
            3. Choose Time Slot
          </legend>
          {[...opdSessions].reverse().map((session) => (
            <div key={session.id} className="mb-3 last:mb-0">
              <p className="mb-2 flex items-center gap-1.5 text-[0.8125rem] font-bold text-primary">
                {session.id === "morning" ? (
                  <Sunrise size={14} className="text-secondary" />
                ) : (
                  <Sunset size={14} className="text-secondary" />
                )}
                {session.id === "morning" ? "Morning Slots" : "Evening Slots"} (
                {doctor.chamber.split(",")[0]})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {session.slots.slice(0, 4).map((s) => {
                  const available = isSlotAvailable(date, s);
                  const selected = slot === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSlot(s);
                        setErrors((e) => ({ ...e, slot: "" }));
                      }}
                      aria-pressed={selected}
                      className={cn(
                        "h-10 rounded-lg text-[0.8125rem] font-bold transition-colors",
                        selected
                          ? "bg-secondary text-white"
                          : available
                            ? "bg-[rgba(47,59,128,.05)] text-ink hover:bg-[rgba(47,59,128,.1)]"
                            : "cursor-not-allowed bg-[rgba(47,59,128,.03)] text-muted/50 line-through",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {errors.slot ? (
            <p className="mt-1 text-[0.75rem] font-medium text-secondary">
              {errors.slot}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="mt-5 grid gap-2.5">
          <legend className="mb-2 text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
            4. Patient Information
          </legend>
          <div>
            <label htmlFor="pb-name" className="sr-only">
              Patient full name
            </label>
            <input
              id="pb-name"
              className="field"
              placeholder="Patient Full Name"
              value={name}
              autoComplete="name"
              aria-invalid={errors.name ? "true" : undefined}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name ? (
              <p className="mt-1 text-[0.75rem] font-medium text-secondary">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="pb-mobile" className="sr-only">
                Mobile number
              </label>
              <input
                id="pb-mobile"
                className="field"
                placeholder="Mobile Number"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                value={mobile}
                aria-invalid={errors.mobile ? "true" : undefined}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>
            <div>
              <label htmlFor="pb-age" className="sr-only">
                Patient age
              </label>
              <input
                id="pb-age"
                className="field"
                placeholder="Age"
                inputMode="numeric"
                maxLength={3}
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
              />
            </div>
          </div>
          {errors.mobile ? (
            <p className="-mt-1 text-[0.75rem] font-medium text-secondary">
              {errors.mobile}
            </p>
          ) : null}
          <div>
            <label htmlFor="pb-concern" className="sr-only">
              Chief concern or reason for visit
            </label>
            <input
              id="pb-concern"
              className="field"
              placeholder="Chief Concern / Reason for Visit"
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
            />
          </div>
        </fieldset>

        <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-[rgba(47,59,128,.05)] px-3.5 py-3">
          <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-primary">
            <ShieldPlus size={16} className="text-primary" />
            Use TPA / Cashless Insurance?
          </span>
          <span className="relative inline-flex shrink-0">
            <input
              type="checkbox"
              checked={insurance}
              onChange={(e) => setInsurance(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-primary-200 transition-colors peer-checked:bg-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2" />
            <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
          </span>
        </label>

        <button
          type="submit"
          className="mt-4 inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-secondary text-[0.9375rem] font-extrabold text-white transition-colors hover:bg-secondary-700"
        >
          Confirm Appointment Slot
          <CheckCircle2 size={18} strokeWidth={2.2} />
        </button>

        <p className="mt-3 flex items-center justify-center gap-2 text-center text-[0.75rem] font-bold text-primary">
          <Lock size={13} className="text-success" />
          100% Secure • Instant SMS Confirmation • No Online Payment
        </p>
        <p className="mt-2 text-center text-[0.75rem] text-muted">
          Need urgent assistance? Call Sonari Front Desk:{" "}
          <a href={site.phoneHref} className="font-bold text-secondary hover:underline">
            {site.phone}
          </a>
        </p>
      </div>
    </form>
  );
}
