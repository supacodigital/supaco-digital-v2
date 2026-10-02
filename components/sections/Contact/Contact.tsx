"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, EnvelopeSimple, Phone } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/layout/Footer/social-icons";
import { site } from "@/lib/site";
import { ContactBackdrop } from "./ContactBackdrop";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// id de dégradé propre à cette section : le footer rend aussi l'icône Instagram
const IG_GRADIENT_ID = "supaco-ig-gradient-contact";

const socialIcons = {
  instagram: () => <InstagramIcon size={18} gradientId={IG_GRADIENT_ID} />,
  facebook: () => <FacebookIcon size={18} />,
  linkedin: () => <LinkedinIcon size={18} />,
} as const;

/** Les trois engagements affichés sous l'accroche — lèvent les freins à l'envoi. */
const promises = [
  "Réponse sous 24 h ouvrées",
  "Devis détaillé, sans engagement",
  "Un interlocuteur unique, du devis à la mise en ligne",
] as const;

/**
 * Section « Contact » de la page d'accueil — dernier bloc de conversion avant
 * le footer. Retour au thème sombre après les sections claires (Réalisations,
 * FAQ, Avis), sur un décor animé (`ContactBackdrop`) qui marque le point
 * d'arrivée du scroll.
 *
 * Trois blocs : accroche + engagements, formulaire en une étape, puis contact
 * direct (téléphone, e-mail, réseaux — issus de `lib/site.ts`, source unique ;
 * le NAP complet est dans le footer). Desktop : accroche et contact direct à
 * gauche, formulaire à droite. Mobile : une colonne, formulaire juste après
 * l'accroche pour qu'il arrive vite à l'écran. Tout le texte est dans le HTML dès le premier rendu ; GSAP
 * ne révèle que des éléments déjà indexables, en cascade au scroll.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { contact } = site;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const targets = gsap.utils.toArray<HTMLElement>(`.${styles.reveal}`);
      gsap.from(targets, {
        opacity: 0,
        y: 22,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: root.current,
          start: "top 74%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="contact"
      className={styles.contact}
      ref={root}
      aria-labelledby="contact-title"
    >
      <ContactBackdrop />

      <Container as="div" className={styles.inner}>
        {/* Ordre du DOM = ordre de lecture mobile : accroche, formulaire, puis
            contact direct. En desktop, la grille replace le formulaire dans la
            colonne de droite (cf. `grid-template-areas`). */}
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>
            <span className={styles.dot} aria-hidden="true" />
            Contact
          </p>

          <h2 id="contact-title" className={`${styles.title} ${styles.reveal}`}>
            Parlons de <span className={styles.accent}>votre projet</span>
          </h2>

          <p className={`${styles.lede} ${styles.reveal}`}>
            Laissez votre nom et un moyen de vous joindre&nbsp;: on vous
            recontacte pour en parler et vous proposer un devis.
          </p>

          <ul className={`${styles.promises} ${styles.reveal}`}>
            {promises.map((promise) => (
              <li key={promise} className={styles.promise}>
                <span className={styles.tick} aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.formWrap} ${styles.reveal}`}>
          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>

        {/* --- Contact direct : téléphone, e-mail, réseaux --- */}
        <div className={styles.direct}>
          <p className={`${styles.or} ${styles.reveal}`}>
            <span>Ou directement</span>
          </p>

          <address className={`${styles.channels} ${styles.reveal}`}>
            <a href={`tel:${contact.phoneHref}`} className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Phone size={17} weight="fill" />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>Téléphone</span>
                <span className={styles.channelValue}>{contact.phone}</span>
              </span>
              <ArrowUpRight
                size={15}
                weight="bold"
                className={styles.channelArrow}
                aria-hidden="true"
              />
            </a>

            <a href={`mailto:${contact.email}`} className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <EnvelopeSimple size={17} weight="fill" />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>E-mail</span>
                <span className={styles.channelValue}>{contact.email}</span>
              </span>
              <ArrowUpRight
                size={15}
                weight="bold"
                className={styles.channelArrow}
                aria-hidden="true"
              />
            </a>

            {/* réseaux sociaux — mêmes liens et mêmes règles que le footer */}
            <div className={styles.socials}>
              <p className={styles.channelLabel}>Suivez-nous</p>
              <ul className={styles.socialList}>
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
                        className={styles.socialLink}
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </address>
        </div>
      </Container>
    </section>
  );
}
