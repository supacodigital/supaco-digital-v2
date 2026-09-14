"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
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
  const gridRef = useRef<HTMLUListElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  // pagination du slider mobile : la carte la plus visible pilote le point actif
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best,
        );
        if (mostVisible.intersectionRatio > 0) {
          setActiveCard(cards.indexOf(mostVisible.target as HTMLElement));
        }
      },
      { root: grid, threshold: [0.5, 0.75, 1] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // < 620px : cartes en slider horizontal (scroll-snap) — le stagger
      // d'entrée décale visiblement une carte par rapport à sa voisine déjà
      // visible sur le bord ; pas de valeur ajoutée dans ce contexte.
      if (window.matchMedia("(max-width: 619px)").matches) return;

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
      {/* filigranes de marque, décoratifs : icône mono en très faible opacité.
          un en haut à droite, un second plus bas à gauche pour équilibrer. */}
      <SupacoMark
        variant="mono"
        className={styles.watermark}
        aria-hidden="true"
      />
      <SupacoMark
        variant="mono"
        className={styles.watermarkAlt}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Nos expertises</p>
          <h2 id="services-title" className={styles.title}>
            Agence web, IA et automatisation
          </h2>
          <p className={styles.lede}>
            De la création de site internet à l&apos;outil métier sur-mesure,
            Supaco Digital couvre toute la chaîne pour les TPE, PME et artisans
            du Pays de Gex, de l&apos;Ain et de la région de Genève.
          </p>
        </header>

        <ul className={styles.grid} ref={gridRef}>
          {services.map((service, i) => {
            const IconEl = icons[service.icon];
            return (
              <li
                key={service.slug}
                className={styles.card}
                style={{ "--accent": service.bg.accent } as CSSProperties}
              >
                <span className={styles.topline} aria-hidden="true" />

                <span className={styles.thumb}>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width: 619px) 100vw, (max-width: 1079px) 50vw, 25vw"
                    className={styles.thumbImg}
                  />
                  <span className={styles.iconWrap} aria-hidden="true">
                    <IconEl size={22} weight="duotone" />
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
                  {/* CTA identitaire (même Button que le header) : direct vers
                      le formulaire de contact. */}
                  <Button
                    href="/#contact"
                    size="sm"
                    fullWidth
                    className={styles.cta}
                    aria-label={`${service.title} — demander un devis`}
                  >
                    Demander un devis
                  </Button>
                  {/* lien secondaire discret vers la page détaillée du service */}
                  <Link
                    href={`/services/${service.slug}`}
                    className={styles.more}
                    aria-label={`${service.title} — voir plus`}
                  >
                    Voir plus
                    <ArrowRight
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className={styles.moreIcon}
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {/* pagination du slider mobile — décorative, le swipe reste le contrôle principal */}
        <div className={styles.dots} aria-hidden="true">
          {services.map((service, i) => (
            <span
              key={service.slug}
              className={styles.dot}
              data-active={i === activeCard || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
