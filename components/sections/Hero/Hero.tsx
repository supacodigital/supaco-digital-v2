"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkle } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { SupacoMark } from "@/components/ui/SupacoMark";
import { Button } from "@/components/ui/Button";
import heroImage from "@/public/hero/mont-blanc.webp";
import styles from "./Hero.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section héro de la page d'accueil.
 * - photo de fond (Mont-Blanc, vu du Pays de Gex) sous un voile dégradé sombre
 *   fort : le contenu texte blanc reste lisible (contraste WCAG).
 * - le contenu (h1, sous-titre, CTA) est dans le HTML dès le premier rendu ;
 *   GSAP ne fait que révéler des éléments déjà indexables + un léger parallaxe.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // révélation d'entrée : ease-out fort, courte, décalage léger
      const targets = gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`);
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.05,
        },
      );

      // léger parallaxe : la photo remonte plus lentement que le contenu.
      // scrub linéaire, amplitude discrète (l'image déborde en bas via CSS).
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: root },
  );

  return (
    <section
      className={`${styles.hero} bleed-top`}
      ref={root}
      aria-labelledby="hero-title"
    >
      {/* fond : photo + voile dégradé + ghost mark, purement décoratif */}
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.imageWrap} ref={imageRef}>
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={82}
            placeholder="blur"
            className={styles.image}
          />
        </div>
        <div className={styles.veil} />
        <SupacoMark variant="mono" className={styles.ghostMark} />
      </div>

      <Container as="div" className={styles.inner}>
        <p className={`${styles.eyebrow} ${styles.reveal}`}>
          <Sparkle size={15} weight="fill" aria-hidden="true" />
          Agence web · Pays de Gex · bassin franco-suisse
        </p>

        <h1 id="hero-title" className={`${styles.title} ${styles.reveal}`}>
          Agence web dans le Pays de Gex&nbsp;:{" "}
          <span className={styles.accent}>
            sites internet, IA &amp; automatisation
          </span>
        </h1>

        <p className={`${styles.lede} ${styles.reveal}`}>
          Supaco Digital crée des sites internet, boutiques en ligne, agents IA
          et automatisations pour les TPE, PME et artisans du Pays de Gex, de
          l&apos;Ain et de la région de Genève — de Saint-Genis-Pouilly à
          Ferney-Voltaire, Gex et Divonne-les-Bains.
        </p>

        <div className={`${styles.actions} ${styles.reveal}`}>
          <Button href="/#contact" size="lg">
            Demander un devis
          </Button>
          <Link href="/#portfolio" className={styles.secondary}>
            Voir les réalisations
          </Link>
        </div>
      </Container>
    </section>
  );
}
