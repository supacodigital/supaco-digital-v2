"use client";

/**
 * Fournisseur de smooth scroll (Lenis) synchronisé avec le ticker GSAP.
 * Monté une seule fois dans le layout racine.
 *
 * - `autoRaf: false` + `gsap.ticker.add` : une seule boucle d'animation pour
 *   Lenis + GSAP (évite les micro-décalages entre scroll et ScrollTrigger).
 * - Respecte `prefers-reduced-motion` : Lenis est neutralisé, on retombe sur
 *   le scroll natif.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // le lissage de lag GSAP fait sauter le scroll piloté par Lenis
  gsap.ticker.lagSmoothing(0);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion) return;

    function update(time: number) {
      // GSAP fournit le temps en secondes, Lenis attend des millisecondes
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [prefersReducedMotion]);

  // Retour en haut au changement de page. Next remonte nativement (window.
  // scrollTo), mais Lenis intercepte le scroll natif : on relaie donc l'ordre
  // à Lenis. Les navigations vers une ancre (#portfolio…) sont laissées à Next
  // / Lenis (option `anchors`), on ne les court-circuite pas.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) return;
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  // rafraîchit ScrollTrigger quand Lenis scrolle
  useEffect(() => {
    if (prefersReducedMotion) return;
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.12,
        duration: 1.1,
        // courbe proche de la respiration iOS
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}
