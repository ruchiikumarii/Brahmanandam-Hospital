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
 * Every raster asset in `public/images` ships as both `.jpg` and `.webp`
 * (see the build notes in the README), so we serve WebP first and let the
 * browser fall back to the JPEG. Intrinsic width/height are always passed
 * through, which reserves layout space and keeps CLS at zero.
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

  const webp = /\.(jpe?g|png)$/i.test(src)
    ? src.replace(/\.(jpe?g|png)$/i, ".webp")
    : null;

  const img = (
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

  if (!webp) return img;

  return (
    <picture className="contents">
      <source srcSet={webp} type="image/webp" />
      {img}
    </picture>
  );
}
