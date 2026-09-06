import { useNavigate } from "react-router-dom";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { departments } from "@/lib/data/departments";
import { doctors } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import {
  allSlots,
  buildCalendar,
  firstAvailableSlot,
  firstBookableDay,
  isSlotAvailable,
} from "@/lib/slots";
import { useAppointment } from "@/lib/appointment-context";
import { EkgLine, cn } from "@/components/ui";

const bookableDepartments = departments.filter(
  (d) => d.slug !== "emergency-trauma-care",
);

export function HeroBookingCard() {
  const navigate = useNavigate();
  const { setDraft } = useAppointment();
  const calendar = useMemo(() => buildCalendar(45), []);

  const [department, setDepartment] = useState("cardiology");
  const [doctor, setDoctor] = useState("rajeev-ranjan");
  const firstOpen = useMemo(() => firstBookableDay(calendar), [calendar]);

  const [date, setDate] = useState(firstOpen.iso);
  const [time, setTime] = useState(() => firstAvailableSlot(firstOpen.iso));
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const deptDoctors = useMemo(() => {
    const list = doctors.filter((d) => d.departmentSlug === department);
    return list.length ? list : doctors;
  }, [department]);

  const onDateChange = (value: string) => {
    setDate(value);
    if (!isSlotAvailable(value, time)) setTime(firstAvailableSlot(value));
  };

  const onDepartmentChange = (value: string) => {
    setDepartment(value);
    const first = doctors.find((d) => d.departmentSlug === value);
    setDoctor(first ? first.slug : "");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Enter the patient's full name";
    if (!/^[6-9]\d{9}$/.test(mobile.trim()))
      next.mobile = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setDraft({
      department,
      doctor: doctor || deptDoctors[0]?.slug || "",
      date,
      time,
      patientName: name.trim(),
      mobile: mobile.trim(),
    });
    navigate("/appointment?step=3");
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Quick appointment booking"
      className="relative overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_30px_70px_-40px_rgba(47,59,128,.5)]"
    >
      {/* top brand strip */}
      <div
        aria-hidden="true"
        className="h-[5px] w-full"
        style={{
          background: "linear-gradient(90deg, #be353a 0%, #8f2c58 48%, #2f3b80 100%)",
        }}
      />

      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[1.3125rem] leading-none font-extrabold tracking-[-0.01em] sm:text-[1.5rem]">
              BOOK AN <span className="text-secondary">APPOINTMENT</span>
            </h2>
            <EkgLine className="mt-1.5" width={86} />
          </div>
          <span className="shrink-0 rounded-full bg-[rgba(190,53,58,.08)] px-3 py-1.5 text-[0.625rem] font-extrabold tracking-[0.08em] text-secondary">
            FAST TRACK
          </span>
        </div>

        <p className="mt-2 text-[0.8125rem] text-muted">
          Instant slot booking with zero registration fees
        </p>

        <div className="mt-5 grid gap-4">
          <Select
            id="hero-dept"
            label="Select Department"
            value={department}
            onChange={onDepartmentChange}
            options={bookableDepartments.map((d) => ({
              value: d.slug,
              label: d.slug === "cardiology" ? "Cardiology (Heart Care)" : d.name,
            }))}
          />

          <Select
            id="hero-doctor"
            label="Select Doctor"
            value={doctor}
            onChange={setDoctor}
            options={deptDoctors.map((d) => ({
              value: d.slug,
              label: `${d.name} (${d.qualification.split(",").slice(1, 3).join(",").trim() || d.specialty})`,
            }))}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-date" className="label">
                Select Date
              </label>
              <select
                id="hero-date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="field appearance-none"
                suppressHydrationWarning
              >
                {calendar
                  .filter((d) => !d.isSunday)
                  .slice(0, 24)
                  .map((d) => (
                    <option key={d.iso} value={d.iso}>
                      {d.isToday ? "Today • " : ""}
                      {d.day} {d.monthShort} {d.iso.slice(0, 4)}
                    </option>
                  ))}
              </select>
            </div>
            <Select
              id="hero-slot"
              label="Preferred Slot"
              value={time}
              onChange={setTime}
              options={allSlots.map((s) => ({
                value: s,
                label: s,
                disabled: !isSlotAvailable(date, s),
              }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-name" className="label">
                Your Name
              </label>
              <input
                id="hero-name"
                className="field"
                placeholder="Patient Full Name"
                value={name}
                autoComplete="name"
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "hero-name-err" : undefined}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? (
                <p id="hero-name-err" className="mt-1 text-[0.75rem] font-medium text-secondary">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="hero-mobile" className="label">
                Mobile Number
              </label>
              <input
                id="hero-mobile"
                className="field"
                placeholder="10-digit number"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                value={mobile}
                aria-invalid={errors.mobile ? "true" : undefined}
                aria-describedby={errors.mobile ? "hero-mobile-err" : undefined}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              {errors.mobile ? (
                <p id="hero-mobile-err" className="mt-1 text-[0.75rem] font-medium text-secondary">
                  {errors.mobile}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-secondary text-[0.9375rem] font-extrabold tracking-[0.01em] text-white transition-colors hover:bg-secondary-700"
          >
            CONFIRM APPOINTMENT
            <CheckCircle2 size={18} strokeWidth={2.2} />
          </button>

          <p className="text-center text-[0.8125rem] text-muted">
            Or WhatsApp your prescription to{" "}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold text-secondary hover:underline"
            >
              +91 {site.phone}
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("field appearance-none pr-9")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
