"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import styles from "./Footer.module.css";

/**
 * Rappel de conversion du footer. Masqué sur les pages qui portent déjà leur
 * propre bloc « Demander un devis » (accueil avec la section #contact, pages
 * services) pour éviter deux CTA identiques à la suite. Affiché ailleurs
 * (études de cas, mentions légales…).
 */
const HIDE_ON = ["/", "/services"];

function shouldHide(pathname: string): boolean {
  return HIDE_ON.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}

export function FooterCta() {
  const pathname = usePathname();
  if (shouldHide(pathname)) return null;

  return (
    <div className={styles.cta}>
      <div>
        <p className={styles.ctaKicker}>Un projet en tête ?</p>
        <p className={styles.ctaTitle}>
          Parlons de votre site ou de votre outil IA.
        </p>
      </div>
      <Button href="/#contact" size="lg">
        Demander un devis
      </Button>
    </div>
  );
}
