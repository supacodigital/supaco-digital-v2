"use client";

import { useEffect, useState } from "react";
import styles from "./HeroBackdrop.module.css";

/**
 * Décor du héro — vidéo de fond (flux de lumière cyan/bleu) sous un voile
 * dégradé sombre qui garantit le contraste WCAG du texte par-dessus.
 *
 * La vidéo n'est montée qu'après l'hydratation et seulement si l'utilisateur
 * n'a pas demandé la réduction de mouvement : le premier rendu (et le LCP)
 * repose sur le poster en CSS, pas sur un média à télécharger.
 */
export function HeroBackdrop() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShowVideo(!query.matches);
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.poster} />

      {showVideo && (
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/hero/hero-poster.jpg"
        >
          <source src="/hero/hero-loop.webm" type="video/webm" />
          <source src="/hero/hero-loop.mp4" type="video/mp4" />
        </video>
      )}

      <div className={styles.veil} />
      <div className={styles.grain} />
    </div>
  );
}
