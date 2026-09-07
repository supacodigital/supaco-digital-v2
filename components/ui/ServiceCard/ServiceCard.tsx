import Link from "next/link";
import type { CSSProperties } from "react";
import type { Service } from "@/lib/site";
import { ServiceMotif } from "./ServiceMotif";
import styles from "./ServiceCard.module.css";

/**
 * Carte de service du mega-menu : fond dégradé (placeholder d'image) + motif
 * SVG discret, titre du service centré verticalement et horizontalement.
 * Le résumé apparaît sous le titre au survol.
 */
export function ServiceCard({ service }: { service: Service }) {
  const bgStyle = {
    "--card-from": service.bg.from,
    "--card-via": service.bg.via,
    "--card-to": service.bg.to,
    "--card-accent": service.bg.accent,
  } as CSSProperties;

  return (
    <Link
      href={`/services/${service.slug}`}
      className={styles.card}
      style={bgStyle}
    >
      <span className={styles.motif} aria-hidden="true">
        <ServiceMotif kind={service.motif} />
      </span>
      <span className={styles.veil} aria-hidden="true" />

      <span className={styles.center}>
        <span className={styles.title}>{service.title}</span>
        <span className={styles.summary}>{service.summary}</span>
      </span>
    </Link>
  );
}
