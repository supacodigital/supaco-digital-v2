"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import styles from "./ServiceHero.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  stats: { value: string; label: string }[];
  poster: string;
  posterAlt: string;
  video: string;
  crumbs: Crumb[];
};

/**
 * Hero des pages /services/[slug] — même parti pris que le hero d'accueil :
 * une boucle vidéo muette sous un voile dégradé sombre qui garantit le
 * contraste WCAG du texte blanc, avec l'image en poster (LCP + repli
 * `prefers-reduced-motion`).
 *
 * Le visuel est purement décoratif : tout le texte (H1, accroche, chiffres)
 * est dans le HTML dès le premier rendu, GSAP ne fait que le révéler.
 */
export function ServiceHero({
  eyebrow,
  title,
  tagline,
  stats,
  poster,
  posterAlt,
  video,
  crumbs,
}: ServiceHeroProps) {
  const root = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  // false tant que le client n'a pas tranché : on garde l'image (LCP) jusque-là
  const [showVideo, setShowVideo] = useState(false);

  useGSAP(
    () => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      setShowVideo(!query.matches);
      if (query.matches) return;

      const targets = gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`);
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.05,
        },
      );

      // parallaxe léger : le média remonte plus lentement que le contenu
      if (mediaRef.current) {
        gsap.to(mediaRef.current, {
          yPercent: 12,
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
    <section className={`${styles.hero} bleed-top`} ref={root}>
      {/* --- Média de fond, décoratif --- */}
      <div className={styles.media} ref={mediaRef} aria-hidden="true">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.poster}
          data-hidden={showVideo ? "true" : undefined}
        />
        {showVideo && (
          <video
            className={styles.video}
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <Container as="div" className={styles.inner}>
        <div className={styles.crumbs}>
          <Breadcrumb items={crumbs} />
        </div>

        <p className={`${styles.eyebrow} ${styles.reveal}`}>{eyebrow}</p>
        <h1 className={`${styles.title} ${styles.reveal}`}>{title}</h1>
        <p className={`${styles.tagline} ${styles.reveal}`}>{tagline}</p>

        <div className={`${styles.actions} ${styles.reveal}`}>
          <Button href="/#contact" size="lg">
            Demander un devis
          </Button>
          <a href="#methode" className={styles.secondaryLink}>
            Voir notre méthode
          </a>
        </div>

        <dl className={`${styles.stats} ${styles.reveal}`}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* description du visuel pour les lecteurs d'écran, hors flux visuel */}
      <p className="sr-only">{posterAlt}</p>
    </section>
  );
}
