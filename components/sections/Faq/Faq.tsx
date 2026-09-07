"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { SupacoMark } from "@/components/ui/SupacoMark";
import { Button } from "@/components/ui/Button";
import { homeFaq } from "@/lib/site";
import styles from "./Faq.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section « FAQ » de la page d'accueil — entre « Réalisations » et « Contact ».
 * Même parti pris clair que Services / Réalisations (blanc cassé, texte bleu
 * nuit). Accordéon `<dl>` sémantique : un seul panneau ouvert à la fois, le
 * premier ouvert par défaut. L'ouverture anime `grid-template-rows: 0fr -> 1fr`
 * (hauteur fluide sans mesure JS) ; le texte des réponses est dans le HTML dès
 * le premier rendu (indexable + alimente le JSON-LD FAQPage du layout).
 */
export function Faq() {
  const root = useRef<HTMLElement>(null);
  // index de l'item ouvert (-1 = tous fermés)
  const [openIndex, setOpenIndex] = useState(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = gsap.utils.toArray<HTMLElement>(`.${styles.item}`);
      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: root.current,
          start: "top 74%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="faq"
      className={styles.faq}
      ref={root}
      aria-labelledby="faq-title"
    >
      {/* filigrane de marque, décoratif */}
      <SupacoMark
        variant="mono"
        className={styles.watermark}
        aria-hidden="true"
      />

      <Container as="div" className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Questions fréquentes</p>
          <h2 id="faq-title" className={styles.title}>
            Ce que les clients nous demandent avant de se lancer
          </h2>
          <p className={styles.lede}>
            Prix, délais, propriété du site, référencement : les réponses aux
            questions qui reviennent le plus. Un doute qui n&apos;est pas ici
            ? Posez-la nous directement.
          </p>
        </header>

        <dl className={styles.list}>
          {homeFaq.map((entry, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-trigger-${i}`;
            return (
              <div key={entry.q} className={styles.item} data-open={open || undefined}>
                <dt className={styles.term}>
                  <button
                    type="button"
                    id={btnId}
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                  >
                    <span className={styles.question}>{entry.q}</span>
                    <span className={styles.iconWrap} aria-hidden="true">
                      <Plus size={16} weight="bold" className={styles.icon} />
                    </span>
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={styles.panel}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.answer}>{entry.a}</p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>

        <div className={styles.foot}>
          <p className={styles.footText}>Une autre question sur votre projet ?</p>
          <Button href="/#contact" size="sm">
            Nous écrire
          </Button>
        </div>
      </Container>
    </section>
  );
}
