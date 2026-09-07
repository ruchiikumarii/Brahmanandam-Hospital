import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Loader2,
  Phone,
  RefreshCw,
  Search,
  ShieldPlus,
  Trash2,
  X,
} from "lucide-react";
import {
  appointmentStatuses,
  deleteAppointment,
  listAppointments,
  summarise,
  updateAppointment,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/appointments";
import { cn } from "@/components/ui";

const toneClass: Record<string, string> = {
  primary: "bg-[rgba(47,59,128,.09)] text-primary",
  secondary: "bg-[rgba(190,53,58,.09)] text-secondary",
  success: "bg-[rgba(15,157,110,.11)] text-success",
  muted: "bg-[rgba(98,106,140,.12)] text-muted",
};

function statusMeta(s: AppointmentStatus) {
  return appointmentStatuses.find((x) => x.value === s) ?? appointmentStatuses[0];
}

function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAppointments() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<AppointmentStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [when, setWhen] = useState<"all" | "today" | "upcoming" | "past">("all");
  const [open, setOpen] = useState<Appointment | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setRows(await listAppointments());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => summarise(rows), [rows]);

  const shown = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (when === "today" && r.appointment_date !== today) return false;
      if (when === "upcoming" && r.appointment_date < today) return false;
      if (when === "past" && r.appointment_date >= today) return false;
      if (!q) return true;
      return [
        r.patient_name,
        r.mobile,
        r.reference,
        r.doctor_name,
        r.department,
        r.chief_concern,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, tab, when, query]);

  const setStatus = async (row: Appointment, status: AppointmentStatus) => {
    setBusy(row.id);
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    setOpen((o) => (o && o.id === row.id ? { ...o, status } : o));
    try {
      await updateAppointment(row.id, { status });
    } catch (e) {
      setRows(prev); // put it back — the desk must not see a lie
      setErr(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (row: Appointment) => {
    if (
      !window.confirm(
        `Delete the booking for ${row.patient_name} (${row.reference})? This cannot be undone.`,
      )
    )
      return;
    setBusy(row.id);
    try {
      await deleteAppointment(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      setOpen(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[1.5rem] font-extrabold">Appointments</h1>
          <p className="mt-1 text-[0.875rem] text-muted">
            Every OPD booking made on the website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[0.8125rem] font-bold text-primary hover:bg-[rgba(47,59,128,.04)]"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total bookings", value: stats.total },
          { label: "Today", value: stats.todays },
          { label: "Upcoming", value: stats.upcoming },
          { label: "Needs action", value: stats.unattended, accent: true },
        ].map((s) => (
          <li
            key={s.label}
            className="rounded-[1.125rem] border border-line bg-white p-4 shadow-card"
          >
            <p
              className={cn(
                "font-display text-[1.75rem] leading-none font-extrabold",
                s.accent && stats.unattended > 0 ? "text-secondary" : "text-primary",
              )}
            >
              {s.value}
            </p>
            <p className="mt-1.5 text-[0.75rem] font-semibold text-muted">
              {s.label}
            </p>
          </li>
        ))}
      </ul>

      {err ? (
        <p className="mt-4 rounded-xl bg-[rgba(190,53,58,.07)] px-4 py-3 text-[0.8125rem] font-semibold text-secondary">
          {err}
        </p>
      ) : null}

      {/* filters */}
      <div className="mt-5 flex flex-col gap-3 rounded-[1.125rem] border border-line bg-white p-4 shadow-card lg:flex-row lg:items-center">
        <div className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto">
          {(["all", ...appointmentStatuses.map((s) => s.value)] as const).map((v) => {
            const label =
              v === "all" ? "All" : appointmentStatuses.find((s) => s.value === v)!.label;
            const count =
              v === "all" ? rows.length : rows.filter((r) => r.status === v).length;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setTab(v)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                  tab === v
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-[rgba(47,59,128,.06)]",
                )}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <select
            value={when}
            onChange={(e) => setWhen(e.target.value as typeof when)}
            className="field h-10 w-full sm:w-44"
            aria-label="Filter by date"
          >
            <option value="all">Any date</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, mobile, reference…"
              className="field h-10 pl-10"
              aria-label="Search appointments"
            />
          </div>
        </div>
      </div>

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-[1.125rem] border border-line bg-white shadow-card">
        {loading ? (
          <p className="flex items-center justify-center gap-2 py-16 text-[0.875rem] text-muted">
            <Loader2 size={16} className="animate-spin" /> Loading bookings…
          </p>
        ) : !shown.length ? (
          <p className="py-16 text-center text-[0.9375rem] text-muted">
            {rows.length
              ? "No bookings match these filters."
              : "No appointments yet. Bookings made on the website will appear here."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] text-left">
              <thead>
                <tr className="border-b border-line text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">
                  <th className="px-4 py-3 whitespace-nowrap">Patient</th>
                  <th className="px-4 py-3 whitespace-nowrap">Appointment</th>
                  <th className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                    Doctor
                  </th>
                  <th className="hidden px-4 py-3 whitespace-nowrap lg:table-cell">
                    Booked
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => {
                  const meta = statusMeta(r.status);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-line last:border-0 hover:bg-[rgba(47,59,128,.02)]"
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setOpen(r)}
                          className="text-left"
                        >
                          <span className="block text-[0.875rem] font-bold text-primary">
                            {r.patient_name}
                          </span>
                          <span className="mt-0.5 block text-[0.75rem] text-muted">
                            {r.mobile}
                            {r.age ? ` · ${r.age}y` : ""}
                            {r.gender ? ` · ${r.gender}` : ""}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block text-[0.875rem] font-semibold text-ink">
                          {fmtDate(r.appointment_date)}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] text-muted">
                          {r.appointment_time}
                          {r.token ? ` · Token ${r.token}` : ""}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <span className="block text-[0.8125rem] text-ink">
                          {r.doctor_name || "—"}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] text-muted">
                          {r.department || ""}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-[0.75rem] whitespace-nowrap text-muted lg:table-cell">
                        {fmtWhen(r.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          disabled={busy === r.id}
                          onChange={(e) =>
                            void setStatus(r, e.target.value as AppointmentStatus)
                          }
                          className={cn(
                            "h-8 cursor-pointer rounded-full border-0 px-2.5 text-[0.75rem] font-bold",
                            toneClass[meta.tone],
                          )}
                          aria-label={`Status for ${r.patient_name}`}
                        >
                          {appointmentStatuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <a
                          href={`tel:+91${r.mobile}`}
                          title={`Call ${r.patient_name}`}
                          className="mr-1 inline-grid h-8 w-8 place-items-center rounded-lg text-primary hover:bg-[rgba(47,59,128,.07)]"
                        >
                          <Phone size={15} />
                        </a>
                        <button
                          type="button"
                          onClick={() => void remove(r)}
                          title="Delete booking"
                          className="inline-grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-[rgba(190,53,58,.08)] hover:text-secondary"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* detail drawer */}
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(19,24,54,.5)] p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[1.25rem] bg-white p-6 shadow-lift sm:rounded-[1.25rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.08em] text-muted uppercase">
                  {open.reference}
                </p>
                <h2 className="mt-1 text-[1.25rem] font-extrabold">
                  {open.patient_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(47,59,128,.06)] text-primary"
              >
                <X size={17} />
              </button>
            </div>

            <dl className="mt-5 grid gap-0 divide-y divide-line">
              {[
                ["Mobile", `+91 ${open.mobile}`],
                [
                  "Age / Gender",
                  [open.age ? `${open.age} years` : null, open.gender]
                    .filter(Boolean)
                    .join(" · ") || "—",
                ],
                ["Blood group", open.blood_group || "—"],
                [
                  "Appointment",
                  `${fmtDate(open.appointment_date)} · ${open.appointment_time}`,
                ],
                ["OPD token", open.token || "—"],
                ["Doctor", open.doctor_name || "—"],
                ["Department", open.department || "—"],
                ["Visit category", open.visit_category || "—"],
                ["Consultation fee", open.fee ? `₹${open.fee}` : "—"],
                ["Booked on", fmtWhen(open.created_at)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-[0.8125rem] text-muted">{k}</dt>
                  <dd className="text-right text-[0.875rem] font-semibold text-ink">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            {open.insurance ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-[rgba(15,157,110,.08)] px-3.5 py-2.5 text-[0.8125rem] font-semibold text-success">
                <ShieldPlus size={15} />
                Cashless / TPA assistance requested
              </p>
            ) : null}

            {open.chief_concern ? (
              <div className="mt-4 rounded-xl bg-[rgba(47,59,128,.04)] p-4">
                <p className="text-[0.6875rem] font-bold tracking-[0.07em] text-muted uppercase">
                  Chief concern
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink">
                  {open.chief_concern}
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`tel:+91${open.mobile}`}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[0.875rem] font-bold text-white hover:bg-primary-800"
              >
                <Phone size={15} /> Call patient
              </a>
              <a
                href={`https://wa.me/91${open.mobile}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[rgba(15,157,110,.1)] px-5 text-[0.875rem] font-bold text-success"
              >
                WhatsApp
              </a>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {appointmentStatuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={busy === open.id}
                  onClick={() => void setStatus(open, s.value)}
                  className={cn(
                    "h-9 rounded-full px-3.5 text-[0.75rem] font-bold transition-colors",
                    open.status === s.value
                      ? toneClass[s.tone]
                      : "bg-[rgba(47,59,128,.04)] text-muted hover:bg-[rgba(47,59,128,.09)]",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-4 flex items-center gap-2 text-[0.75rem] text-muted">
        <CalendarDays size={13} />
        Bookings are stored in Supabase and are only readable when signed in.
      </p>
    </div>
  );
}
