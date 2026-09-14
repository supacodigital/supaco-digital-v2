import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ServiceHero } from "@/components/sections/ServiceHero";
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
      images: [{ url: content.media.poster, alt: content.media.posterAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [content.media.poster],
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
      image: `${site.url}${content.media.poster}`,
      provider: { "@id": `${site.url}/#localbusiness` },
      areaServed: Object.values(serviceAreas).map((zone) => ({
        "@type": "AdministrativeArea",
        name: zone.label,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.title} — prestations`,
        itemListElement: content.deliverables.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item },
        })),
      },
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
    <>
      <ServiceStructuredData slug={service.slug as ServiceSlug} />

      <ServiceHero
        eyebrow={service.title}
        title={content.h1}
        tagline={content.tagline}
        stats={content.stats}
        poster={content.media.poster}
        posterAlt={content.media.posterAlt}
        video={content.media.video}
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      {/* --- Intro + signaux « est-ce pour moi ? » --- */}
      <section className={styles.intro}>
        <Container as="div" className={styles.introInner}>
          <p className={styles.introLede}>{content.intro}</p>

          <aside className={styles.signals} aria-labelledby="signals-title">
            <h2 id="signals-title" className={styles.signalsTitle}>
              Ce service est fait pour vous si…
            </h2>
            <ul className={styles.signalsList}>
              {content.signals.map((signal) => (
                <li key={signal} className={styles.signal}>
                  <span className={styles.signalTick} aria-hidden="true" />
                  {signal}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      {/* --- Sections de contenu long --- */}
      <section className={styles.content}>
        <Container as="div">
          <div className={styles.sections}>
            {content.sections.map((section) => (
              <article key={section.title} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionBodyWrap}>
                  {section.body.map((p) => (
                    <p key={p.slice(0, 40)} className={styles.sectionBody}>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* --- Méthode : visuel + 4 étapes --- */}
      <section className={styles.method} id="methode">
        <Container as="div" className={styles.methodInner}>
          <div className={styles.methodMedia}>
            <Image
              src={content.media.illustration}
              alt={content.media.illustrationAlt}
              width={1200}
              height={905}
              sizes="(max-width: 960px) 100vw, 44vw"
              className={styles.methodImage}
            />
          </div>

          <div className={styles.methodBody}>
            <p className={styles.methodEyebrow}>Notre méthode</p>
            <h2 className={styles.methodTitle}>
              Comment se déroule un projet
            </h2>
            <ol className={styles.steps}>
              {content.process.map((step) => (
                <li key={step.step} className={styles.step}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {step.step}
                  </span>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* --- Livrables --- */}
      <section className={styles.deliverables}>
        <Container as="div">
          <h2 className={styles.blockTitle}>Ce qui est inclus</h2>
          <ul className={styles.deliverablesList}>
            {content.deliverables.map((item) => (
              <li key={item} className={styles.deliverable}>
                <span className={styles.deliverableTick} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* --- FAQ --- */}
      <section className={styles.faq}>
        <Container as="div" className={styles.faqInner}>
          <h2 className={styles.blockTitle}>Questions fréquentes</h2>
          <dl className={styles.faqList}>
            {content.faq.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <dt className={styles.faqQuestion}>{item.q}</dt>
                <dd className={styles.faqAnswer}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* --- Zone d'intervention (SEO local) --- */}
      <section className={styles.areas}>
        <Container as="div">
          <h2 className={styles.blockTitle}>Notre zone d&apos;intervention</h2>
          <p className={styles.areasLede}>
            Nous intervenons sur place et à distance dans tout le bassin
            franco-suisse.
          </p>
          <ul className={styles.areasGrid}>
            {Object.values(serviceAreas).map((zone) => (
              <li key={zone.label} className={styles.areaZone}>
                <p className={styles.areaZoneName}>{zone.label}</p>
                <p className={styles.areaZoneCities}>{zone.cities.join(", ")}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* --- Autres services (maillage interne) --- */}
      <section className={styles.related}>
        <Container as="div">
          <h2 className={styles.blockTitle}>Nos autres services</h2>
          <ul className={styles.relatedGrid}>
            {otherServices.map((s) => {
              const other = serviceContent[s.slug as ServiceSlug];
              return (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className={styles.relatedCard}
                  >
                    <Image
                      src={other.media.poster}
                      alt=""
                      width={1600}
                      height={686}
                      sizes="(max-width: 760px) 100vw, 30vw"
                      className={styles.relatedImage}
                    />
                    <span className={styles.relatedBody}>
                      <span className={styles.relatedTitle}>{s.title}</span>
                      <span className={styles.relatedText}>{s.summary}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* --- CTA final --- */}
      <section className={styles.ctaSection}>
        <Container as="div">
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
        </Container>
      </section>
    </>
  );
}
