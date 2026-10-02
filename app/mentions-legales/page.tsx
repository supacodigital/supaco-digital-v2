import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Supaco Digital : éditeur, hébergeur, propriété intellectuelle et protection des données personnelles.",
  alternates: { canonical: "/mentions-legales" },
  // page obligatoire mais sans intérêt de recherche : hors index, liens suivis
  robots: { index: false, follow: true },
};

/** Valeur légale pas encore renseignée dans `site.legal` : signalée à l'écran. */
function Todo({ children }: { children: string }) {
  return <span className={styles.todo}>{children}</span>;
}

/**
 * Mentions légales (LCEN, art. 6) + information RGPD sur le formulaire de
 * contact (art. 13). Toutes les coordonnées viennent de `lib/site.ts` (source
 * unique, cohérence du NAP). À tenir à jour si un outil de mesure d'audience
 * (GA4…) est ajouté : la section « Cookies » devra alors changer.
 */
export default function LegalNoticePage() {
  const { contact, legal } = site;
  const { address } = contact;
  const owner = legal.owner || <Todo>Prénom et nom à compléter</Todo>;

  return (
    <Container as="div" className={styles.wrap}>
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]}
      />

      <header className={styles.head}>
        <h1 className={styles.title}>Mentions légales</h1>
        <p className={styles.lede}>
          Informations sur l&apos;éditeur du site {site.domain}, son hébergeur
          et la manière dont vos données sont traitées.
        </p>
      </header>

      <div className={styles.body}>
        <section aria-labelledby="editeur">
          <h2 id="editeur">Éditeur du site</h2>
          <p>
            {site.name} est le nom commercial de l&apos;entreprise individuelle
            de {owner}.
          </p>
          <dl className={styles.facts}>
            <dt>Adresse</dt>
            <dd>
              {legal.streetAddress || <Todo>Adresse à compléter</Todo>},{" "}
              {address.postalCode} {address.locality}, France
            </dd>
            <dt>Téléphone</dt>
            <dd>
              <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a>
            </dd>
            <dt>E-mail</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <dt>Immatriculation</dt>
            <dd>
              SIREN {legal.siret} — {legal.rcs}
            </dd>
            <dt>TVA</dt>
            <dd>{legal.vatNote}</dd>
          </dl>
        </section>

        <section aria-labelledby="publication">
          <h2 id="publication">Directeur de la publication</h2>
          <p>{owner}, en qualité d&apos;entrepreneur individuel.</p>
        </section>

        <section aria-labelledby="hebergeur">
          <h2 id="hebergeur">Hébergeur</h2>
          <dl className={styles.facts}>
            <dt>Société</dt>
            <dd>{legal.host.name}</dd>
            <dt>Adresse</dt>
            <dd>{legal.host.address}</dd>
            <dt>Téléphone</dt>
            <dd>{legal.host.phone}</dd>
            <dt>Site</dt>
            <dd>
              <a href={legal.host.url} rel="noopener" target="_blank">
                {legal.host.url.replace("https://", "")}
              </a>
            </dd>
          </dl>
        </section>

        <section aria-labelledby="propriete">
          <h2 id="propriete">Propriété intellectuelle</h2>
          <p>
            Les textes, visuels, logos et le code de ce site sont la propriété
            de {site.name}, sauf mention contraire. Toute reproduction, même
            partielle, sans autorisation écrite préalable est interdite.
          </p>
          <p>
            Les noms, logos et captures des sites clients présentés dans les
            réalisations restent la propriété de leurs titulaires respectifs.
          </p>
        </section>

        <section aria-labelledby="donnees">
          <h2 id="donnees">Données personnelles</h2>
          <p>
            Le formulaire de contact collecte votre nom, un numéro de téléphone
            ou une adresse e-mail et, si vous les renseignez, le type de projet
            et votre message. Ces données servent uniquement à répondre à votre
            demande et, le cas échéant, à vous adresser un devis : leur
            traitement repose sur les mesures précontractuelles prises à votre
            demande (article 6.1.b du RGPD).
          </p>
          <dl className={styles.facts}>
            <dt>Responsable</dt>
            <dd>
              {site.name} ({owner}) —{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <dt>Destinataires</dt>
            <dd>
              {site.name} uniquement. Les e-mails sont acheminés par Resend
              (Resend, Inc.), qui agit comme sous-traitant. Ce prestataire étant
              établi aux États-Unis, vos données peuvent y être transférées.
            </dd>
            <dt>Conservation</dt>
            <dd>
              3 ans à compter de notre dernier échange, puis suppression.
            </dd>
          </dl>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de limitation, d&apos;opposition et de
            portabilité sur vos données. Pour l&apos;exercer, écrivez à{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>. Vous pouvez
            aussi adresser une réclamation à la CNIL (
            <a href="https://www.cnil.fr" rel="noopener" target="_blank">
              cnil.fr
            </a>
            ).
          </p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies">Cookies</h2>
          <p>
            Ce site ne dépose aucun cookie publicitaire ni de mesure
            d&apos;audience. Aucun consentement n&apos;est donc demandé lors de
            votre visite.
          </p>
        </section>
      </div>
    </Container>
  );
}
