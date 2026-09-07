import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Breadcrumb.module.css";

/**
 * Fil d'Ariane des pages profondes (services, études de cas, articles).
 * Rend le `<nav>` visible + le JSON-LD `BreadcrumbList` correspondant.
 * Le dernier élément est la page courante (sans lien).
 */
export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? {
            item: item.href.startsWith("http")
              ? item.href
              : `${site.url}${item.href}`,
          }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD contrôlé, pas de contenu utilisateur
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
        <ol>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={item.label}
                aria-current={isLast ? "page" : undefined}
              >
                {item.href && !isLast ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  item.label
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
