import { Check } from "lucide-react";
import { cn } from "@/components/ui";

export const bookingSteps = [
  { n: 1, key: "department", label: "Department" },
  { n: 2, key: "doctor", label: "Doctor" },
  { n: 3, key: "date", label: "Date & Slot" },
  { n: 4, key: "patient", label: "Patient Info" },
  { n: 5, key: "confirmation", label: "Confirmation" },
] as const;

export function AppointmentStepper({
  current,
  labels,
  onStepChange,
}: {
  current: number;
  /** Optional per-step value shown instead of the generic label (e.g. chosen dept). */
  labels?: Partial<Record<number, string>>;
  onStepChange?: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking progress" className="border-y border-line bg-white">
      <ol className="shell no-scrollbar flex items-center gap-1 overflow-x-auto py-3.5">
        {bookingSteps.map((step, i) => {
          const done = step.n < current;
          const active = step.n === current;
          const clickable = Boolean(onStepChange) && done;

          const content = (
            <>
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold transition-colors",
                  done && "bg-secondary text-white",
                  active && "bg-white text-primary ring-2 ring-primary",
                  !done && !active && "bg-[rgba(47,59,128,.06)] text-primary-400",
                )}
              >
                {done ? <Check size={16} strokeWidth={3} /> : `0${step.n}`}
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.08em] uppercase",
                    active ? "text-secondary" : "text-muted",
                  )}
                >
                  {active ? (
                    <>
                      Active Step
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    </>
                  ) : (
                    `Step 0${step.n}`
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1.5 truncate text-[0.875rem] font-bold",
                    active ? "text-secondary" : done ? "text-primary" : "text-muted",
                  )}
                >
                  {labels?.[step.n] ?? step.label}
                </span>
              </span>
            </>
          );

          return (
            <li key={step.key} className="flex flex-1 items-center gap-2">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepChange?.(step.n)}
                  className="flex min-w-[8.5rem] items-center gap-2.5 rounded-xl px-1 py-1 text-left transition-colors hover:bg-[rgba(47,59,128,.04)]"
                >
                  {content}
                </button>
              ) : (
                <span
                  aria-current={active ? "step" : undefined}
                  className="flex min-w-[8.5rem] items-center gap-2.5 px-1 py-1"
                >
                  {content}
                </span>
              )}
              {i < bookingSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-[2px] flex-1 rounded-full lg:block",
                    done ? "bg-secondary" : "bg-line",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Compact ticked stepper used on the confirmation screen. */
export function ConfirmedStepper() {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-start">
        {bookingSteps.map((step, i) => {
          const last = i === bookingSteps.length - 1;
          return (
            <li key={step.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    "h-[2px] flex-1 rounded-full",
                    i === 0 ? "bg-transparent" : "bg-primary",
                  )}
                />
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white",
                    last ? "bg-success ring-4 ring-[rgba(15,157,110,.16)]" : "bg-primary",
                  )}
                >
                  <Check size={16} strokeWidth={3} />
                </span>
                <span
                  className={cn(
                    "h-[2px] flex-1 rounded-full",
                    last ? "bg-transparent" : "bg-primary",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2.5 text-center text-[0.75rem] font-semibold sm:text-[0.8125rem]",
                  last ? "text-success" : "text-primary",
                )}
              >
                {last ? "Confirmed" : step.n === 3 ? "Date & Time" : step.n === 4 ? "Patient Details" : step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
