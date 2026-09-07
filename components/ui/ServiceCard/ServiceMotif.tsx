/**
 * Décor SVG discret dessiné en fond de chaque ServiceCard (placeholder en
 * attendant de vraies photos). Un motif par pilier de service.
 * Tracé fin, blanc translucide — s'efface derrière le titre.
 */

type MotifKind = "browser" | "network" | "blocks" | "flow";

const stroke = "rgba(255,255,255,0.12)";
const fillFaint = "rgba(255,255,255,0.06)";

export function ServiceMotif({ kind }: { kind: MotifKind }) {
  return (
    <svg
      viewBox="0 0 320 220"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ width: "100%", height: "100%" }}
    >
      {kind === "browser" && (
        <g fill="none" stroke={stroke} strokeWidth="2">
          <rect x="70" y="52" width="180" height="120" rx="10" />
          <line x1="70" y1="76" x2="250" y2="76" />
          <circle cx="84" cy="64" r="3" fill={fillFaint} stroke="none" />
          <circle cx="94" cy="64" r="3" fill={fillFaint} stroke="none" />
          <circle cx="104" cy="64" r="3" fill={fillFaint} stroke="none" />
          <rect x="86" y="92" width="70" height="8" rx="4" fill={fillFaint} stroke="none" />
          <rect x="86" y="110" width="140" height="6" rx="3" fill={fillFaint} stroke="none" />
          <rect x="86" y="126" width="116" height="6" rx="3" fill={fillFaint} stroke="none" />
        </g>
      )}

      {kind === "network" && (
        <>
          <g fill="none" stroke={stroke} strokeWidth="2">
            <path d="M96 70 L160 48 L232 82 M96 70 L136 140 M160 48 L196 128 M232 82 L196 128 M136 140 L196 128 M136 140 L104 180 M196 128 L226 176" />
          </g>
          <g fill="rgba(255,255,255,0.16)">
            <circle cx="96" cy="70" r="5" />
            <circle cx="160" cy="48" r="6" />
            <circle cx="232" cy="82" r="5" />
            <circle cx="136" cy="140" r="5" />
            <circle cx="196" cy="128" r="7" />
            <circle cx="104" cy="180" r="4" />
            <circle cx="226" cy="176" r="4" />
          </g>
        </>
      )}

      {kind === "blocks" && (
        <>
          <g fill={fillFaint} stroke={stroke} strokeWidth="2">
            <rect x="92" y="56" width="66" height="46" rx="8" />
            <rect x="170" y="56" width="66" height="46" rx="8" />
            <rect x="92" y="118" width="66" height="46" rx="8" />
            <rect x="170" y="118" width="66" height="46" rx="8" />
          </g>
          <g fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2">
            <path d="M158 79 L170 79 M125 102 L125 118 M203 102 L203 118" />
          </g>
        </>
      )}

      {kind === "flow" && (
        <g fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2">
          <path d="M74 110 h58 m0 0 l-9 -7 m9 7 l-9 7" />
          <path d="M188 110 h58 m0 0 l-9 -7 m9 7 l-9 7" />
          <circle cx="160" cy="110" r="22" />
          <circle cx="160" cy="110" r="7" fill="rgba(255,255,255,0.12)" stroke="none" />
          <path d="M160 78 v-9 M160 142 v9 M192 110 h9 M119 110 h9" />
          <path d="M96 160 h128" strokeDasharray="3 8" />
          <path d="M96 60 h128" strokeDasharray="3 8" />
        </g>
      )}
    </svg>
  );
}
