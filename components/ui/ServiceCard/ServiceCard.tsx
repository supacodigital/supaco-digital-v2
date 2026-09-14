import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Service } from "@/lib/site";
import { ServiceMotif } from "./ServiceMotif";
import styles from "./ServiceCard.module.css";

/**
 * Carte de service du mega-menu : photo de fond (dégradé en secours pendant
 * le chargement) + motif SVG en filigrane, titre ancré en bas-gauche façon
 * éditoriale (numéro de pilier + titre). Le résumé apparaît sous le titre
 * au survol.
 */
export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
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
      <Image
        src={service.image}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 25vw"
        className={styles.photo}
      />
      <span className={styles.motif} aria-hidden="true">
        <ServiceMotif kind={service.motif} />
      </span>
      <span className={styles.veil} aria-hidden="true" />

      <span className={styles.content}>
        <span className={styles.index} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.title}>{service.title}</span>
        <span className={styles.summary}>{service.summary}</span>
      </span>
    </Link>
  );
}
