"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./HeroBackdrop.module.css";

/** Sous ce seuil (téléphones), version portrait allégée de la vidéo. */
const MOBILE_QUERY = "(max-width: 720px)";

/**
 * Décor du héro — vidéo de fond (flux de lumière cyan/bleu) sous un voile
 * dégradé sombre qui garantit le contraste WCAG du texte par-dessus.
 *
 * La vidéo n'est montée qu'après l'hydratation et seulement si l'utilisateur
 * n'a pas demandé la réduction de mouvement : le premier rendu (et le LCP)
 * repose sur le poster en CSS, pas sur un média à télécharger.
 *
 * Sur téléphone, le cadrage `cover` ne montre que la bande centrale de la
 * vidéo 16:9 : on sert donc cette bande seule, en portrait 540×960
 * (`hero-loop-mobile.mp4`, ≈ 540 Ko au lieu de 2,7 Mo). Sources dans
 * public/hero : recadrage `crop=608:1080:656:0`, x264 CRF 34, `+faststart`.
 */
export function HeroBackdrop() {
  // côté serveur : « mouvement réduit » → pas de vidéo au premier rendu
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const mobile = useMediaQuery(MOBILE_QUERY);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.poster} />

      {!reduceMotion &&
        (mobile ? (
          // `key` : changer de version remonte la vidéo (les <source> ne se
          // rechargent pas d'elles-mêmes)
          <video
            key="mobile"
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/hero/hero-poster-mobile.jpg"
          >
            <source src="/hero/hero-loop-mobile.mp4" type="video/mp4" />
          </video>
        ) : (
          <video
            key="desktop"
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
        ))}

      <div className={styles.veil} />
      <div className={styles.grain} />
    </div>
  );
}
