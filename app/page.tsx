import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/ui/Marquee";
import { HomeStructuredData } from "@/components/seo/HomeStructuredData";
import { site } from "@/lib/site";

/**
 * Métadonnées de l'accueil — ciblage SEO local « agence web / création de
 * site internet » sur le Pays de Gex et le bassin franco-suisse. Elles
 * priment sur le `title.default` du layout.
 */
export const metadata: Metadata = {
  title: "Agence web dans le Pays de Gex — sites internet, IA & automatisation",
  description:
    "Agence web à Saint-Genis-Pouilly : création de sites internet, e-commerce, agents IA et automatisation pour les TPE, PME et artisans du Pays de Gex, de l'Ain et de la région de Genève.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Supaco Digital — agence web du Pays de Gex & du bassin franco-suisse",
    description:
      "Création de sites internet, agents IA, SaaS sur-mesure et automatisation pour les entreprises du Pays de Gex, de l'Ain et de Genève.",
    url: site.url,
  },
};

/**
 * Page d'accueil — scroll unique.
 * Sections : héro, bandeau zone d'intervention, services, réalisations, FAQ,
 * avis clients, contact. Le bloc offres viendra s'insérer entre services et
 * réalisations.
 */
export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Hero />
      <Marquee items={site.serviceArea} label="Zone d'intervention" />
      <Services />
      <Realisations />
      <Testimonials />
      <Contact />
    </>
  );
}
