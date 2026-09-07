/**
 * Icônes du header, en SVG inline (0 JS, pas de dépendance de librairie).
 * Style : trait 2px, bouts arrondis, grille 24.
 */

type IconProps = { size?: number; className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function MenuIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <path d="M4 9h16M4 15h16" />
    </svg>
  );
}

export function CloseIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
