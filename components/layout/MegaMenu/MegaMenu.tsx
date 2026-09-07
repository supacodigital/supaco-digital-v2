import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";
import styles from "./MegaMenu.module.css";

/**
 * Panneau mega-menu « Services », pleine largeur, sous le header.
 * Une carte par pilier de service (fond dégradé + titre centré), suivie d'un
 * lien vers la page /services complète.
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
      <Container as="div" className={styles.inner}>
        <h2 className="sr-only">Nos services</h2>

        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <Link href="/services" className={styles.allLink}>
          Voir tous les services
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </Container>
    </div>
  );
}
