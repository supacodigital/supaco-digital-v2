"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Star, ArrowRight } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/lib/site";
import { HeroBackdrop } from "./HeroBackdrop";
import { GoogleLogo } from "./GoogleLogo";
import styles from "./Hero.module.css";

// note moyenne réelle, calculée depuis les avis Google (pas une valeur en dur)
const averageRating =
  testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
const ratingLabel = averageRating.toFixed(1).replace(".", ",");

/**
 * Section héro de la page d'accueil.
 * Composition alignée à gauche : le titre porte le SEO local, la note Google
 * réelle est visible dès le premier écran.
 * Le fond est entièrement CSS (cf. HeroBackdrop) — aucune image ni vidéo à
 * charger, le LCP est porté par le texte.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // révélation d'entrée — le contenu est déjà dans le HTML (indexable),
      // GSAP ne fait que l'animer
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      className={`${styles.hero} bleed-top`}
      ref={root}
      aria-labelledby="hero-title"
    >
      <HeroBackdrop />

      <Container as="div" className={styles.inner}>
        <h1 id="hero-title" className={`${styles.title} ${styles.reveal}`}>
          Agence web dans le Pays de Gex&nbsp;:{" "}
          <span className={styles.accent}>
            sites internet, IA &amp; automatisation
          </span>
        </h1>

        <p className={`${styles.lede} ${styles.reveal}`}>
          Sites internet, agents IA et automatisations pour les TPE, PME et
          artisans du bassin franco-suisse. Un interlocuteur unique, du devis à
          la mise en ligne.
        </p>

        <div className={`${styles.actions} ${styles.reveal}`}>
          <Button href="/#contact" size="lg">
            Demander un devis
          </Button>
          <Link href="/#portfolio" className={styles.secondary}>
            Voir les réalisations
            <ArrowRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        {/* Preuve sociale — note Google réelle */}
        <div className={`${styles.proof} ${styles.reveal}`}>
          <p className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} weight="fill" />
              ))}
            </span>
            <span className={styles.ratingText}>
              <strong>{ratingLabel}</strong> sur
              <GoogleLogo height={15} />
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
