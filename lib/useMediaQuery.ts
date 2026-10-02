import { useSyncExternalStore } from "react";

/**
 * État d'une media query, synchronisé avec le navigateur (`matchMedia`) et mis
 * à jour à chaque changement. `serverValue` : valeur utilisée au rendu serveur
 * et à l'hydratation — React rebascule ensuite sur la vraie valeur, sans
 * effet ni setState pendant le rendu.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
