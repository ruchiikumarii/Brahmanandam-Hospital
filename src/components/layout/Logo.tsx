import { Link } from "react-router-dom";
import Image from "@/components/ui/Img";

/**
 * The hospital's own lockup - heart-and-hands mark, name, EKG rule and
 * "Multi Speciality Centre Sonari" - generated into public/brand by
 * scripts/brand-assets.py from the file the hospital supplied.
 *
 * The name is part of the artwork, so there is no text beside it to keep in
 * sync; the alt text carries it for screen readers and image search.
 *
 * `white` is a knock-out of the same artwork for the navy footer, where the
 * blue half of the colour logo would sink into the background.
 */
export const LOGO_ALT = "Brahmanandam Hospital, Multi Speciality Centre Sonari";

/* Intrinsic size of the 144px-tall raster, so the space is reserved before
   the image arrives and nothing shifts. */
const WIDTH = 467;
const HEIGHT = 144;

export function Logo({
  variant = "color",
  priority = false,
  className,
}: {
  variant?: "color" | "white";
  /** The header logo is above the fold on every page. */
  priority?: boolean;
  /** Height classes; the width follows the artwork. */
  className?: string;
}) {
  return (
    <Link
      to="/"
      aria-label="Brahmanandam Hospital home page"
      className="inline-flex shrink-0 items-center"
    >
      <Image
        src={variant === "white" ? "/brand/logo-white-144.png" : "/brand/logo-144.png"}
        alt={LOGO_ALT}
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        /* Sized for the tagline as much as the name: the lockup stacks two
           lines of name, a rule and a tagline, so at 48px the tagline was
           barely a smudge. The header row has room for more. */
        className={className ?? "h-11 w-auto lg:h-14"}
      />
    </Link>
  );
}
