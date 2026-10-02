import { Check, Star } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/site";
import { demoQr } from "./demoQr";
import styles from "./Products.module.css";

/** Logo « G » de Google (quatre couleurs officielles). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/**
 * Section « Produits » de l'accueil, entre Réalisations et les avis clients.
 * Annonce la gamme de produits physiques et met en avant le premier : le badge
 * QR code avis Google. Section sombre : elle casse la suite de sections
 * claires et fait ressortir le badge blanc.
 * Composant serveur : aucun JS client, le badge est dessiné en CSS + SVG (son
 * QR code est réel et scannable, cf. demoQr).
 */
export function Products() {
  const [product] = products;
  // zone de silence de 4 modules autour de la matrice (recommandation ISO)
  const qrSide = demoQr.size + 8;

  return (
    <section
      id="produits"
      className={styles.products}
      aria-labelledby="produits-title"
    >
      <Container as="div" className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.tag}>Nouveau</span>
            Produits
          </p>
          <h2 id="produits-title" className={styles.title}>
            Le digital, jusqu&apos;à{" "}
            <span className={styles.accent}>votre comptoir</span>
          </h2>
          <p className={styles.lede}>
            En plus des sites et des outils sur-mesure, Supaco Digital conçoit
            des produits physiques qui relient votre commerce à votre présence
            en ligne. Premier de la gamme&nbsp;: le badge QR code avis Google.
          </p>
        </header>

        {/* visuel : exemple de badge, décrit en une phrase pour les lecteurs d'écran */}
        <div
          className={styles.stage}
          role="img"
          aria-label="Exemple de badge avis Google : logo Google, cinq étoiles et QR code à scanner avec un téléphone"
        >
          <span className={styles.glow} aria-hidden="true" />
          <div className={styles.badge} aria-hidden="true">
            <span className={styles.badgeHead}>
              <GoogleG className={styles.badgeLogo} />
              <span className={styles.badgeTitle}>Laissez-nous un avis</span>
            </span>
            <span className={styles.badgeStars}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} weight="fill" />
              ))}
            </span>
            <svg
              className={styles.badgeQr}
              viewBox={`-4 -4 ${qrSide} ${qrSide}`}
              shapeRendering="crispEdges"
            >
              <rect x="-4" y="-4" width={qrSide} height={qrSide} fill="#fff" />
              <path d={demoQr.path} fill="currentColor" />
            </svg>
            <span className={styles.badgeHint}>Scannez avec votre téléphone</span>
            <span className={styles.badgeName}>Votre entreprise</span>
          </div>
          <span className={styles.floor} aria-hidden="true" />
        </div>

        <article className={styles.product} aria-labelledby="produit-01">
          <p className={styles.index}>Produit 01</p>
          <h3 id="produit-01" className={styles.productName}>
            {product.name}
          </h3>
          <p className={styles.productText}>{product.pitch}</p>

          <ul className={styles.features}>
            {product.features.map((feature) => (
              <li key={feature} className={styles.feature}>
                <Check
                  size={14}
                  weight="bold"
                  aria-hidden="true"
                  className={styles.featureIcon}
                />
                {feature}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Button href="/#contact" size="lg">
              Commander mon badge
            </Button>
            <p className={styles.note}>Tarif sur demande</p>
          </div>
        </article>
      </Container>
    </section>
  );
}
