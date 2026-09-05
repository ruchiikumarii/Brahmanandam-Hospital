import type { ImgHTMLAttributes } from "react";
import { cn } from "@/components/ui";

type ImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading"
> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Stretch to fill the nearest positioned ancestor. */
  fill?: boolean;
  /** Hint kept for API parity; ignored without a srcset. */
  sizes?: string;
  /** Load eagerly and with high priority (above-the-fold images). */
  priority?: boolean;
  loading?: "lazy" | "eager";
};

/**
 * Small wrapper that gives every <img> sensible loading defaults and
 * intrinsic dimensions so the browser can reserve space (no layout shift).
 */
export default function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes: _sizes,
  priority = false,
  loading,
  className,
  ...rest
}: ImgProps) {
  void _sizes;
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      {...rest}
    />
  );
}
