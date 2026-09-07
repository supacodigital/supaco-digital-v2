import type { CSSProperties } from "react";
import styles from "./Marquee.module.css";

/**
 * Bandeau de texte défilant en boucle (marquee CSS pur, sans JS).
 * - le contenu est réellement dans le DOM (indexable) ; la copie qui sert
 *   uniquement à boucler l'animation est `aria-hidden`.
 * - `prefers-reduced-motion` : l'animation est neutralisée (voir CSS), le
 *   texte reste lisible et statique.
 */
type MarqueeProps = {
  items: readonly string[];
  /** durée d'un cycle complet, en secondes (défaut 40) */
  speed?: number;
  /** libellé accessible de la région */
  label?: string;
  className?: string;
};

export function Marquee({ items, speed = 40, label, className }: MarqueeProps) {
  const list = (ariaHidden: boolean) => (
    <ul className={styles.group} aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`${styles.marquee} ${className ?? ""}`}
      role="marquee"
      aria-label={label}
      style={{ "--marquee-duration": `${speed}s` } as CSSProperties}
    >
      <div className={styles.viewport}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
