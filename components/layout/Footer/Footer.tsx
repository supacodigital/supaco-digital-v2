import Link from "next/link";
import {
  MapPin,
  EnvelopeSimple,
  Phone,
  Clock,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/SupacoMark";
import { Container } from "@/components/ui/Container";
import { site, services } from "@/lib/site";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
} from "./social-icons";
import styles from "./Footer.module.css";

// année de création → borne basse du copyright (stable au build)
const FOUNDING_YEAR = 2025;
const currentYear = new Date().getFullYear();
const copyrightYears =
  currentYear > FOUNDING_YEAR
    ? `${FOUNDING_YEAR}–${currentYear}`
    : `${FOUNDING_YEAR}`;

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
} as const;

const footerNav = {
  services: [
    ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    { label: "Tous les services", href: "/services" },
  ],
  agence: [
    { label: "Réalisations", href: "/#portfolio" },
    { label: "Contact", href: "/#contact" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};

export function Footer() {
  const { address } = site.contact;

  return (
    <footer className={styles.footer}>
      {/* lueur de marque très diffuse, purement décorative */}
      <span className={styles.glow} aria-hidden="true" />

      <Container as="div">
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
                      data-network={item.icon}
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Colonnes de liens */}
          <nav className={styles.col} aria-label="Services">
            <p className={styles.colTitle}>Services</p>
            <ul className={styles.links}>
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>
                    <span>{item.label}</span>
                    <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Agence">
            <p className={styles.colTitle}>Agence</p>
            <ul className={styles.links}>
              {footerNav.agence.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>
                    <span>{item.label}</span>
                    <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coordonnées — NAP */}
          <div className={styles.col}>
            <p className={styles.colTitle}>Contact</p>
            <address className={styles.nap}>
              <a href={`tel:${site.contact.phoneHref}`}>
                <Phone size={16} weight="fill" aria-hidden="true" />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`}>
                <EnvelopeSimple size={16} weight="fill" aria-hidden="true" />
                {site.contact.email}
              </a>
              <span>
                <MapPin size={16} weight="fill" aria-hidden="true" />
                {address.postalCode} {address.locality}, {address.area}
              </span>
              <span>
                <Clock size={16} weight="fill" aria-hidden="true" />
                {site.hours.label}
              </span>
            </address>
          </div>
        </div>

        {/* Zone d'intervention — SEO local, pleine largeur */}
        <p className={styles.area}>
          <span className={styles.areaLabel}>Zone d’intervention</span>
          <span className={styles.areaText}>
            Agence web pour le Pays de Gex — Saint-Genis-Pouilly, Gex,
            Ferney-Voltaire, Prévessin-Moëns, Thoiry, Cessy, Divonne-les-Bains
            — et pour tout l’Ain (Bourg-en-Bresse, Oyonnax, Valserhône) ainsi
            que Genève et la Suisse frontalière.
          </span>
        </p>

        <div className={styles.bottom}>
          <p>
            © {copyrightYears} {site.name} — SIRET {site.legal.siret} ·{" "}
            {site.legal.rcs}
          </p>
          <p className={styles.vat}>{site.legal.vatNote}</p>
        </div>
      </Container>

      {/* Signature XL — wordmark en filigrane, décoratif */}
      <p className={styles.signature} aria-hidden="true">
        SUPACO
      </p>
    </footer>
  );
}
