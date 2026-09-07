import type { Metadata } from "next";
import Link from "next/link";
import {
  Browser,
  ChatCircleDots,
  FlowArrow,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { services, serviceContent, site } from "@/lib/site";
import styles from "./services.module.css";

const icons: Record<(typeof services)[number]["icon"], Icon> = {
  browser: Browser,
  chat: ChatCircleDots,
  stack: Stack,
  flow: FlowArrow,
};

export const metadata: Metadata = {
  title: "Services — agence web, IA & automatisation",
  description:
    "Création de sites internet, agents IA, SaaS sur-mesure et automatisation pour les TPE, PME et artisans du Pays de Gex, de l'Ain et de la région de Genève.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services Supaco Digital — agence web du bassin franco-suisse",
    description:
      "Sites internet, agents IA, SaaS sur-mesure et automatisation pour les entreprises du Pays de Gex, de l'Ain et de Genève.",
    url: `${site.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <Container as="div" className={styles.wrap}>
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Services" }]}
      />

      <header className={styles.head}>
        <p className={styles.eyebrow}>Nos services</p>
        <h1 className={styles.title}>
          Agence web, IA et automatisation dans le Pays de Gex
        </h1>
        <p className={styles.lede}>
          Supaco Digital accompagne les TPE, PME et artisans du Pays de Gex, de
          l&apos;Ain et de la région de Genève sur quatre besoins&nbsp;: la
          création de site internet, les agents IA, les applications
          sur-mesure et l&apos;automatisation des tâches. Un seul
          interlocuteur, de la conception à la maintenance.
        </p>
      </header>

      <ul className={styles.grid}>
        {services.map((service) => {
          const IconEl = icons[service.icon];
          const content = serviceContent[service.slug];
          return (
            <li key={service.slug} className={styles.card}>
              <Link
                href={`/services/${service.slug}`}
                className={styles.cardLink}
              >
                <span className={styles.cardIcon} aria-hidden="true">
                  <IconEl size={24} weight="duotone" />
                </span>
                <h2 className={styles.cardTitle}>{content.h1}</h2>
                <p className={styles.cardText}>{service.blurb}</p>
                <span className={styles.cardMore}>
                  En savoir plus
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className={styles.cta}>
        <div>
          <p className={styles.ctaKicker}>Un projet en tête&nbsp;?</p>
          <p className={styles.ctaTitle}>
            Parlons de votre site ou de votre outil.
          </p>
        </div>
        <Button href="/#contact" size="lg">
          Demander un devis
        </Button>
      </section>
    </Container>
  );
}
