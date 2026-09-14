import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { seoKeywords, serviceAreas, site } from "@/lib/site";
import "./globals.css";

// Police d'affichage : géométrique, caractère "studio tech"
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

// Police de texte
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Studio web & IA · Pays de Gex`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.founder }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Studio web & IA du bassin franco-suisse`,
    description: site.description,
    // l'image est fournie par app/opengraph-image.tsx (convention de fichier)
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Studio web & IA du bassin franco-suisse`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * JSON-LD présent sur toutes les pages : nœud `#organization` (identité +
 * signal local : NAP, geo, horaires, zones desservies). L'accueil ajoute
 * par-dessus le `WebSite`, la fiche `#localbusiness` détaillée, le catalogue
 * d'offres et les nœuds `Service` (cf. `HomeStructuredData`).
 */
function StructuredData() {
  const { address, geo } = site.contact;
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "WebDesignCompany"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/opengraph-image`,
    email: site.contact.email,
    telephone: site.contact.phone,
    founder: { "@type": "Person", name: site.founder },
    description: site.description,
    slogan: site.tagline,
    priceRange: site.priceRange,
    currenciesAccepted: "EUR, CHF",
    address: {
      "@type": "PostalAddress",
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
    areaServed: Object.values(serviceAreas).map((zone) => ({
      "@type": "AdministrativeArea",
      name: zone.label,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: site.social.map((s) => s.href),
    identifier: site.legal.siret,
    knowsAbout: seoKeywords,
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD contrôlé, pas de contenu utilisateur
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <StructuredData />
        <a href="#contenu" className="skip-link">
          Passer au contenu
        </a>
        <Header />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
