import { useId } from "react";

/**
 * Icône seule Supaco (le monogramme "S" formé de deux chevrons).
 * Vectorisée depuis logosupa.png.
 *
 * - variant="gradient" : dégradé signature cyan -> bleu (header, footer, usage principal)
 * - variant="mono"     : bleu marine #011A42 (fond très clair) ou currentColor
 *
 * ⚠️ Ne jamais recolorer dans une autre teinte que ses deux variantes officielles.
 */

type SupacoMarkProps = {
  variant?: "gradient" | "mono";
  /** Taille en pixels (carré). Par défaut hérite de la font-size via `1em`. */
  size?: number | string;
  title?: string;
  className?: string;
};

export function SupacoMark({
  variant = "gradient",
  size = "1em",
  title,
  className,
}: SupacoMarkProps) {
  // useId() : identifiant stable entre serveur et client (évite le hydration mismatch)
  const rawId = useId();
  const gradientId = `supaco-mark-${rawId.replace(/:/g, "")}`;
  const fill = variant === "gradient" ? `url(#${gradientId})` : "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1200"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {variant === "gradient" ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="1200"
            y2="1200"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#35A7F0" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      ) : null}
      <g fill={fill}>
        <path d="M568.2 334.1c-7.9 1.3-17 4.7-23.5 8.6-6.4 3.9-16.3 12.6-77.2 67.8-23.1 21-45 40.8-48.6 44.1-9.6 8.5-36.7 33.4-65.1 59.6-31.8 29.5-37 36.4-41.9 55.9-4.8 18.9.3 41.4 12.4 54.7 2.3 2.5 29 28.5 59.3 57.7 57 55 58.2 56 69.7 59.1 7.7 2 103.2 2 108.2 0 3.6-1.5 6.5-6 6.5-9.8-.1-4.7 3.6-1-76-75.3-56.6-52.8-59.3-55.4-62.2-59.6-3.4-5.1-4.3-10.6-2.8-17.2 1.2-4.8 2.4-6.3 15.4-19.3 18.9-18.8 123.6-118.6 142.5-135.7 14.2-13 17.1-13.7 57.2-13.7 42.5 0 42.3.1 68.2-24.3 8.4-7.9 24-22.3 34.7-32.1 10.7-9.9 20.4-18.7 21.5-19.7 1.9-1.9-.5-1.9-95.5-1.8-53.6.1-99.9.5-102.8 1" />
        <path d="M619.1 473.8c-1.9.9-4.4 3-5.5 4.5-2.9 3.9-2.7 12 .4 17.5 1.3 2.3 18.4 19.2 41.3 40.8 21.5 20.3 39.9 37.7 40.8 38.6 1 .9 10.7 9.9 21.6 20 33.5 30.9 42 39.6 43.3 44.8 1.5 5.7.6 12.2-2.4 17.4-1.4 2.3-10.5 11.5-20.8 20.7-29.7 26.7-87 78.3-103.4 93-16 14.4-22 19-28.2 21.6-10.4 4.4-12.1 4.5-59.2 5.2-52 .8-49.6.4-62.5 10.1-5.7 4.3-45.5 39.7-69.5 61.7l-3.5 3.3 115.5-.3 115.5-.2 8.8-2.8c11.3-3.5 22.6-9.2 31.4-15.9 3.9-2.9 18.9-16.3 33.4-29.8 31.7-29.5 72.3-66.8 87.4-80.4 33.3-30 64.8-59.1 69.3-64.1 19.6-22 20.1-58.3 1-80-2.3-2.6-18.9-18.5-36.8-35.3s-44.6-42.1-59.4-56.1c-14.8-14.1-28.9-27.1-31.4-28.9-2.6-1.8-7.5-4.1-11-5.2-6-1.9-9.5-2-59.6-2-48.6 0-53.4.2-56.5 1.8" />
      </g>
    </svg>
  );
}
