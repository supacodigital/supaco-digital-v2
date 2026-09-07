import Link from "next/link";
import {
  MapPin,
  EnvelopeSimple,
  Phone,
  Clock,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/SupacoMark";
import { Container } from "@/components/ui/Container";
import { site, services } from "@/lib/site";
import { FooterCta } from "./FooterCta";
import styles from "./Footer.module.css";

// année de création → borne basse du copyright (stable au build)
const FOUNDING_YEAR = 2025;
const currentYear = new Date().getFullYear();
const copyrightYears =
  currentYear > FOUNDING_YEAR
    ? `${FOUNDING_YEAR}–${currentYear}`
    : `${FOUNDING_YEAR}`;

const socialIcons = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  linkedin: LinkedinLogo,
} as const;

const footerNav = {
  services: services.map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  })),
  agence: [
    { label: "Réalisations", href: "/#portfolio" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};

export function Footer() {
  const { address } = site.contact;

  return (
    <footer className={styles.footer}>
      <Container as="div">
        {/* Rappel de conversion — masqué là où la page a déjà son CTA */}
        <FooterCta />

        <div className={styles.grid}>
          {/* Identité + coordonnées */}
          <div className={styles.brand}>
            <Logo asLink />
            <p className={styles.pitch}>
              Agence web basée à Saint-Genis-Pouilly. Création de sites
              internet, e-commerce, agents IA et automatisation pour les TPE,
              PME et artisans du Pays de Gex, de l&apos;Ain et de la région de
              Genève.
            </p>

            <address className={styles.nap}>
              <span>
                <MapPin size={17} weight="fill" aria-hidden="true" />
                {address.postalCode} {address.locality}, {address.area}
              </span>
              <a href={`tel:${site.contact.phoneHref}`}>
                <Phone size={17} weight="fill" aria-hidden="true" />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`}>
                <EnvelopeSimple size={17} weight="fill" aria-hidden="true" />
                {site.contact.email}
              </a>
            </address>

            <p className={styles.hours}>
              <Clock size={17} weight="fill" aria-hidden="true" />
              {site.hours.label}
            </p>

            <ul className={styles.social}>
              {site.social.map((item) => {
                const Icon = socialIcons[item.icon];
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="me noopener"
                      aria-label={`${site.name} sur ${item.label}`}
                    >
                      <Icon size={19} weight="fill" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Colonnes de liens */}
          <nav className={styles.col} aria-label="Services">
            <p className={styles.colTitle}>Services</p>
            <ul>
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" prefetch={false}>
                  Tous les services
                </Link>
              </li>
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Agence">
            <p className={styles.colTitle}>Agence</p>
            <ul>
              {footerNav.agence.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Zone d'intervention — SEO local */}
          <div className={styles.col}>
            <p className={styles.colTitle}>Zone d’intervention</p>
            <p className={styles.area}>
              Agence web pour le Pays de Gex — Saint-Genis-Pouilly, Gex,
              Ferney-Voltaire, Prévessin-Moëns, Thoiry, Cessy, Divonne-les-Bains
              — et pour tout l’Ain (Bourg-en-Bresse, Oyonnax, Valserhône) ainsi
              que Genève et la Suisse frontalière.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {copyrightYears} {site.name} — SIRET {site.legal.siret} ·{" "}
            {site.legal.rcs}
          </p>
          <p className={styles.vat}>{site.legal.vatNote}</p>
        </div>
      </Container>
    </footer>
  );
}
