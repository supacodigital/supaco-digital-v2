import { Star } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { testimonials } from "@/lib/site";
import styles from "./Testimonials.module.css";

/** Logo Google officiel (4 couleurs) — pas d'équivalent dans Phosphor Icons. */
function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.8 13.8 0 0 1 10.98 24c0-1.45.25-2.86.71-4.18v-5.7H4.34A21.93 21.93 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/** Carte témoignage individuelle — reprend les codes visuels d'un avis Google. */
function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  const initial = testimonial.author.charAt(0).toUpperCase();
  return (
    <li className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.identity}>
          <span className={styles.author}>{testimonial.author}</span>
          <span className={styles.meta}>
            {testimonial.reviewCount} avis · {testimonial.relativeDate}
          </span>
        </span>
        <GoogleLogo />
      </div>

      <span className={styles.stars} aria-label={`${testimonial.rating} sur 5 étoiles`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={15} weight="fill" aria-hidden="true" />
        ))}
      </span>

      <p className={styles.text}>{testimonial.text}</p>
    </li>
  );
}

/**
 * Section « Avis clients » — bandeau défilant en boucle (CSS pur, même
 * pattern que le Marquee zone d'intervention) de cartes façon Google Reviews.
 * Thème sombre, entre FAQ (clair) et Contact. Les avis sont dans le HTML dès
 * le premier rendu (indexables + alimentent le JSON-LD Review/AggregateRating).
 */
export function Testimonials() {
  const cards = (ariaHidden: boolean) => (
    <ul className={styles.track} aria-hidden={ariaHidden || undefined}>
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.author} testimonial={testimonial} />
      ))}
    </ul>
  );

  return (
    <section
      id="avis"
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
    >
      <Container as="div" className={styles.head}>
        <p className={styles.eyebrow}>Avis clients</p>
        <h2 id="testimonials-title" className={styles.title}>
          Ce qu&apos;en disent nos clients
        </h2>
        <span className={styles.ratingLine}>
          <GoogleLogo />
          <span className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={16} weight="fill" />
            ))}
          </span>
          <span className={styles.ratingText}>5,0 sur Google</span>
        </span>
      </Container>

      <div className={styles.marquee} role="region" aria-label="Avis clients Google">
        <div className={styles.viewport}>
          {cards(false)}
          {cards(true)}
        </div>
      </div>
    </section>
  );
}
