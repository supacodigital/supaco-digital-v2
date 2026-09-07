import type { MetadataRoute } from "next";
import { site, services, projects } from "@/lib/site";

/**
 * Sitemap généré nativement. On n'y liste que des URLs qui existent
 * réellement : `/tarifs` et `/blog` seront ajoutés à la création des pages.
 * Pas de page /portfolio (index) : les réalisations vivent dans une section
 * de l'accueil, mais chaque étude de cas a sa page dédiée /portfolio/[slug].
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/services"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const caseStudyRoutes = projects.map((p) => ({
    url: `${site.url}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes];
}
