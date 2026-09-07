import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AlarmClock,
  CalendarPlus,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Headset,
  Home,
  Info,
  MapPin,
  Phone,
  Printer,
  Receipt,
  ShieldPlus,
  Siren,
  Ticket,
  Wallet,
} from "lucide-react";
import { getDepartment } from "@/lib/data/departments";
import { getDoctor } from "@/lib/data/doctors";
import { site } from "@/lib/data/site";
import { formatLongDate } from "@/lib/slots";
import { useAppointment } from "@/lib/appointment-context";
import { DoctorAvatar } from "@/components/cards/DoctorAvatar";
import { ConfirmedStepper } from "./Stepper";
import { EkgLine, cn } from "@/components/ui";

function QrGlyph() {
  /* Decorative QR-style glyph — the scannable pass is issued at the lobby kiosk. */
  const cells = [
    [30, 2], [38, 2], [30, 10], [46, 10], [34, 18], [42, 18], [30, 26],
    [38, 26], [46, 26], [58, 2], [66, 10], [58, 18], [66, 26],
    [2, 34], [10, 34], [18, 34], [26, 34], [42, 34], [58, 34], [66, 34],
    [2, 42], [18, 42], [34, 42], [50, 42], [66, 42],
    [30, 50], [38, 50], [54, 50], [62, 50], [30, 58], [46, 58], [62, 58],
    [34, 66], [42, 66], [58, 66], [66, 66],
  ];
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 74 74"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {[
        [0, 0],
        [48, 0],
        [0, 48],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x + 2}
            y={y + 2}
            width="22"
            height="22"
            rx="4"
            stroke="#2f3b80"
            strokeWidth="4"
          />
          <rect x={x + 9} y={y + 9} width="8" height="8" rx="1.5" fill="#2f3b80" />
        </g>
      ))}
      {cells.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="6"
          height="6"
          rx="1"
          fill={i % 9 === 4 ? "#be353a" : "#2f3b80"}
        />
      ))}
    </svg>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-[0.8125rem] text-muted">{label}</dt>
      <dd className="text-right text-[0.875rem] font-bold text-ink">{children}</dd>
    </div>
  );
}

