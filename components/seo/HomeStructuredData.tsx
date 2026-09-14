import {
  allServiceCities,
  seoKeywords,
  serviceAreas,
  services,
  serviceContent,
  site,
  testimonials,
} from "@/lib/site";

/**
 * Données structurées spécifiques à la page d'accueil — complètent le nœud
 * `#organization` posé dans le layout (présent sur tout le site).
 *
 * - `WebSite` : identité du site.
 * - `ProfessionalService` (#localbusiness) : fiche d'entreprise locale enrichie
 *   — zones desservies détaillées (Pays de Gex, Ain, Genève), catalogue
 *   d'offres, mots-clés, avis clients (`aggregateRating` + `review`, alimentés
 *   par `testimonials` — source : fiche Google Business Profile), lien vers
 *   le nœud organisation.
 * - `Service` (un par pilier) : rattachés au prestataire, avec `areaServed`.
 *
 * Tout est en un seul `@graph` pour que Google relie les nœuds par `@id`.
 */
export function HomeStructuredData() {
  const { address, geo } = site.contact;
  const orgId = `${site.url}/#organization`;
  const localBusinessId = `${site.url}/#localbusiness`;

  const areaServed = [
    ...Object.values(serviceAreas).map((zone) => ({
      "@type": "AdministrativeArea",
      name: zone.label,
    })),
    ...allServiceCities.map((name) => ({ "@type": "City", name })),
  ];

  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "fr-FR",
      publisher: { "@id": orgId },
    },
    {
      "@type": ["ProfessionalService", "WebDesignCompany"],
      "@id": localBusinessId,
      name: site.name,
      url: site.url,
      image: `${site.url}/opengraph-image`,
      logo: `${site.url}/icon.png`,
      email: site.contact.email,
      telephone: site.contact.phone,
      priceRange: site.priceRange,
      currenciesAccepted: "EUR, CHF",
      parentOrganization: { "@id": orgId },
      description:
        "Agence web du Pays de Gex : création de sites internet, e-commerce, agents IA, SaaS sur-mesure et automatisation pour les TPE, PME et artisans du bassin franco-suisse.",
      slogan: site.tagline,
      knowsAbout: seoKeywords,
      address: {
        "@type": "PostalAddress",
        streetAddress: address.locality,
        addressLocality: address.locality,
        postalCode: address.postalCode,
        addressRegion: address.region,
        addressCountry: address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
      areaServed,
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      sameAs: site.social.map((s) => s.href),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating,
        reviewCount: testimonials.length,
        bestRating: 5,
      },
      review: testimonials.map((t) => ({
        "@type": "Review",
        author: { "@type": "Person", name: t.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating,
          bestRating: 5,
        },
        reviewBody: t.text,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services Supaco Digital",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            url: `${site.url}/services/${service.slug}`,
            description: serviceContent[service.slug].metaDescription,
          },
        })),
      },
    },
    ...services.map((service) => ({
      "@type": "Service",
      "@id": `${site.url}/services/${service.slug}#service`,
      name: serviceContent[service.slug].h1,
      serviceType: service.title,
      url: `${site.url}/services/${service.slug}`,
      description: serviceContent[service.slug].metaDescription,
      provider: { "@id": localBusinessId },
      areaServed: Object.values(serviceAreas).map((zone) => ({
        "@type": "AdministrativeArea",
        name: zone.label,
      })),
    })),
  ];

  const data = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD contrôlé, pas de contenu utilisateur
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
