import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  rootMargin?: string;
}

/**
 * Lazy-loads an image when it enters the viewport. Shows a shimmer
 * skeleton placeholder until the image finishes decoding.
 */
export default function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  rootMargin = "200px",
  ...rest
}: LazyImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setInView(true); io.disconnect(); break; }
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return (
    <div ref={ref} className={cn("relative w-full h-full overflow-hidden", wrapperClassName)}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-surface via-muted/40 to-surface animate-pulse"
        />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}
