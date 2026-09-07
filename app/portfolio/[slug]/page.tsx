import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/portfolio/CaseStudy";
import { Container } from "@/components/ui/Container";
import { getProject, projects, site } from "@/lib/site";
import styles from "./page.module.css";

/**
 * Page dédiée d'une étude de cas — rendue lors d'un accès direct à l'URL,
 * d'un rechargement, ou depuis la page /portfolio. Depuis l'accueil, la même
 * URL s'ouvre en modale (route interceptée `@modal/(.)portfolio/[slug]`).
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `Étude de cas ${project.name} — ${project.projectType}`;
  const description = project.summary;
  const url = `/portfolio/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: project.image, alt: `Aperçu du site ${project.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  };
}

function BreadcrumbData({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Réalisations",
        item: `${site.url}/#portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${site.url}/portfolio/${slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <Container as="div" className={styles.wrap}>
      <BreadcrumbData name={project.name} slug={project.slug} />

      <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
        <ol>
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#portfolio">Réalisations</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{project.name}</li>
        </ol>
      </nav>

      <CaseStudy project={project} />

      <div className={styles.back}>
        <Link href="/#portfolio" className={styles.backLink}>
          ← Retour aux réalisations
        </Link>
      </div>
    </Container>
  );
}
