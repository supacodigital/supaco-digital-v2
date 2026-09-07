import Link from "next/link";
import Image from "next/image";
import logoDesktop from "@/public/assets/logodesktop.png";
import styles from "./Logo.module.css";

/**
 * Logo complet Supaco (icône dégradée + wordmark "Supaco digital").
 * Détouré depuis le logo de référence — pensé pour fond sombre (header, footer).
 */

type LogoProps = {
  /** Rend le logo comme lien vers l'accueil (header). Sinon simple bloc (footer). */
  asLink?: boolean;
  /** Hauteur d'affichage en px (le ratio est conservé). */
  height?: number;
  priority?: boolean;
  className?: string;
};

function LogoImage({
  height,
  priority,
}: {
  height: number;
  priority: boolean;
}) {
  return (
    <Image
      src={logoDesktop}
      alt="Supaco Digital"
      height={height}
      // largeur calculée depuis le ratio natif 840×296
      width={Math.round((height * 840) / 296)}
      priority={priority}
      className={styles.img}
      sizes="(max-width: 480px) 150px, 190px"
    />
  );
}

export function Logo({
  asLink = true,
  height = 34,
  priority = false,
  className,
}: LogoProps) {
  if (asLink) {
    return (
      <Link
        href="/"
        className={`${styles.logo} ${className ?? ""}`}
        aria-label="Supaco Digital, retour à l'accueil"
      >
        <LogoImage height={height} priority={priority} />
      </Link>
    );
  }

  return (
    <span className={`${styles.logo} ${className ?? ""}`}>
      <LogoImage height={height} priority={priority} />
      <span className="sr-only">Supaco Digital</span>
    </span>
  );
}