export function ConfirmationView() {
  const navigate = useNavigate();
  const { confirmed, hydrated, resetDraft } = useAppointment();
  const [copied, setCopied] = useState(false);

  if (!hydrated) {
    return (
      <div className="shell py-24 text-center text-[0.9375rem] text-muted">
        Loading your appointment…
      </div>
    );
  }

  if (!confirmed) {
    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-lg rounded-[1.25rem] border border-line bg-white p-10 text-center shadow-card">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[rgba(47,59,128,.06)] text-primary">
            <Info size={28} />
          </span>
          <h1 className="mt-5 text-[1.5rem] font-extrabold">
            No appointment to confirm yet
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
            Your booking session has expired or no slot was selected. Start a new
            booking to receive your OPD token and digital pass.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/appointment"
              className="inline-flex h-12 items-center justify-center rounded-full bg-secondary px-6 text-[0.875rem] font-bold text-white hover:bg-secondary-700"
            >
              Book an Appointment
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[0.875rem] font-bold text-primary hover:bg-[rgba(47,59,128,.04)]"
            >
              <Phone size={15} /> Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const doctor = getDoctor(confirmed.doctor);
  const department = getDepartment(confirmed.department);
  const dateLabel = formatLongDate(confirmed.date);
  const [weekday, rest] = dateLabel.split(", ");

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(confirmed.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const addToCalendar = () => {
    const start = new Date(`${confirmed.date}T00:00:00`);
    const [hhmm, mer] = confirmed.time.split(" ");
    let [h, m] = hhmm.split(":").map(Number);
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) =>
      `${d.getFullYear()}${`${d.getMonth() + 1}`.padStart(2, "0")}${`${d.getDate()}`.padStart(2, "0")}T${`${d.getHours()}`.padStart(2, "0")}${`${d.getMinutes()}`.padStart(2, "0")}00`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Brahmanandam Hospital//OPD//EN",
      "BEGIN:VEVENT",
      `UID:${confirmed.reference}@brahmanandamhospital.in`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:OPD Consultation - ${doctor?.name ?? "Brahmanandam Hospital"}`,
      `DESCRIPTION:Booking Reference ${confirmed.reference}. OPD Token ${confirmed.token}. Report 15 minutes early.`,
      `LOCATION:${site.address.full}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${confirmed.reference}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const bookAnother = () => {
    resetDraft();
    navigate("/appointment");
  };

  const instructions = [
    {
      icon: AlarmClock,
      title: "Reporting Time",
      text: `Arrive 15 minutes early (${confirmed.time}) at the ${doctor?.opdRoom ?? "OPD"} counter for vitals (BP, SpO2 & pulse) recording.`,
      tone: "default" as const,
    },
    {
      icon: FileText,
      title: "Reports to Bring",
      text: "Carry past diagnostic reports, discharge summaries, and current prescription slips.",
      tone: "default" as const,
    },
    {
      icon: ShieldPlus,
      title: "Insurance / TPA Help",
      text: "For cashless consultation or IPD pre-auth, bring original Aadhaar Card and Health Insurance card.",
      tone: "default" as const,
    },
    {
      icon: Siren,
      title: "Urgent / Acute Symptoms",
      text: `If your condition worsens before the slot, report directly to our 24×7 ER or call ${site.phone}.`,
      tone: "danger" as const,
    },
  ];

  return (
    <div className="relative isolate bg-tint-soft-grad py-8 lg:py-10">
      <div className="shell">
        <div className="mx-auto max-w-4xl">
          <ConfirmedStepper />

          <article className="mt-7 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
            {/* --------------------------------------------------- Success */}
            <header
              className="relative px-6 py-10 text-center sm:px-10"
              style={{
                background:
                  "radial-gradient(600px 260px at 50% -10%, rgba(47,59,128,.07), transparent 65%), #fbfbff",
              }}
            >
              <EkgLine className="mx-auto w-full max-w-[26rem]" width={420} tone="secondary" />
              <span className="mx-auto mt-5 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-success text-white ring-[10px] ring-[rgba(15,157,110,.12)]">
                <Check size={32} strokeWidth={3} />
              </span>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[rgba(15,157,110,.1)] px-3.5 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.09em] text-success uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Appointment Officially Booked
              </p>
              <h1 className="mt-3 text-[1.75rem] leading-tight font-extrabold sm:text-[2.25rem]">
                Your Consultation is Confirmed!
              </h1>
              <p className="mx-auto mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
                An automated SMS, WhatsApp digital pass, and receipt have been
                dispatched to{" "}
                <strong className="font-bold text-ink">+91 {confirmed.mobile}</strong>.
              </p>

              <div className="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-xl bg-[rgba(47,59,128,.05)] px-4 py-3">
                <span className="text-left">
                  <span className="block text-[0.625rem] font-extrabold tracking-[0.09em] text-muted uppercase">
                    Booking Reference
                  </span>
                  <span className="mt-1 block font-display text-[1.0625rem] font-extrabold tracking-[0.02em] text-primary">
                    {confirmed.reference}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={copyReference}
                  className="no-print inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[0.6875rem] font-extrabold tracking-[0.05em] text-primary uppercase shadow-card transition-colors hover:bg-white/70"
                >
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </header>

            <div
              aria-hidden="true"
              className="relative h-px bg-line before:absolute before:-top-2.5 before:-left-2.5 before:h-5 before:w-5 before:rounded-full before:bg-tint-soft-grad after:absolute after:-top-2.5 after:-right-2.5 after:h-5 after:w-5 after:rounded-full after:bg-tint-soft-grad"
            />

            {/* ------------------------------------------------- Details */}
            <div className="grid gap-5 px-5 py-8 sm:px-8 lg:grid-cols-2">
              <div className="grid content-start gap-4">
                <div className="flex items-start gap-3.5 rounded-[1.125rem] bg-[rgba(47,59,128,.05)] p-4">
                  {doctor ? (
                    <DoctorAvatar doctor={doctor} size={60} className="h-15 w-15" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="text-[1.0625rem] font-extrabold text-primary">
                        {doctor?.name ?? "Consultant"}
                      </span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[0.6875rem] font-bold text-primary">
                        {department?.shortName ?? doctor?.specialty}
                      </span>
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-muted">
                      {[doctor?.qualification, doctor?.designation].filter(Boolean).join(" • ")}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-secondary">
                      <Ticket size={13} />
                      Department of {department?.name ?? doctor?.specialtyLabel}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.125rem] bg-[rgba(47,59,128,.05)] p-4">
                    <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">
                      <CalendarPlus size={14} className="text-primary" />
                      Consultation Slot
                    </p>
                    <p className="mt-2.5 text-[1.0625rem] leading-tight font-extrabold text-primary">
                      {weekday}, {rest}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-muted">
                      {confirmed.time} IST
                    </p>
                  </div>

                  <div className="rounded-[1.125rem] bg-blush p-4">
                    <p className="flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.08em] text-secondary uppercase">
                      <Ticket size={14} />
                      OPD Token Queue
                    </p>
                    <p className="mt-2 flex items-end gap-2">
                      <span className="font-display text-[2rem] leading-none font-extrabold text-secondary">
                        {confirmed.token}
                      </span>
                      <span className="pb-0.5 text-[0.75rem] leading-tight font-semibold text-secondary">
                        Est. consult:
                        <br />
                        {confirmed.time}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.125rem] border border-line p-4">
                  <p className="flex items-start gap-2.5">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="block text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">
                        Chamber &amp; Location
                      </span>
                      <span className="mt-1.5 block text-[1rem] font-extrabold text-primary">
                        {doctor?.opdRoom ?? "OPD Clinical Block"}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] text-muted">
                        Brahmanandam Hospital, {site.address.line1},{" "}
                        {site.address.line2}
                      </span>
                    </span>
                  </p>
                  <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3.5">
                    <span className="flex items-center gap-2 text-[0.875rem] text-muted">
                      <Wallet size={15} className="text-primary" />
                      Payment
                    </span>
                    <span className="text-right">
                      <strong className="text-[0.9375rem] font-bold text-primary">
                        Payable at OPD Counter
                      </strong>
                      <span className="ml-1.5 text-[0.75rem] text-muted">
                        (cash / card / UPI)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-[1.125rem] bg-[rgba(47,59,128,.05)] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">
                      Patient Details
                    </p>
                    <span className="rounded-full bg-[rgba(15,157,110,.1)] px-2.5 py-1 text-[0.6875rem] font-bold text-success">
                      Verified
                    </span>
                  </div>
                  <p className="mt-3 text-[1.125rem] font-extrabold text-primary">
                    {confirmed.patientName}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-muted">
                    {[confirmed.gender, `${confirmed.age} Years`]
                      .filter(Boolean)
                      .join(" • ")}
                    {confirmed.bloodGroup ? ` • Blood: ${confirmed.bloodGroup}` : ""}
                  </p>

                  <dl className="mt-4 divide-y divide-line border-t border-line pt-1">
                    <Row label="Registered Mobile">+91 {confirmed.mobile}</Row>
                    <Row label="Consultation Category">{confirmed.visitCategory}</Row>
                    <Row label="TPA / Cashless Desk">
                      {confirmed.insurance ? (
                        <span className="flex items-center justify-end gap-1.5 text-success">
                          <ShieldPlus size={14} />
                          Assistance Requested
                        </span>
                      ) : (
                        "Self Pay"
                      )}
                    </Row>
                    {confirmed.chiefConcern ? (
                      <Row label="Chief Concern">
                        <span className="line-clamp-2 max-w-[14rem] font-medium">
                          {confirmed.chiefConcern}
                        </span>
                      </Row>
                    ) : null}
                  </dl>
                </div>

                <div className="flex items-start gap-4 rounded-[1.125rem] border border-line bg-white p-4">
                  <QrGlyph />
                  <div>
                    <p className="text-[0.75rem] font-extrabold tracking-[0.06em] text-primary uppercase">
                      Scan at Lobby Kiosk
                    </p>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                      Present this QR upon arrival at the ground floor kiosk to
                      skip queue and print OPD slip.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------- Instructions */}
            <section className="px-5 pb-8 sm:px-8">
              <h2 className="flex items-center gap-2.5 text-[1.125rem] font-extrabold">
                <Info size={19} className="text-secondary" />
                Essential Instructions for Your Hospital Visit
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {instructions.map((item) => (
                  <li
                    key={item.title}
                    className={cn(
                      "rounded-[1.125rem] p-4",
                      item.tone === "danger" ? "bg-blush" : "bg-[rgba(47,59,128,.05)]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-lg",
                        item.tone === "danger"
                          ? "bg-secondary text-white"
                          : "bg-white text-primary",
                      )}
                    >
                      <item.icon size={17} />
                    </span>
                    <h3
                      className={cn(
                        "mt-3.5 text-[0.9375rem] font-bold",
                        item.tone === "danger" && "!text-secondary",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* -------------------------------------------------- Actions */}
            <footer className="no-print flex flex-col gap-4 bg-[rgba(47,59,128,.05)] px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.875rem] font-bold text-primary shadow-card transition-colors hover:bg-white/70"
                >
                  <Printer size={16} />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.875rem] font-bold text-primary shadow-card transition-colors hover:bg-white/70"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={addToCalendar}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.875rem] font-bold text-primary shadow-card transition-colors hover:bg-white/70"
                >
                  <CalendarPlus size={16} />
                  Add to Calendar
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={bookAnother}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-primary-800"
                >
                  <Receipt size={16} />
                  Book Another
                </button>
                <Link
                  to="/"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[0.875rem] font-bold text-white transition-colors hover:bg-secondary-700"
                >
                  <Home size={16} />
                  Hospital Homepage
                </Link>
              </div>
            </footer>
          </article>

          {/* --------------------------------------------------------- Help */}
          <div className="no-print mt-4 flex flex-col gap-4 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgba(47,59,128,.06)] text-primary">
                <Headset size={19} />
              </span>
              <span>
                <span className="block text-[1rem] font-extrabold text-primary">
                  Need Help or Want to Reschedule?
                </span>
                <span className="mt-1 block text-[0.875rem] text-muted">
                  Chat with Brahmanandam OPD Help Desk or reach our patient
                  coordinator directly.
                </span>
              </span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[rgba(15,157,110,.1)] px-5 text-[0.875rem] font-bold text-success transition-colors hover:bg-[rgba(15,157,110,.16)]"
              >
                <CheckCircle2 size={16} />
                WhatsApp Help
              </a>
              <a
                href={site.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-5 text-[0.875rem] font-bold text-primary transition-colors hover:bg-[rgba(47,59,128,.11)]"
              >
                <Phone size={16} />
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
