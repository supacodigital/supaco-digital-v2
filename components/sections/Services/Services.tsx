"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Browser,
  ChatCircleDots,
  Check,
  FlowArrow,
  Stack,
} from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SupacoMark } from "@/components/ui/SupacoMark";
import { services } from "@/lib/site";
import styles from "./Services.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Correspondance clé de service -> icône Phosphor. */
const icons: Record<(typeof services)[number]["icon"], Icon> = {
  browser: Browser,
  chat: ChatCircleDots,
  stack: Stack,
  flow: FlowArrow,
};

/**
 * Section « Services » de la page d'accueil.
 * Rupture visuelle assumée : fond blanc cassé au milieu d'un site sombre.
 * Cartes-produit (4 côte à côte) : icône, pitch, livrables, CTA identitaire.
 * Tout le texte est dans le HTML dès le premier rendu ; GSAP ne fait que
 * révéler des cartes déjà indexables, en cascade au scroll.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="services"
      className={styles.services}
      ref={root}
      aria-labelledby="services-title"
    >
      {/* filigrane de marque, décoratif : icône mono en très faible opacité */}
      <SupacoMark
        variant="mono"
        className={styles.watermark}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Nos expertises</p>
          <h2 id="services-title" className={styles.title}>
            Agence web, IA et automatisation — un seul interlocuteur
          </h2>
          <p className={styles.lede}>
            De la création de site internet à l&apos;outil métier sur-mesure,
            Supaco Digital couvre toute la chaîne pour les TPE, PME et artisans
            du Pays de Gex, de l&apos;Ain et de la région de Genève.
          </p>
        </header>

        <ul className={styles.grid}>
          {services.map((service, i) => {
            const IconEl = icons[service.icon];
            return (
              <li
                key={service.slug}
                className={styles.card}
                style={{ "--accent": service.bg.accent } as CSSProperties}
              >
                <span className={styles.topline} aria-hidden="true" />

                <span className={styles.cardHead}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <IconEl size={24} weight="duotone" />
                  </span>
                  <span className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardText}>{service.blurb}</p>

                <ul className={styles.features}>
                  {service.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <Check
                        size={13}
                        weight="bold"
                        aria-hidden="true"
                        className={styles.featureIcon}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={styles.foot}>
                  {/* CTA identitaire (même Button que le header) */}
                  <Button
                    href={`/services/${service.slug}`}
                    size="sm"
                    fullWidth
                    className={styles.cta}
                    aria-label={`${service.title} — en savoir plus`}
                  >
                    En savoir plus
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
