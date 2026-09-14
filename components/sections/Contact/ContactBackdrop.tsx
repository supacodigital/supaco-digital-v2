import styles from "./ContactBackdrop.module.css";

/**
 * Décor de la section Contact — purement présentationnel, rendu côté serveur.
 *
 * Trois couches, du fond vers l'avant :
 *  1. deux halos dégradés (« aurore ») en CSS pur, animés très lentement ;
 *  2. une grille en perspective qui file vers l'horizon (SVG inline, pas de
 *     requête réseau, masquée en fondu vers le haut) ;
 *  3. un grain fin pour casser le banding des dégradés sur écran large.
 *
 * Tout est en `transform` / `opacity` uniquement (compositing GPU) et neutralisé
 * par `prefers-reduced-motion`.
 */
export function ContactBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.aurora} data-layer="a" />
      <div className={styles.aurora} data-layer="b" />

      <div className={styles.gridWrap}>
        <svg
          className={styles.grid}
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            {/* fondu du bas (dense) vers le haut (invisible) */}
            <linearGradient id="contact-grid-fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#35a7f0" stopOpacity="0.5" />
              <stop offset="55%" stopColor="#35a7f0" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#35a7f0" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g stroke="url(#contact-grid-fade)" strokeWidth="1" fill="none">
            {/* lignes de fuite : convergent vers le point de fuite (600, 0) */}
            {Array.from({ length: 25 }, (_, i) => {
              const x = (i / 24) * 2400 - 600;
              return <line key={`v${i}`} x1={x} y1="400" x2="600" y2="0" />;
            })}

            {/* lignes d'horizon : espacement quadratique = effet de profondeur */}
            {Array.from({ length: 11 }, (_, i) => {
              const y = 400 - Math.pow(i / 10, 2) * 400;
              return <line key={`h${i}`} x1="0" y1={y} x2="1200" y2={y} />;
            })}
          </g>
        </svg>
      </div>

      <div className={styles.grain} />
    </div>
  );
}
