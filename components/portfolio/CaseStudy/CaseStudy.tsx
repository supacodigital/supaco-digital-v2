import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/site";
import styles from "./CaseStudy.module.css";

/**
 * Contenu d'une étude de cas — page dédiée `/portfolio/[slug]`.
 * Le texte est intégralement dans le HTML au premier rendu (SEO / a11y) :
 * aucune info n'est portée uniquement par une animation.
 */
type CaseStudyProps = {
  project: Project;
};

export function CaseStudy({ project }: CaseStudyProps) {
  return (
    <article className={styles.root}>
      <div className={styles.shot}>
        <Image
          src={project.image}
          alt={`Aperçu du site ${project.name}`}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          className={styles.shotImg}
          priority
        />
      </div>

      <div className={styles.body}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span>{project.sector}</span>
            <span aria-hidden="true">·</span>
            <span>{project.projectType}</span>
          </p>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.summary}>{project.summary}</p>

          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Zone</dt>
              <dd>{project.area}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Type</dt>
              <dd>{project.projectType}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Année</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Le contexte</h2>
            <p>{project.context}</p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>L&apos;enjeu</h2>
            <p>{project.challenge}</p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notre réponse</h2>
            <p>{project.solution}</p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ce qui a été livré</h2>
            <ul className={styles.deliverables}>
              {project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.outcome}>
          <p className={styles.outcomeLabel}>Le résultat</p>
          <p className={styles.outcomeText}>{project.result}</p>
        </div>

        <div className={styles.actions}>
          <Button
            href={project.url}
            size="md"
            target="_blank"
            rel="noopener"
          >
            Voir le site en ligne
          </Button>
          <a
            className={styles.externalHint}
            href={project.url}
            target="_blank"
            rel="noopener"
          >
            {new URL(project.url).host}
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
