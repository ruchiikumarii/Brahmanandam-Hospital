import Image from "@/components/ui/Img";
import type { Doctor } from "@/lib/data/doctors";
import { cn } from "@/components/ui";

/**
 * Portrait where the hospital has supplied one, initials otherwise.
 *
 * Every doctor here is a real, named clinician, so a generic stock face would
 * misrepresent them. Initials are honest and stay legible at any size; adding
 * `photo` to the record swaps it for the real portrait with no other change.
 */
export function DoctorAvatar({
  doctor,
  className = "",
  size = 84,
  rounded = "rounded-xl",
}: {
  doctor: Doctor;
  className?: string;
  size?: number;
  rounded?: string;
}) {
  if (doctor.photo) {
    return (
      <Image
        src={doctor.photo}
        alt={`${doctor.name}, ${doctor.designation}`}
        width={size * 2}
        height={size * 2}
        className={cn("object-cover", rounded, className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center bg-[rgba(47,59,128,.07)] font-display font-extrabold text-primary",
        rounded,
        className,
      )}
      style={{ fontSize: Math.max(13, Math.round(size * 0.34)) }}
    >
      {doctor.initials}
    </span>
  );
}
