import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Asterisk,
  CircleCheck,
  Phone,
  Search,
  Stethoscope,
} from "lucide-react";
import {
  departmentCategories,
  departments,
  type DepartmentCategory,
} from "@/lib/data/departments";
import { site } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function DepartmentsExplorer() {
  const [category, setCategory] = useState<DepartmentCategory | "all">("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return departments.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (!q) return true;
      return [d.name, d.summary, d.lead.name, d.lead.meta, ...d.capabilities]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [category, query]);

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Department categories"
          className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card lg:mx-0"
        >
          {departmentCategories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              type="button"
              aria-selected={category === cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                category === cat.id
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-[rgba(47,59,128,.06)] hover:text-primary",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search
            size={17}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <label htmlFor="dept-search" className="sr-only">
            Search speciality or doctor
          </label>
          <input
            id="dept-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search speciality or doctor..."
            className="field h-12 rounded-full bg-white pl-11 shadow-card"
          />
        </div>
      </div>

      {results.length ? (
        <ul className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((dept, i) => {
            const isEmergency = dept.slug === "emergency-trauma-care";
            return (
              <li
                key={dept.slug}
                data-reveal
                style={revealDelay(i % 3, 90)}
                className="h-full"
              >
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[1.125rem] border bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift",
                    isEmergency ? "border-[rgba(190,53,58,.2)]" : "border-line",
                  )}
                >
                  {isEmergency ? (
                    <span
                      aria-hidden="true"
                      className="block h-1.5 w-full bg-secondary"
                    />
                  ) : null}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-xl",
                          isEmergency
                            ? "bg-[rgba(190,53,58,.07)] text-secondary"
                            : "bg-[rgba(47,59,128,.06)] text-primary",
                        )}
                      >
                        <Icon name={dept.icon} size={22} />
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[0.75rem] font-bold whitespace-nowrap",
                          isEmergency
                            ? "flex items-center gap-1.5 bg-[rgba(190,53,58,.07)] text-secondary"
                            : "bg-[rgba(47,59,128,.06)] text-primary",
                        )}
                      >
                        {isEmergency ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        ) : null}
                        {dept.badge}
                      </span>
                    </div>

                    <h2
                      className={cn(
                        "mt-5 text-[1.1875rem] leading-tight font-extrabold",
                        isEmergency && "!text-secondary",
                      )}
                    >
                      <Link to={`/departments/${dept.slug}`} className="hover:underline">
                        {dept.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                      {dept.summary}
                    </p>

                    {isEmergency ? (
                      <div className="mt-4 rounded-xl bg-blush p-4">
                        <p className="flex flex-wrap items-center gap-2 text-[0.875rem] font-bold text-secondary">
                          <Phone size={15} />
                          Emergency Dispatch Hotline:
                          <a
                            href={site.phoneHref}
                            className="font-display text-[1.25rem] font-extrabold hover:underline"
                          >
                            {site.phone}
                          </a>
                        </p>
                        <p className="mt-1.5 text-[0.8125rem] text-muted">
                          {dept.hotlineNote}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-[rgba(47,59,128,.05)] p-4">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.875rem]">
                          <Stethoscope size={15} className="text-secondary" />
                          <span className="font-bold text-primary">
                            {dept.lead.label}:
                          </span>
                          {dept.lead.doctorSlug ? (
                            <Link
                              to={`/doctors/${dept.lead.doctorSlug}`}
                              className="font-bold text-ink hover:text-secondary"
                            >
                              {dept.lead.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-ink">{dept.lead.name}</span>
                          )}
                        </p>
                        <p className="mt-1 text-[0.8125rem] text-muted">
                          {dept.lead.meta}
                        </p>
                      </div>
                    )}

                    <p className="mt-4 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">
                      {dept.capabilityLabel}
                    </p>
                    <ul className="mt-2.5 grid gap-2">
                      {dept.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="flex items-start gap-2 text-[0.875rem] text-ink"
                        >
                          {isEmergency ? (
                            <Asterisk
                              size={14}
                              className="mt-1 shrink-0 text-secondary"
                              strokeWidth={2.6}
                            />
                          ) : (
                            <CircleCheck
                              size={15}
                              className="mt-0.5 shrink-0 text-success"
                            />
                          )}
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={cn(
                      "mt-auto flex items-center justify-between gap-3 border-t px-5 py-4",
                      isEmergency
                        ? "border-[rgba(190,53,58,.14)] bg-blush"
                        : "border-line bg-[rgba(47,59,128,.02)]",
                    )}
                  >
                    <Link
                      to={dept.secondaryAction.href}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[0.875rem] font-bold transition-colors",
                        isEmergency
                          ? "text-secondary hover:underline"
                          : "text-primary hover:text-secondary",
                      )}
                    >
                      {dept.secondaryAction.label}
                      <ArrowRight size={15} strokeWidth={2.3} />
                    </Link>

                    {dept.primaryAction.href.startsWith("tel:") ? (
                      <a
                        href={dept.primaryAction.href}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-secondary px-4 text-[0.8125rem] font-bold text-white transition-colors hover:bg-secondary-700"
                      >
                        <Phone size={14} />
                        {dept.primaryAction.label}
                      </a>
                    ) : (
                      <Link
                        to={dept.primaryAction.href}
                        className={cn(
                          "inline-flex h-10 items-center rounded-full px-4 text-[0.8125rem] font-bold text-white transition-colors",
                          dept.slug === "icu-critical-care"
                            ? "bg-primary hover:bg-primary-800"
                            : "bg-secondary hover:bg-secondary-700",
                        )}
                      >
                        {dept.primaryAction.label}
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-7 rounded-[1.25rem] border border-line bg-white p-12 text-center shadow-card">
          <p className="text-[1.125rem] font-bold text-primary">
            No departments match your search
          </p>
          <p className="mt-2 text-[0.9375rem] text-muted">
            Try another speciality name, or call our OPD desk on {site.phone}.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-6 text-[0.875rem] font-bold text-white hover:bg-primary-800"
          >
            Show all departments
          </button>
        </div>
      )}
    </>
  );
}
