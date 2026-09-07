import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BookingDraft = {
  department: string;
  doctor: string;
  date: string;
  time: string;
  patientName: string;
  mobile: string;
  age: string;
  gender: string;
  bloodGroup: string;
  visitCategory: string;
  chiefConcern: string;
  insurance: boolean;
};

export type ConfirmedBooking = BookingDraft & {
  reference: string;
  token: string;
  bookedAt: string;
  /** Set when the booking could not be written to the desk queue. */
  deskSyncFailed?: boolean;
};

export const emptyDraft: BookingDraft = {
  department: "",
  doctor: "",
  date: "",
  time: "",
  patientName: "",
  mobile: "",
  age: "",
  gender: "",
  bloodGroup: "",
  visitCategory: "New In-Hospital OPD",
  chiefConcern: "",
  insurance: false,
};

type Ctx = {
  draft: BookingDraft;
  setDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  confirmed: ConfirmedBooking | null;
  confirmBooking: (b: ConfirmedBooking) => void;
  hydrated: boolean;
};

const AppointmentContext = createContext<Ctx | null>(null);

const DRAFT_KEY = "bh.booking.draft";
const CONFIRMED_KEY = "bh.booking.confirmed";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — booking still works in-memory */
  }
}

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft>(emptyDraft);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = read<BookingDraft>(DRAFT_KEY);
    if (d) setDraftState({ ...emptyDraft, ...d });
    const c = read<ConfirmedBooking>(CONFIRMED_KEY);
    if (c) setConfirmed(c);
    setHydrated(true);
  }, []);

  const setDraft = useCallback((patch: Partial<BookingDraft>) => {
    setDraftState((prev) => {
      const next = { ...prev, ...patch };
      write(DRAFT_KEY, next);
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraftState(emptyDraft);
    write(DRAFT_KEY, emptyDraft);
  }, []);

  const confirmBooking = useCallback((b: ConfirmedBooking) => {
    setConfirmed(b);
    write(CONFIRMED_KEY, b);
  }, []);

  const value = useMemo(
    () => ({ draft, setDraft, resetDraft, confirmed, confirmBooking, hydrated }),
    [draft, setDraft, resetDraft, confirmed, confirmBooking, hydrated],
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointment must be used inside <AppointmentProvider>");
  }
  return ctx;
}

const DEPT_CODES: Record<string, string> = {
  cardiology: "CARD",
  "obstetrics-gynaecology": "OBGY",
  "orthopaedics-trauma-surgery": "ORTH",
  "paediatrics-neonatal-care": "PAED",
  "general-laparoscopic-surgery": "SURG",
  "general-medicine-diabetology": "MEDI",
  "emergency-trauma-care": "EMER",
  "diagnostic-imaging-pathology": "DIAG",
  "icu-critical-care": "ICUC",
};

export function buildReference(departmentSlug: string, seed: string) {
  const code = DEPT_CODES[departmentSlug] ?? "OPDX";
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 33 + seed.charCodeAt(i)) % 99999;
  const year = new Date().getFullYear();
  return `BH-${year}-${code}-${`${h}`.padStart(5, "0")}`;
}

export function buildToken(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 17 + seed.charCodeAt(i)) % 60;
  return `#${`${h + 1}`.padStart(2, "0")}`;
}
