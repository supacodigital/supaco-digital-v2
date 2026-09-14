import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";
import styles from "./MegaMenu.module.css";

/**
 * Panneau mega-menu « Services », pleine largeur, sous le header.
 * Une carte pleine hauteur par pilier de service (photo + titre centré),
 * en grille edge-to-edge (pas de marge ni gap entre les cartes).
 *
 * L'ouverture / fermeture (survol + zone de grâce) est pilotée par le Header ;
 * ce composant n'est que la vue.
 */
export function MegaMenu({ id }: { id: string }) {
  return (
    <div
      className={styles.panel}
      id={id}
      role="region"
      aria-label="Nos services"
    >
      <h2 className="sr-only">Nos services</h2>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <ServiceCard key={service.slug} service={service} index={index} />
        ))}
      </div>
    </div>
  );
}
