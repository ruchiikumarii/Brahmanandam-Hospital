import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { specialities } from "@/lib/data/content";
import { departments } from "@/lib/data/departments";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function Specialities() {
  return (
    <Section tone="soft" backdrop="soft">
      <SectionHeading
        eyebrow="Clinical Excellence"
        title={<span className="tracking-[-0.01em] uppercase">Our Specialities</span>}
        subtitle="Comprehensive multi-disciplinary departments with modern diagnostic and surgical infrastructure under one roof in Sonari."
      />

      <ul className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {specialities.map((item, i) => (
          <li key={item.name} data-reveal="zoom" style={revealDelay(i, 55)}>
            <Link
              to={item.href}
              className="group flex h-full flex-col items-center justify-center rounded-[1.125rem] border border-line bg-white px-3 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift"
            >
              <span className="relative grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-[rgba(47,59,128,.07)] text-primary transition-colors group-hover:bg-[rgba(47,59,128,.11)]">
                <Icon name={item.icon} size={26} strokeWidth={1.8} />
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0.5 h-2.5 w-2.5 rounded-full bg-secondary"
                />
              </span>
              <h3 className="mt-4 text-[0.9375rem] font-bold">{item.name}</h3>
              <p className="mt-1 text-[0.75rem] text-muted">{item.caption}</p>
            </Link>
          </li>
        ))}

        <li data-reveal="zoom" style={revealDelay(9, 55)}>
          <Link
            to="/departments"
            className="group flex h-full flex-col items-center justify-center rounded-[1.125rem] border border-[rgba(190,53,58,.14)] bg-blush px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-secondary text-white transition-transform group-hover:scale-105">
              <ArrowRight size={24} strokeWidth={2.2} />
            </span>
            <h3 className="mt-4 text-[0.9375rem] font-extrabold !text-secondary">
              VIEW ALL
            </h3>
            <p className="mt-1 text-[0.75rem] text-muted">
              {departments.length} Departments
            </p>
          </Link>
        </li>
      </ul>
    </Section>
  );
}
