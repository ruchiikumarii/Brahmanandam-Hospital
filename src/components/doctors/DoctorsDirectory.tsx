import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { dayFilters, doctors, specialtyFilters } from "@/lib/data/doctors";
import { popularSearches } from "@/lib/data/content";
import { DoctorDirectoryCard } from "@/components/cards/DoctorDirectoryCard";
import { cn } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

type SortKey = "experience" | "rating" | "fee-low" | "name";

const sortLabels: { value: SortKey; label: string }[] = [
  { value: "experience", label: "Experience (Highest First)" },
  { value: "rating", label: "Patient Rating (Highest First)" },
  { value: "fee-low", label: "Consultation Fee (Lowest First)" },
  { value: "name", label: "Doctor Name (A – Z)" },
];

const windowLabels = [
  { value: "all", label: "All Timings (Morning & Evening)" },
  { value: "morning", label: "Morning OPD" },
  { value: "evening", label: "Evening OPD" },
];

export function DoctorsDirectory() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [day, setDay] = useState("all");
  const [opdWindow, setOpdWindow] = useState("all");
  const [sort, setSort] = useState<SortKey>("experience");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = doctors.filter((d) => {
      if (specialty !== "all" && d.specialtyLabel !== specialty) return false;
      if (day !== "all" && !d.days.includes(day)) return false;
      if (opdWindow !== "all" && d.opdWindow !== opdWindow && d.opdWindow !== "both")
        return false;
      if (!q) return true;
      const haystack = [
        d.name,
        d.specialty,
        d.specialtyLabel,
        d.qualification,
        d.designation,
        d.chamber,
        ...d.tags,
        ...d.expertise.map((e) => `${e.title} ${e.text}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return [...list].sort((a, b) => {
      if (sort === "experience") return b.experienceYears - a.experienceYears;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "fee-low") return a.fee - b.fee;
      return a.name.localeCompare(b.name);
    });
  }, [query, specialty, day, opdWindow, sort]);

  const reset = () => {
    setQuery("");
    setSpecialty("all");
    setDay("all");
    setOpdWindow("all");
    setSort("experience");
  };

  const filtersActive =
    query !== "" || specialty !== "all" || day !== "all" || opdWindow !== "all";

  return (
    <>
      {/* Filter panel */}
      <div
        data-reveal
        className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <label htmlFor="doctor-search" className="sr-only">
              Search doctors
            </label>
            <input
              id="doctor-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, condition (e.g. Hypertension, Joint pain)..."
              className="field h-[3.25rem] pl-11"
            />
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-[0.875rem] font-semibold text-primary transition-colors hover:bg-[rgba(47,59,128,.04)]"
          >
            <RotateCcw size={15} />
            Reset Filters
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            id="f-specialty"
            label="Clinical Specialty"
            icon={<ChevronDown size={16} />}
            value={specialty}
            onChange={setSpecialty}
            options={[
              { value: "all", label: `All Specialties (${specialtyFilters.length})` },
              ...specialtyFilters.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            id="f-day"
            label="Day Availability"
            icon={<CalendarDays size={16} />}
            value={day}
            onChange={setDay}
            options={[
              { value: "all", label: "Any Day" },
              ...dayFilters.map((d) => ({ value: d, label: d })),
            ]}
          />
          <FilterSelect
            id="f-window"
            label="OPD Window"
            icon={<Clock size={16} />}
            value={opdWindow}
            onChange={setOpdWindow}
            options={windowLabels}
          />
          <FilterSelect
            id="f-sort"
            label="Sort Specialists"
            icon={<SlidersHorizontal size={16} />}
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={sortLabels}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] text-muted">Popular Searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                  query === term
                    ? "bg-primary text-white"
                    : "bg-[rgba(47,59,128,.06)] text-primary hover:bg-[rgba(47,59,128,.11)]",
                )}
              >
                {term}
              </button>
            ))}
          </div>
          <p
            className="text-[0.875rem] font-bold text-primary"
            role="status"
            aria-live="polite"
          >
            Showing {results.length} Specialist{results.length === 1 ? "" : "s"} in
            Sonari
          </p>
        </div>
      </div>

      {/* Results */}
      {results.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((doctor, i) => (
            <DoctorDirectoryCard
              key={doctor.slug}
              doctor={doctor}
              style={revealDelay(i % 3, 90)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.25rem] border border-line bg-white p-12 text-center shadow-card">
          <p className="text-[1.125rem] font-bold text-primary">
            No specialists match these filters
          </p>
          <p className="mt-2 text-[0.9375rem] text-muted">
            Try a different specialty or clear the filters. You can also call our
            OPD reception for assistance.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-[0.875rem] font-bold text-white hover:bg-primary-800"
          >
            <RotateCcw size={15} /> Reset all filters
          </button>
        </div>
      )}

      {filtersActive ? (
        <p className="mt-4 text-center text-[0.8125rem] text-muted">
          Filters applied — reset to browse the full faculty registry.
        </p>
      ) : null}
    </>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.6875rem] font-bold tracking-[0.08em] text-muted uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field h-[3.125rem] appearance-none pr-10"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
