import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  serviceAreas,
  serviceContent,
  services,
  site,
  type ServiceSlug,
} from "@/lib/site";
import styles from "./page.module.css";

/** Génère une page statique par pilier de service. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

function getService(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return { service, content: serviceContent[service.slug as ServiceSlug] };
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getService(slug);
  if (!found) return {};
  const { content } = found;
  const url = `/services/${slug}`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: content.metaTitle,
      description: content.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

/** JSON-LD Service + FAQPage de la page. */
function ServiceStructuredData({ slug }: { slug: ServiceSlug }) {
  const { service, content } = getService(slug)!;
  const url = `${site.url}/services/${slug}`;

  const graph = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: content.h1,
      serviceType: service.title,
      url,
      description: content.metaDescription,
      provider: { "@id": `${site.url}/#localbusiness` },
      areaServed: Object.values(serviceAreas).map((zone) => ({
        "@type": "AdministrativeArea",
        name: zone.label,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON-LD contrôlé, pas de contenu utilisateur
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const found = getService(slug);
  if (!found) notFound();
  const { service, content } = found;

  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <Container as="div" className={styles.wrap}>
      <ServiceStructuredData slug={service.slug as ServiceSlug} />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <article className={styles.article}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>{service.title}</p>
          <h1 className={styles.title}>{content.h1}</h1>
          <p className={styles.intro}>{content.intro}</p>
          <div className={styles.headActions}>
            <Button href="/#contact" size="lg">
              Demander un devis
            </Button>
            <Link
              href="/tarifs"
              className={styles.secondaryLink}
              prefetch={false}
            >
              Voir les tarifs
            </Link>
          </div>
        </header>

        <div className={styles.sections}>
          {content.sections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.body.map((p) => (
                <p key={p.slice(0, 40)} className={styles.sectionBody}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className={styles.deliverables}>
          <h2 className={styles.sectionTitle}>Ce qui est inclus</h2>
          <ul className={styles.deliverablesList}>
            {content.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>Questions fréquentes</h2>
          <dl className={styles.faqList}>
            {content.faq.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.areas}>
          <h2 className={styles.sectionTitle}>Notre zone d&apos;intervention</h2>
          <p className={styles.areasLede}>
            Nous intervenons sur place et à distance dans tout le bassin
            franco-suisse.
          </p>
          <ul className={styles.areasGrid}>
            {Object.values(serviceAreas).map((zone) => (
              <li key={zone.label} className={styles.areaZone}>
                <p className={styles.areaZoneName}>{zone.label}</p>
                <p className={styles.areaZoneCities}>
                  {zone.cities.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.related}>
          <h2 className={styles.sectionTitle}>Nos autres services</h2>
          <ul className={styles.relatedList}>
            {otherServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`}>
                  {serviceContent[s.slug as ServiceSlug].h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.cta}>
          <div>
            <p className={styles.ctaKicker}>Prêt à avancer&nbsp;?</p>
            <p className={styles.ctaTitle}>
              Décrivez votre projet, on vous répond avec un devis clair.
            </p>
          </div>
          <Button href="/#contact" size="lg">
            Demander un devis
          </Button>
        </div>
      </article>
    </Container>
  );
}
