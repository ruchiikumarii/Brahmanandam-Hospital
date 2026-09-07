export type SlotSession = {
  id: "morning" | "evening";
  label: string;
  window: string;
  icon: "sunrise" | "sunset";
  slots: string[];
};

export const opdSessions: SlotSession[] = [
  {
    id: "morning",
    label: "Morning OPD Session",
    window: "10:00 AM - 01:00 PM",
    icon: "sunrise",
    slots: [
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
    ],
  },
  {
    id: "evening",
    label: "Evening OPD Session",
    window: "04:00 PM - 07:00 PM",
    icon: "sunset",
    slots: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"],
  },
];

export const allSlots = opdSessions.flatMap((s) => s.slots);

export type CalendarDay = {
  iso: string;
  day: number;
  weekday: string;
  monthShort: string;
  monthKey: string;
  isToday: boolean;
  isSunday: boolean;
  slotsOpen: number;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toIso(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Deterministic pseudo-random so server and client agree. */
function seeded(iso: string, salt: number) {
  let h = salt;
  for (let i = 0; i < iso.length; i += 1) {
    h = (h * 31 + iso.charCodeAt(i)) % 100000;
  }
  return h;
}

export function slotsOpenFor(iso: string, total = allSlots.length) {
  const d = new Date(`${iso}T00:00:00`);
  if (d.getDay() === 0) return 0;
  return 6 + (seeded(iso, 7) % Math.max(1, total - 5));
}

export function isSlotAvailable(iso: string, slot: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (d.getDay() === 0) return false;
  return seeded(iso + slot, 13) % 7 !== 0;
}

/** Builds the next `days` bookable dates starting from today. */
export function buildCalendar(days = 30, from = new Date()): CalendarDay[] {
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: CalendarDay[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = toIso(d);
    out.push({
      iso,
      day: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      monthShort: MONTHS[d.getMonth()].slice(0, 3).toUpperCase(),
      monthKey: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      isToday: i === 0,
      isSunday: d.getDay() === 0,
      slotsOpen: slotsOpenFor(iso),
    });
  }
  return out;
}

export function monthKeysOf(cal: CalendarDay[]) {
  return Array.from(new Set(cal.map((d) => d.monthKey)));
}

export function formatLongDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  const wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  return `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/**
 * First day that actually has an OPD (Sundays are emergency-only), so a
 * pre-selected date never lands on a closed day.
 */
export function firstBookableDay(cal: CalendarDay[]): CalendarDay {
  return cal.find((d) => !d.isSunday) ?? cal[0];
}

export function firstAvailableSlot(iso: string) {
  return allSlots.find((s) => isSlotAvailable(iso, s)) ?? "";
}

export const visitCategories = [
  "New In-Hospital OPD",
  "Follow-up Consultation",
  "Second Opinion",
  "Teleconsultation",
  "Pre-Surgical Evaluation",
];

export const genders = ["Female", "Male", "Other"];

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Not known"];
