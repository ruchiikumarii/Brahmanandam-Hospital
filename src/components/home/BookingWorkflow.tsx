import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Sunrise, Sun, Sunset } from "lucide-react";
import { getDoctor } from "@/lib/data/doctors";
import { buildCalendar, formatLongDate } from "@/lib/slots";
import { useAppointment } from "@/lib/appointment-context";
import { Section, SectionHeading, cn } from "@/components/ui";

const steps = [
  { n: 1, label: "Department" },
  { n: 2, label: "Doctor" },
  { n: 3, label: "Date & Time" },
  { n: 4, label: "Patient Info" },
  { n: 5, label: "Confirmation" },
];

const groups = [
  { id: "morning", label: "Morning Slots (OPD Chamber 4)", icon: Sunrise, slots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"] },
  { id: "afternoon", label: "Afternoon Slots", icon: Sun, slots: ["12:00 PM", "12:30 PM", "01:00 PM"] },
  { id: "evening", label: "Evening Slots", icon: Sunset, slots: ["04:00 PM", "04:30 PM", "05:00 PM"] },
];

export function BookingWorkflow() {
  const navigate = useNavigate();
  const { setDraft } = useAppointment();
  const [slot, setSlot] = useState("10:30 AM");
  const doctor = getDoctor("rajeev-ranjan");
  const today = useMemo(() => buildCalendar(1)[0], []);

  const activeStep = 3;

  const proceed = () => {
    setDraft({
      department: "cardiology",
      doctor: "rajeev-ranjan",
      date: today.iso,
      time: slot,
    });
    navigate("/appointment?step=4");
  };

  return (
    <Section tone="soft" backdrop="soft">
      <SectionHeading
        eyebrow="Effortless Scheduling"
        title="Interactive Booking Workflow"
        subtitle="Experience seamless appointment confirmation in 5 streamlined stages."
        ekg={false}
      />

      <div
        data-reveal
        className="mx-auto mt-9 max-w-4xl rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-8"
      >
        {/* Stepper */}
        <ol className="no-scrollbar -mx-1 flex items-start gap-1 overflow-x-auto px-1 pb-1">
          {steps.map((step, i) => {
            const done = step.n < activeStep;
            const active = step.n === activeStep;
            return (
              <li
                key={step.n}
                className="flex min-w-[5.5rem] flex-1 flex-col items-center gap-2 sm:min-w-0"
              >
                <div className="flex w-full items-center">
                  <span className="h-px flex-1" />
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[0.875rem] font-bold transition-colors",
                      done && "bg-primary text-white",
                      active &&
                        "bg-secondary text-white ring-4 ring-[rgba(190,53,58,.16)]",
                      !done && !active && "bg-[rgba(47,59,128,.07)] text-primary-400",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? <Check size={17} strokeWidth={3} /> : step.n}
                  </span>
                  <span
                    className={cn(
                      "h-px flex-1",
                      i === steps.length - 1
                        ? "bg-transparent"
                        : done
                          ? "bg-primary/25"
                          : "bg-line",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-center text-[0.75rem] font-semibold",
                    active ? "text-secondary" : done ? "text-primary" : "text-muted",
                  )}
                >
                  {step.n}. {step.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Selected doctor summary */}
        <div className="mt-7 flex flex-col gap-3 rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays size={20} className="shrink-0 text-primary" />
            <div>
              <p className="text-[0.75rem] text-muted">Selected Doctor:</p>
              <p className="text-[0.9375rem] font-extrabold text-primary">
                {doctor?.name} (Cardiologist)
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[0.75rem] text-muted">Consultation Date:</p>
            <p
              className="text-[0.875rem] font-bold text-secondary"
              suppressHydrationWarning
            >
              Today, {formatLongDate(today.iso).split(", ")[1]}
            </p>
          </div>
        </div>

        {/* Slots */}
        <div className="mt-7 grid gap-6">
          {groups.map((group) => (
            <fieldset key={group.id}>
              <legend className="mb-3 flex items-center gap-2 text-[0.9375rem] font-bold text-primary">
                <group.icon size={17} className="text-secondary" />
                {group.label}
              </legend>
              <div
                className={cn(
                  "grid gap-3",
                  group.slots.length === 4
                    ? "grid-cols-2 sm:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3",
                )}
              >
                {group.slots.map((s) => {
                  const selected = s === slot;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      aria-pressed={selected}
                      className={cn(
                        "h-12 rounded-lg text-[0.875rem] font-bold transition-all",
                        selected
                          ? "bg-secondary text-white shadow-[0_10px_22px_-14px_rgba(190,53,58,.95)]"
                          : "bg-[rgba(47,59,128,.04)] text-ink hover:bg-[rgba(47,59,128,.09)]",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[rgba(47,59,128,.06)] px-6 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
          >
            Back to Doctors
          </button>
          <button
            type="button"
            onClick={proceed}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-7 text-[0.9375rem] font-bold text-white transition-colors hover:bg-secondary-700"
          >
            Continue to Patient Details
            <ArrowRight size={17} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </Section>
  );
}
