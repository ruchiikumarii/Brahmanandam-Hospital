import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { EkgLine } from "@/components/ui";

export function PageHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  icon,
  aside,
}: {
  /** Rendered inside the hero so there is no separate breadcrumb band. */
  crumbs?: Crumb[];
  eyebrow: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-tint-soft-grad pb-11 lg:pb-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-96 w-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(47,59,128,.08), transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(190,53,58,.05), transparent 70%)",
        }}
      />

      {crumbs ? <Breadcrumbs items={crumbs} /> : <div className="pt-8" />}

      <div className="shell relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div data-reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,59,128,.06)] px-3.5 py-2 text-[0.6875rem] font-extrabold tracking-[0.1em] text-primary uppercase">
            {icon ?? <span className="h-1.5 w-1.5 rounded-full bg-secondary" />}
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
            {title}
          </h1>
          <EkgLine className="mt-3" width={180} />
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-muted sm:text-base">
            {subtitle}
          </p>
        </div>
        {aside ? (
          <div data-reveal="right" className="lg:justify-self-end">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
