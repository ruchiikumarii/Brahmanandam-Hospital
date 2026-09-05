import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------------- EKG line */

export function EkgLine({
  className = "",
  tone = "secondary",
  width = 108,
}: {
  className?: string;
  tone?: "secondary" | "primary" | "light";
  width?: number;
}) {
  const stroke =
    tone === "secondary"
      ? "var(--color-secondary)"
      : tone === "primary"
        ? "var(--color-primary)"
        : "rgba(255,255,255,.55)";
  return (
    <svg
      className={cn("ekg-draw", className)}
      width={width}
      height="16"
      viewBox="0 0 108 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 8h34l5-6 6 12 5-9 4 3h54"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------ Section head */

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  ekg = true,
  tone = "default",
  className = "",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  ekg?: boolean;
  tone?: "default" | "invert";
  className?: string;
  children?: ReactNode;
}) {
  const invert = tone === "invert";
  return (
    <div
      data-reveal
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", invert && "!text-secondary-400")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "mt-2 text-[1.75rem] leading-[1.15] font-extrabold sm:text-[2.15rem] lg:text-[2.5rem]",
          invert && "!text-white",
        )}
      >
        {title}
      </h2>
      {ekg ? (
        <EkgLine
          tone={invert ? "light" : "secondary"}
          className={cn("mt-2", align === "center" && "mx-auto")}
        />
      ) : null}
      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-[0.975rem] leading-relaxed",
            invert ? "text-white/75" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- Buttons */

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft"
  | "ghost"
  | "white";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-800 shadow-[0_10px_24px_-14px_rgba(47,59,128,.85)]",
  secondary:
    "bg-secondary text-white hover:bg-secondary-700 shadow-[0_10px_24px_-14px_rgba(190,53,58,.9)]",
  outline:
    "border border-primary/25 bg-white text-primary hover:border-primary/50 hover:bg-[rgba(47,59,128,.04)]",
  soft: "bg-[rgba(47,59,128,.07)] text-primary hover:bg-[rgba(47,59,128,.12)]",
  ghost: "text-primary hover:bg-[rgba(47,59,128,.06)]",
  white: "bg-white text-primary hover:bg-white/92",
};

const buttonSizes = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.875rem]",
  lg: "h-[3.25rem] px-7 text-[0.9375rem]",
};

type BtnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  pill?: boolean;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  pill = true,
  full = false,
  className = "",
}: Omit<BtnProps, "children">) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55",
    pill ? "rounded-full" : "rounded-xl",
    full && "w-full",
    buttonStyles[variant],
    buttonSizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  pill,
  full,
  className,
  children,
  ...rest
}: BtnProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...rest}
      className={buttonClass({ variant, size, pill, full, className })}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  pill,
  full,
  className,
  children,
  ...rest
}: BtnProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >) {
  const cls = buttonClass({ variant, size, pill, full, className });
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Badges */

export function Pill({
  children,
  tone = "primary",
  className = "",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "success" | "neutral";
  className?: string;
}) {
  const tones = {
    primary: "bg-[rgba(47,59,128,.07)] text-primary",
    secondary: "bg-[rgba(190,53,58,.07)] text-secondary",
    success: "bg-[rgba(15,157,110,.09)] text-success",
    neutral: "bg-tint text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stars({
  rating,
  size = 13,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span
      className={cn("inline-flex items-center gap-[1px]", className)}
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = !filled && i === full && half;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`half-${size}-${i}`}>
                <stop offset="50%" stopColor="var(--color-secondary)" />
                <stop offset="50%" stopColor="rgba(190,53,58,.24)" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.5 5.3 5.6.8-4 4 .9 5.7L10 14.7 5 17.4l1-5.7-4.1-4 5.7-.8z"
              fill={
                filled
                  ? "var(--color-secondary)"
                  : isHalf
                    ? `url(#half-${size}-${i})`
                    : "rgba(190,53,58,.22)"
              }
            />
          </svg>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------- Backgrounds */

/** Very low-opacity brand blobs + EKG trace used behind light sections. */
export function BrandBackdrop({
  variant = "soft",
  className = "",
}: {
  variant?: "soft" | "blush" | "none";
  className?: string;
}) {
  if (variant === "none") return null;
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            variant === "blush"
              ? "radial-gradient(circle, rgba(190,53,58,.07), transparent 68%)"
              : "radial-gradient(circle, rgba(47,59,128,.09), transparent 68%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(190,53,58,.055), transparent 68%)",
        }}
      />
      <svg
        className="absolute top-1/3 left-0 w-full opacity-[.16]"
        height="60"
        viewBox="0 0 1200 60"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30h420l14-20 16 40 14-30 12 10h714"
          stroke="rgba(190,53,58,.5)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function Section({
  children,
  tone = "white",
  className = "",
  id,
  backdrop = "none",
}: {
  children: ReactNode;
  tone?: "white" | "lavender" | "soft" | "deep";
  className?: string;
  id?: string;
  backdrop?: "soft" | "blush" | "none";
}) {
  const tones = {
    white: "bg-white",
    lavender: "bg-lavender",
    soft: "bg-tint-soft-grad",
    deep: "bg-primary-deep",
  };
  return (
    <section
      id={id}
      className={cn(
        "relative isolate py-12 sm:py-14 lg:py-16",
        tones[tone],
        className,
      )}
    >
      <BrandBackdrop variant={backdrop} />
      <div className="shell relative">{children}</div>
    </section>
  );
}
