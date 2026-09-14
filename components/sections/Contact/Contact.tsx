"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarBlank,
  EnvelopeSimple,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { ContactBackdrop } from "./ContactBackdrop";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
 * À gauche : accroche, engagements et coordonnées directes (NAP issu de
 * `lib/site.ts`, source unique). À droite : le formulaire de demande de devis
 * en trois étapes. Tout le texte est dans le HTML dès le premier rendu ; GSAP
 * ne révèle que des éléments déjà indexables, en cascade au scroll.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { contact, hours } = site;

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
        {/* --- Colonne gauche : accroche, engagements, coordonnées --- */}
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>
            <span className={styles.dot} aria-hidden="true" />
            Contact
          </p>

          <h2 id="contact-title" className={`${styles.title} ${styles.reveal}`}>
            Parlons de <span className={styles.accent}>votre projet</span>
          </h2>

          <p className={`${styles.lede} ${styles.reveal}`}>
            Décrivez-nous votre activité et ce que vous attendez de votre site
            ou de votre outil IA. Nous revenons vers vous avec une proposition
            claire et un devis détaillé.
          </p>

          <ul className={`${styles.promises} ${styles.reveal}`}>
            {promises.map((promise) => (
              <li key={promise} className={styles.promise}>
                <span className={styles.tick} aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>

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

            <p className={styles.channel} data-static="true">
              <span className={styles.channelIcon} aria-hidden="true">
                <CalendarBlank size={17} weight="fill" />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>Rendez-vous</span>
                <span className={styles.channelValue}>{hours.label}</span>
              </span>
            </p>

            <p className={styles.channel} data-static="true">
              <span className={styles.channelIcon} aria-hidden="true">
                <MapPin size={17} weight="fill" />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>
                  Zone d&apos;intervention
                </span>
                <span className={styles.channelValue}>
                  {contact.address.locality}, {contact.address.area} — bassin
                  franco-suisse
                </span>
              </span>
            </p>
          </address>
        </div>

        {/* --- Colonne droite : formulaire --- */}
        <div className={`${styles.formWrap} ${styles.reveal}`}>
          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
