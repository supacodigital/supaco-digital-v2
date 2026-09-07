import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.css";

/**
 * Bouton identitaire Supaco : parallélogramme incliné ~8° vers l'avant,
 * coins vifs, silhouette obtenue par `clip-path` (le texte n'est jamais
 * transformé). Dégradé signature cyan → bleu réservé à l'identité Supaco.
 *
 * - `variant` : primary (dégradé plein) | glass (verre + arête dégradée) | ghost (contour)
 * - `size`    : sm | md | lg
 * - `uppercase` : petites capitales espacées (défaut : true — c'est la forme validée)
 * - `fullWidth` : occupe toute la largeur (menu mobile)
 * - rendu comme `<a>` (Next Link) si `href`, sinon `<button>`
 */

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  uppercase?: boolean;
  fullWidth?: boolean;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

type ButtonAsButton = BaseProps & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

type StyleProps = Omit<BaseProps, "children">;

function buildClassName({
  variant = "primary",
  size = "md",
  uppercase = true,
  fullWidth = false,
  className,
}: StyleProps) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    uppercase && styles.uppercase,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant,
    size,
    uppercase,
    fullWidth,
    className,
    ...rest
  } = props;

  const classNames = buildClassName({
    variant,
    size,
    uppercase,
    fullWidth,
    className,
  });

  // le libellé est enveloppé pour pouvoir compenser optiquement le clip-path
  const content = <span className={styles.label}>{children}</span>;

  if (props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classNames} {...linkRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classNames} {...(rest as ButtonAsButton)}>
      {content}
    </button>
  );
}
