"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { projects } from "@/lib/site";
import styles from "./Realisations.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section « Réalisations » de la page d'accueil — aperçu du portfolio.
 * Rail horizontal scrollable (une seule ligne, y compris en desktop) :
 * scroll natif + snap, flèches ‹ › qui défilent d'une carte, scrollbar fine.
 * Le texte est dans le HTML dès le premier rendu ; GSAP ne révèle que des
 * cartes déjà indexables, en cascade au scroll.
 */
export function Realisations() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // état des flèches : début / fin de rail atteints ?
  const syncEdges = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  // défilement d'une "page" (~largeur d'une carte + gap)
  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(`.${styles.card}`);
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      gsap.from(cards, {
        opacity: 0,
        y: 26,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.08,
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
      id="portfolio"
      className={styles.realisations}
      ref={root}
      aria-labelledby="portfolio-title"
    >
      <Container as="div" className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.eyebrow}>Réalisations</p>
            <h2 id="portfolio-title" className={styles.title}>
              Des sites internet qui travaillent pour leurs clients
            </h2>
            <p className={styles.lede}>
              Commerces, artisans et indépendants du Pays de Gex, de l&apos;Ain
              et de la région de Genève qui nous ont confié la création de leur
              site.
            </p>
          </div>

          <div className={styles.arrows} aria-hidden="true">
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              tabIndex={-1}
            >
              <ArrowLeft size={17} weight="bold" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              tabIndex={-1}
            >
              <ArrowRight size={17} weight="bold" />
            </button>
          </div>
        </header>
      </Container>

      {/* le rail déborde la Container : il court d'un bord à l'autre */}
      <ul
        className={styles.rail}
        ref={rail}
        data-at-start={atStart || undefined}
        data-at-end={atEnd || undefined}
      >
        {projects.map((project) => (
          <li key={project.slug} className={styles.card}>
            <Link
              href={`/portfolio/${project.slug}`}
              className={styles.cardLink}
            >
              <span className={styles.frame}>
                <span className={styles.chrome} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.shot}>
                  <Image
                    src={project.image}
                    alt={`Aperçu du site ${project.name}`}
                    fill
                    sizes="(max-width: 720px) 78vw, 340px"
                    className={styles.shotImg}
                  />
                </span>
              </span>

              <span className={styles.meta}>
                <span className={styles.metaMain}>
                  <span className={styles.name}>{project.name}</span>
                  <span className={styles.sector}>
                    {project.sector} · {project.projectType}
                  </span>
                </span>
                <span className={styles.area}>{project.area}</span>
              </span>

              <span className={styles.reveal}>
                Voir l&apos;étude de cas
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  aria-hidden="true"
                  className={styles.revealIcon}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
