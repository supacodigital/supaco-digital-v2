"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "@phosphor-icons/react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // dot actif (carte la plus proche du bord gauche) + fondu de bord du rail
  const syncScrollState = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(`.${styles.card}`);
    if (!cards.length) return;
    const step = cards[0].offsetWidth + 24;
    const index = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.min(index, cards.length - 1));

    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  // défilement direct vers la carte d'index donné
  const scrollToCard = useCallback((index: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>(`.${styles.card}`)[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
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

          <div className={styles.headRight}>
            <span className={styles.photoCard}>
              <video
                className={styles.photoImg}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              >
                <source src="/realisations/build-video.mp4" type="video/mp4" />
              </video>
            </span>
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

      <div className={styles.dots} role="tablist" aria-label="Pagination des réalisations">
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            role="tab"
            className={styles.dot}
            data-active={index === activeIndex || undefined}
            aria-selected={index === activeIndex}
            aria-label={`Voir ${project.name}`}
            onClick={() => scrollToCard(index)}
          />
        ))}
      </div>
    </section>
  );
}
