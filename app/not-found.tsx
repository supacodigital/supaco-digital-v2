import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page introuvable",
  // remplace l'`index, follow` du layout : pas de directive contradictoire
  // avec le `noindex` que Next.js ajoute aux réponses 404
  robots: { index: false, follow: true },
};

/** Raccourcis proposés pour repartir : les pages qui comptent le plus. */
const shortcuts = [
  ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  { label: "Réalisations", href: "/#portfolio" },
  { label: "Produits", href: "/#produits" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Page 404 — affichée pour toute URL inconnue et pour les `notFound()` des
 * routes dynamiques (/services/[slug], /portfolio/[slug]). Rendue dans le
 * layout racine (header + footer). Next.js ajoute lui-même le
 * `noindex` sur les réponses 404.
 */
export default function NotFound() {
  return (
    <Container as="div" className={styles.wrap}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>

      <p className={styles.eyebrow}>Erreur 404</p>
      <h1 className={styles.title}>Cette page n&apos;existe pas (ou plus)</h1>
      <p className={styles.lede}>
        Le lien est peut-être erroné, ou la page a été déplacée. Repartez de
        l&apos;accueil ou choisissez une rubrique ci-dessous.
      </p>

      <div className={styles.actions}>
        <Button href="/" size="lg">
          Retour à l&apos;accueil
        </Button>
        <Button href="/#contact" size="lg" variant="ghost">
          Nous contacter
        </Button>
      </div>

      <nav className={styles.shortcuts} aria-label="Rubriques du site">
        <ul>
          {shortcuts.map((item) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={false}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
