"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarBlank,
  EnvelopeSimple,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { SupacoMark } from "@/components/ui/SupacoMark";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section « Contact » de la page d'accueil — dernier bloc de conversion avant
 * le footer. Retour au thème sombre après les sections claires (Services,
 * Réalisations). À gauche : accroche + coordonnées directes (NAP issu de
 * `lib/site.ts`, source unique). À droite : le formulaire de demande de devis
 * (validé côté client et serveur, cf. `app/api/contact`). Tout le texte est
 * dans le HTML dès le premier rendu ; GSAP ne révèle que des éléments déjà
 * indexables, en cascade au scroll.
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
        stagger: 0.08,
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
      {/* filigrane de marque, décoratif */}
      <SupacoMark
        variant="mono"
        className={styles.watermark}
        aria-hidden="true"
      />

      <Container as="div" className={styles.inner}>
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>Contact</p>
          <h2 id="contact-title" className={`${styles.title} ${styles.reveal}`}>
            Parlons de votre projet
          </h2>
          <p className={`${styles.lede} ${styles.reveal}`}>
            Décrivez-nous votre activité et ce que vous attendez de votre site
            ou de votre outil IA. Nous revenons vers vous avec une proposition
            claire et un devis détaillé, sans engagement.
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
            </a>

            <a href={`mailto:${contact.email}`} className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <EnvelopeSimple size={17} weight="fill" />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>E-mail</span>
                <span className={styles.channelValue}>{contact.email}</span>
              </span>
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

        <div className={`${styles.formWrap} ${styles.reveal}`}>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
