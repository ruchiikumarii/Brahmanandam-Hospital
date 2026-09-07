import { getSupabase } from "@/lib/cms/supabase";
import type { ConfirmedBooking } from "@/lib/appointment-context";

export type AppointmentStatus =
  | "new"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Appointment = {
  id: string;
  reference: string;
  token: string | null;
  patient_name: string;
  mobile: string;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  department: string | null;
  doctor_slug: string | null;
  doctor_name: string | null;
  appointment_date: string;
  appointment_time: string;
  visit_category: string | null;
  chief_concern: string | null;
  insurance: boolean;
  fee: number | null;
  status: AppointmentStatus;
  desk_notes: string | null;
  created_at: string;
  updated_at: string;
};

export const appointmentStatuses: {
  value: AppointmentStatus;
  label: string;
  tone: "primary" | "success" | "secondary" | "muted";
}[] = [
  { value: "new", label: "New", tone: "secondary" },
  { value: "confirmed", label: "Confirmed", tone: "primary" },
  { value: "completed", label: "Completed", tone: "success" },
  { value: "cancelled", label: "Cancelled", tone: "muted" },
  { value: "no_show", label: "No show", tone: "muted" },
];

/**
 * Records a booking made on the public site.
 *
 * Deliberately never throws: the patient has already seen their reference and
 * OPD token on the confirmation screen, so a database hiccup must not turn a
 * successful booking into an error page. A failure is reported back so the UI
 * can tell the patient to confirm by phone.
 */
export async function saveAppointment(
  booking: ConfirmedBooking,
  doctorName: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "cms-disabled" };

  const age = Number.parseInt(booking.age, 10);

  const { error } = await supabase.from("appointments").insert({
    reference: booking.reference,
    token: booking.token,
    patient_name: booking.patientName.trim(),
    mobile: booking.mobile.trim(),
    age: Number.isFinite(age) ? age : null,
    gender: booking.gender || null,
    blood_group: booking.bloodGroup || null,
    department: booking.department || null,
    doctor_slug: booking.doctor || null,
    doctor_name: doctorName || null,
    appointment_date: booking.date,
    appointment_time: booking.time,
    visit_category: booking.visitCategory || null,
    chief_concern: booking.chiefConcern?.trim() || null,
    insurance: booking.insurance,
    status: "new",
  });

  if (error) {
    console.warn("[appointments] could not record booking:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ------------------------------------------------------------ admin reads */

export async function listAppointments(): Promise<Appointment[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return (data ?? []) as Appointment[];
}

export async function updateAppointment(
  id: string,
  patch: Partial<Pick<Appointment, "status" | "desk_notes">>,
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("CMS disabled");
  const { error } = await supabase.from("appointments").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAppointment(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("CMS disabled");
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Counts for the dashboard tiles. */
export function summarise(rows: Appointment[]) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: rows.length,
    todays: rows.filter((r) => r.appointment_date === today).length,
    upcoming: rows.filter(
      (r) =>
        r.appointment_date >= today &&
        (r.status === "new" || r.status === "confirmed"),
    ).length,
    unattended: rows.filter((r) => r.status === "new").length,
  };
}
