# CLAUDE.md — Supaco Digital (site vitrine agence)

Ce fichier sert de contexte de référence pour Claude Code sur le projet de site web
principal de l'agence **Supaco Digital** (supaco-digital.com). Un seul fichier
CLAUDE.md pour ce projet — pas de système multi-fichiers.

---

## 1. Identité du projet

- **Agence** : Supaco Digital — studio web & IA solo
- **Fondateur** : Supa, développeur/fondateur unique
- **Localisation** : Saint-Genis-Pouilly (Pays de Gex, Ain), bassin franco-suisse
- **Cible** : TPE, PME, artisans et indépendants du bassin franco-suisse
- **Statut légal** : entreprise individuelle, franchise en base de TVA (art. 293 B CGI)
  — ne pas afficher de mention de TVA sur les tarifs
- **SIRET** : FR86945066207 — RCS Bourg-en-Bresse 945 066 207

## 2. Objectif du site

Site vitrine qui doit :

1. Présenter l'agence et ses services de façon crédible et premium (le site est
   lui-même une démonstration du savoir-faire).
2. Convertir des prospects TPE/PME/artisans en demandes de devis/contact.
3. Présenter clairement les services "site web" et amener au devis (cf. §4 —
   tarification sur devis, pas de grille de prix).
4. Mettre en avant le portfolio client comme preuve sociale.

**Ne pas** : promettre de délai de livraison (ex. "livré en 72h") — interdit dans
tous les supports Supaco.

## 3. Services à présenter

Quatre piliers de service :

- **Sites web** (vitrine, e-commerce, plateformes sur-mesure)
- **Agents IA** (assistants, automatisation conversationnelle)
- **SaaS sur-mesure**
- **Automatisation** (flux métier, intégrations)

## 4. Tarification (décision : tout sur devis)

**Aucun prix fixe affiché sur le site.** Chaque projet est chiffré sur devis
selon le périmètre (nombre de pages, fonctionnalités, e-commerce ou non, reprise
de contenus). Le site pousse vers le formulaire de contact pour obtenir une
proposition.

