import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

/**
 * Conteneur centré à largeur max, avec padding horizontal fluide.
 * `as` permet de rendre une balise sémantique (section, header, footer…).
 */

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Variante plus étroite pour les blocs de texte long. */
  narrow?: boolean;
};

export function Container({
  as: Tag = "div",
  children,
  className,
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={`${styles.container} ${narrow ? styles.narrow : ""} ${
        className ?? ""
      }`}
    >
      {children}
    </Tag>
  );
}
