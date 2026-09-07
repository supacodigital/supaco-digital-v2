import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/lib/site";

/**
 * Page d'accueil — scroll unique.
 * Sections : héro, bandeau zone d'intervention, services, réalisations. Les
 * blocs offres / contact viendront s'ajouter ici.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.serviceArea} label="Zone d'intervention" />
      <Services />
      <Realisations />
    </>
  );
}
