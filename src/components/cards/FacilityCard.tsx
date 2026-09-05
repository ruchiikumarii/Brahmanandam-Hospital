import Image from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui";

type Facility = {
  slug: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  note: string;
  noteIcon: string;
  noteTone: string;
  eyebrowTone: string;
};

const noteToneClass: Record<string, string> = {
  success: "text-success",
  primary: "text-primary",
  secondary: "text-secondary",
};

export function FacilityCard({
  facility,
  priority = false,
  style,
}: {
  facility: Facility;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <article
      data-reveal
      style={style}
      className="flex h-full flex-col overflow-hidden rounded-[1.125rem] border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[450/215] w-full overflow-hidden bg-tint">
        <Image
          src={facility.image}
          alt={facility.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p
          className={cn(
            "flex items-center gap-2 text-[0.6875rem] font-extrabold tracking-[0.1em] uppercase",
            facility.eyebrowTone === "secondary" ? "text-secondary" : "text-primary",
          )}
        >
          <Icon
            name={
              facility.slug === "emergency"
                ? "siren"
                : facility.slug === "icu"
                  ? "activity"
                  : facility.slug === "ot"
                    ? "scalpel"
                    : facility.slug === "diagnostics"
                      ? "microscope"
                      : facility.slug === "pharmacy"
                        ? "pill"
                        : "ambulance"
            }
            size={15}
          />
          {facility.eyebrow}
        </p>
        <h3 className="mt-2.5 text-[1.1875rem] font-extrabold">{facility.title}</h3>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
          {facility.text}
        </p>
        <p
          className={cn(
            "mt-auto flex items-center gap-2 pt-5 text-[0.8125rem] font-semibold",
            noteToneClass[facility.noteTone] ?? "text-muted",
          )}
        >
          {facility.noteIcon === "dot" ? (
            <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
          ) : (
            <Icon
              name={facility.noteIcon === "check" ? "check-circle" : facility.noteIcon}
              size={15}
            />
          )}
          {facility.note}
        </p>
      </div>
    </article>
  );
}