- **Maintenance mensuelle** (quand elle s'applique) : **150 € ou 250 €/mois**
  selon le projet. Elle **inclut le nom de domaine et l'hébergement**, les mises
  à jour de sécurité, les sauvegardes, le support et les petites évolutions.
- JSON-LD `priceRange` : `"€€"` (gamme modérée, pas de fourchette chiffrée).
- ⚠️ Ne jamais réintroduire de grille de prix fixes (Essentiel/Croissance/
  Performance à 1 800 / 3 000 / 4 500 €) — abandonnée.
- Une page `/tarifs` est prévue dans l'arborescence : elle expliquera la
  démarche devis + ce qui est inclus, sans chiffres à la commande.

## 5. Portfolio / preuve sociale

Clients réalisés à mentionner :
Sabai, Whally's, Rif-line, Gex Énergies, BelliFood, Kekosan, Dépannage Gémeaux,
Broderie (client suisse e-commerce).

- Prévoir une **page dédiée par client (étude de cas)** plutôt qu'une simple
  grille de logos/captures : contexte, problème résolu, résultat concret si
  disponible (ex. "+40% de commandes en ligne"). Plus de contenu indexable,
  meilleur maillage interne, et preuve plus convaincante pour un prospect.

## 6. Contenu & structure des pages

- **Blog / ressources** : section articles ciblant le SEO longue traîne local
  (ex. "Pourquoi refaire son site en 2026", "Site web pour artisan à Gex : ce
  qu'il faut savoir"). C'est souvent ce qui manque le plus par rapport à un
  site vitrine purement statique — à prioriser.
- **Fil d'Ariane (breadcrumbs)** sur les pages profondes (services, études de
  cas, articles), avec balisage `BreadcrumbList` en complément du
  `LocalBusiness`/`Organization`.
- Arborescence à trancher avec Supa : page unique en scroll vs plusieurs pages
  (le blog et les études de cas nécessitent de toute façon des pages séparées).

## 7. Direction artistique

- **Thème** : dark glassmorphism
- **Gradient signature** : cyan `#35A7F0` → bleu `#2563EB`
  (⚠️ ce gradient est réservé à l'identité Supaco — ne jamais le réutiliser sur
  un site client)
- **Icônes** : Phosphor Icons
- **Scroll** : GSAP + Lenis (smooth scroll + ScrollTrigger)
- **Transitions de composants** : Framer Motion (`motion.*`, mount/unmount)
- Chercher un rendu premium, pas un template générique — s'inspirer des
  ressources habituelles (Haikei, ui.glass, Grainy Gradients, Fontshare,
  Fontsource, SVG Backgrounds) si besoin d'assets visuels.
- **Accessibilité (WCAG de base)** : contraste suffisant malgré le thème sombre,
  focus visible au clavier, `alt` sur les images. Le glassmorphism trop sombre
  peut vite pénaliser la lisibilité — à vérifier explicitement, pas juste "à
  l'oeil".

### Logo & assets

Deux variantes du logo existent, à ne pas confondre :

- **Icône seule (monochrome)** : bleu marine foncé `#011A42` — pour favicon,
  usages compacts, ou sur fond très clair où le dégradé serait peu lisible
- **Version complète (icône + wordmark "upaco digital")** : icône en dégradé
  cyan `#35A7F0` → bleu `#2563EB`, wordmark en bleu marine foncé — version
  principale pour le header et le footer du site
- Une **version animée** de l'icône existe déjà (utilisée en photo de profil) —
  à réutiliser telle quelle pour un loader de page ou une micro-animation
  d'intro plutôt que d'en recréer une
- Prévoir un espace de respiration suffisant autour du logo (clear space) et ne
  jamais recolorer l'icône dans une autre teinte que ses deux variantes
  officielles

## 8. Stack technique

- **Frontend** : Next.js (App Router) + TypeScript, CSS Modules (pas de
  Tailwind, pas de style inline)
- **Animations** : triade GSAP (`@gsap/react`, `useGSAP()`) + Framer Motion +
  Lottie (`lottie-react`) si besoin de micro-animations
- **Formulaire de contact / backend léger** (si nécessaire) : Node.js + Express
  ESM, architecture en couches routes → controllers → services → repositories,
  validation Zod
- **Base de données** : SQLite (`better-sqlite3`, SQL brut, pas d'ORM) ou simple
  JSON si le besoin de persistance est minimal
- **Data fetching** : TanStack Query si des appels réseau côté client sont
  nécessaires
- **Composants réutilisables** : envisager Storybook si le design system
  devient conséquent

### Exigences SEO à respecter dès la conception

- **Métadonnées** : `title` et `meta description` uniques et optimisés par page
  (via l'API `generateMetadata` de Next.js), Open Graph + Twitter Card sur
  chaque page
- **Structure sémantique** : un seul `<h1>` par page, hiérarchie `h2`/`h3`
  cohérente, balises `<nav>`, `<main>`, `<footer>` sémantiques
- **Performance** : images en `next/image` (lazy loading + formats modernes
  WebP/AVIF), fonts en `next/font` (pas de FOUT/FOIT), attention au poids des
  animations GSAP/Framer Motion sur mobile (Core Web Vitals : LCP, CLS, INP)
- **Preload critique** : précharger les fonts critiques et le CSS above-the-fold
  pour améliorer le LCP dès le premier rendu
- **Indexation** : `sitemap.xml` et `robots.txt` générés automatiquement,
  `next-sitemap` ou génération native App Router
- **Données structurées** : JSON-LD `LocalBusiness` (adresse Saint-Genis-Pouilly,
  zone de service bassin franco-suisse) + `Organization` sur la page d'accueil,
  `Service` sur les pages de service, `BreadcrumbList` sur les pages profondes
- **URLs** : propres et descriptives (`/services/sites-web`, `/tarifs`,
  `/portfolio`, `/blog/...`), pas de paramètres inutiles
- **Contenu** : prévoir un minimum de texte indexable par section (le contenu
  ne doit pas être uniquement porté par des animations/interactions qui
  masquent le texte au premier rendu)
- **Local SEO** : cibler les recherches locales (Pays de Gex, Saint-Genis-Pouilly,
  Gex, Ferney-Voltaire, bassin franco-suisse) dans les titres/contenus
- **Vitesse** : hébergement déjà sur VPS Hostinger — configurer la compression
  (gzip/brotli), le cache Nginx et un CDN si besoin pour les assets statiques

## 9. Confiance & rich snippets

- **Google Business Profile** : fiche à créer/optimiser en parallèle du site
  (photos, catégorie, zone de service Pays de Gex/Genève), avec cohérence
  stricte du **NAP** (nom / adresse / téléphone) entre le site et la fiche.
- **Schema `Review` / `AggregateRating`** si des avis clients sont disponibles
  (notamment via Google Business Profile) — génère des étoiles dans les
  résultats de recherche, à intégrer dès que le contenu (avis) existe.
- **`hreflang`** à envisager si le site cible aussi explicitement le public
  suisse francophone (cross-border) — point secondaire, à trancher selon
  l'évolution du ciblage géographique.

## 10. Suivi & mesure

- **Google Search Console** + **GA4** configurés dès le lancement (pas après
  coup) — sans ça, pas de visibilité sur l'indexation ni la conversion.
- **Core Web Vitals en production** : suivi continu (pas seulement un audit
  Lighthouse ponctuel), en particulier sur mobile où les animations
  GSAP/Framer Motion peuvent faire grimper le CLS/INP si mal maîtrisées.

## 11. Conventions de code

- Commentaires en français, identifiants (variables, fonctions, composants) en
  anglais
- Composants React fonctionnels uniquement
- Pas de Tailwind, pas de style inline — CSS Modules
- Un seul fichier CLAUDE.md pour ce projet (pas de spec multi-fichiers)

## 12. Déploiement

- VPS Hostinger KVM1 (Ubuntu)
- PM2 + Nginx + Certbot
- Possibilité d'utiliser l'extension Hostinger Connector (VS Code) en complément
  d'un déploiement manuel SSH/PM2

## 13. Notes ouvertes / à clarifier avec Supa avant de démarrer

- Contenu de la future page `/tarifs` (démarche devis + ce qui est inclus,
  sans prix à la commande — cf. §4)
- Arborescence définitive des pages (accueil scroll unique + pages séparées
  pour blog/études de cas/tarifs ?)
- Visuels/captures et résultats chiffrés du portfolio client à intégrer
- Disponibilité ou non d'avis clients pour le schema Review/AggregateRating

---

## 14. Décisions prises (session en cours)

- **Gestionnaire de paquets** : pnpm
- **Versions** : Next.js 16 (App Router) + React 19 + TypeScript 5
- **Arborescence retenue** : accueil en scroll unique (hero, bandeau zone, services,
  réalisations, FAQ, contact) + pages dédiées `/services/[slug]`, `/tarifs`,
  `/portfolio` + `/portfolio/[client]`, `/blog` + `/blog/[slug]`, `/contact`,
  `/mentions-legales`
- **Tarification** : tout sur devis, pas de grille de prix (cf. §4). Maintenance
  150/250 €/mois selon projet, nom de domaine + hébergement inclus.
- **Assets sources** : dans `assets-source/` (hors build). Assets publics
  optimisés à placer dans `public/`
- ⚠️ Next.js 16 a des breaking changes — consulter `node_modules/next/dist/docs/`
  avant d'écrire du code Next spécifique

### Composants réalisés

- `components/ui/Button` — **bouton identitaire** : parallélogramme incliné ~8°
  vers l'avant (silhouette `clip-path`, ombre `filter: drop-shadow`). Variantes
  `primary` / `glass` / `ghost`, tailles `sm/md/lg`, `uppercase`, `fullWidth`.
  C'est LA forme signature du site — réutiliser partout où il y a un CTA.
- `components/ui/SupacoMark/Logo` — logo header/footer, image `logodesktop.png`
  (détourée de `supacodigital.png`, fond sombre uniquement). `SupacoMark` = icône
  SVG seule (variantes `gradient` / `mono`).
- `components/ui/Container` — conteneur centré, largeur max 1200px.
- `components/layout/Header` — **`position: fixed`, superposé** : transparent en
  haut de page (le hero passe dessous), fond **bleu nuit opaque `#0a1836` + texte
  blanc au scroll** (seuil 24px, `data-scrolled`). Logo à gauche ; nav
  (MAJUSCULES) + CTA « DEVIS » à droite ; le CTA passe `sm` au scroll. Mobile :
  mini-CTA + burger ; menu plein écran avec accordéon Services.
  ⚠️ Header hors flux → `<main>` a `padding-top: var(--header-h)` par défaut
  (`globals.css`) ; une section qui gère elle-même cet espace (hero) porte
  `.bleed-top` (`margin-top: calc(var(--header-h) * -1)`).
- `components/layout/Footer` — bloc CTA + NAP complet (adresse, tél
  +33 7 83 05 24 12, contact@supaco-digital.com, horaires) + réseaux (IG / FB /
  LinkedIn) + colonnes Services/Agence + zone d'intervention (SEO local) +
  mentions légales. Coordonnées et `sameAs` centralisés dans `lib/site.ts`,
  repris dans le JSON-LD du layout.
- `components/layout/MegaMenu` + `components/ui/ServiceCard` — mega-menu
  « Services » plein largeur au survol (délai de grâce à la fermeture, `Échap`,
  scrim qui assombrit la page). 4 cartes égales : fond dégradé placeholder
  (`services[].bg` dans `lib/site.ts`) + motif SVG (`ServiceMotif`) + titre
  centré. **Les fonds sont des placeholders** — à remplacer par de vraies photos.
- `components/sections/Hero` — photo de fond (Mont-Blanc, `public/hero/mont-blanc.webp`,
  `next/image` fill + priority + blur placeholder) sous un **voile dégradé sombre
  fort** (`.veil`) qui garantit le contraste WCAG du texte blanc. Parallaxe léger
  GSAP ScrollTrigger (`yPercent`, scrub, désactivé si `prefers-reduced-motion`).
  L'accent du titre utilise `--brand-gradient-bright` (cyan clair → bleu moyen,
  lisible sur photo) — le vrai `--brand-gradient` reste réservé logo + boutons.
  Pas de quadrillage (retiré). Ghost mark : `SupacoMark variant="mono"` très discret.
- `components/sections/Faq` — section **claire** (palette locale `--s-*` comme
  Services / Réalisations), entre `Realisations` et `Contact` sur l'accueil.
  Accordéon `<dl>` sémantique : un seul panneau ouvert (`useState`, premier ouvert
  par défaut), `aria-expanded` / `aria-controls`, `<dd role="region">`. L'ouverture
  anime `grid-template-rows: 0fr → 1fr` (hauteur fluide sans mesure JS), icône `+`
  qui pivote à `135deg`. Contenu dans `homeFaq` (`lib/site.ts`) → alimente aussi
  le JSON-LD `FAQPage` de `HomeStructuredData`. Révélation GSAP stagger au scroll.
- `components/sections/Services` — cartes : le **titre** est un `<Link>` vers
  `/services/[slug]` (maillage interne SEO), le **CTA du pied** (`Button`) va
  droit au `/#contact`. Hauteur des 4 cartes égalisée par « Sites web » (5
  livrables vs 4) + `align-items: stretch`. Deux filigranes `SupacoMark mono`
  (haut-droite + gauche à hauteur du titre, rotations opposées).
- `lib/SmoothScroll` — Lenis + GSAP ticker, respecte `prefers-reduced-motion`.

### Accessibilité / SEO — acquis

- **Skip link** « Passer au contenu » (`.skip-link` dans `globals.css`) →
  `<main id="contenu" tabIndex={-1}>`.
- Le footer n'utilise **pas de `<h2>`** pour ses titres de colonnes (`<p>` +
  `aria-label` sur les `<nav>`) — pour ne pas polluer la hiérarchie Hn des pages.
- Menu mobile = `<nav aria-label="Navigation mobile">`.
- `aria-current="page"` sur le lien de nav actif (helper `isActive`).
- Mega-menu : navigation clavier complète (Tab entre dans le panneau, Tab
  sortant ferme + va au lien suivant, Shift+Tab revient, Échap ferme, clic sur
  le scrim ferme).
- Liens sociaux : `rel="me noopener"` (pas `noreferrer`), `target="_blank"`.
- **Pas de `meta keywords`** (ignoré par Google, retiré du layout).
- Icônes du header en **SVG inline** (`components/layout/Header/icons.tsx`),
  pas d'import Phosphor dans le composant client.
- Copyright footer : plage `2025–<année>` calculée au build (stable).

### Règles UI apprises

- `[hidden] { display: none !important }` est dans `globals.css` : ne pas
  remettre un `display` explicite qui l'écraserait sur un élément togglé par
  l'attribut `hidden`.
- Panneaux superposés (mega-menu, menu mobile) : fond **opaque**
  (`background-color` solide), pas de `rgba` + `backdrop-filter` qui laisse
  transparaître le contenu.
- `clip-path` rogne `box-shadow` : pour une ombre sur une forme découpée,
  utiliser `filter: drop-shadow()`.
- Reset d'état sur changement de route : pattern « setState pendant le rendu »
  avec `prevPathname` en `useState` (pas d'effet, lint-clean).
- Liens `<Link>` du footer : `prefetch={false}` (évite ~15 prefetch au scroll bas).
