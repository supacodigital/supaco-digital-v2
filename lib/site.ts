/**
 * Constantes globales du site Supaco Digital.
 * Source unique pour le NAP (nom / adresse / téléphone), la navigation
 * et les métadonnées — cohérence stricte avec la fiche Google Business Profile.
 */

export const site = {
  name: "Supaco Digital",
  legalName: "Supaco Digital",
  founder: "Supa",
  domain: "supaco-digital.com",
  url: "https://supaco-digital.com",
  tagline: "Studio web & IA du bassin franco-suisse",
  description:
    "Supaco Digital conçoit des sites web, agents IA, SaaS sur-mesure et automatisations pour les TPE, PME et artisans du Pays de Gex et du bassin franco-suisse.",

  // NAP — doit rester identique partout (site, footer, JSON-LD, Google Business Profile)
  contact: {
    email: "contact@supaco-digital.com",
    // format affiché + format lien tel: (E.164)
    phone: "+33 7 83 05 24 12",
    phoneHref: "+33783052412",
    address: {
      locality: "Saint-Genis-Pouilly",
      region: "Ain",
      area: "Pays de Gex",
      postalCode: "01630",
      country: "FR",
    },
    // coordonnées approximatives de Saint-Genis-Pouilly (JSON-LD geo)
    geo: { latitude: 46.2436, longitude: 6.0217 },
  },

  // horaires — cohérence avec Google Business Profile
  hours: {
    label: "Sur rendez-vous, du lundi au vendredi",
    // format schema.org openingHours
    schema: "Mo-Fr 09:00-18:00",
  },

  // réseaux sociaux — alimentent `sameAs` du JSON-LD
  social: [
    {
      label: "Instagram",
      icon: "instagram" as const,
      href: "https://www.instagram.com/supacodigital/",
      handle: "@supacodigital",
    },
    {
      label: "Facebook",
      icon: "facebook" as const,
      href: "https://www.facebook.com/SupacoDigital/",
      handle: "SupacoDigital",
    },
    {
      label: "LinkedIn",
      icon: "linkedin" as const,
      href: "https://www.linkedin.com/in/supaco-digital-24384041b",
      handle: "Supaco Digital",
    },
  ],

  legal: {
    siret: "945 066 207",
    rcs: "RCS Bourg-en-Bresse 945 066 207",
    vatNote: "TVA non applicable, art. 293 B du CGI",
  },

  // fourchette de prix (JSON-LD priceRange) — pack Essentiel à Performance
  priceRange: "1 800 € – 4 500 €",

  serviceArea: [
    "Saint-Genis-Pouilly",
    "Gex",
    "Ferney-Voltaire",
    "Prévessin-Moëns",
    "Thoiry",
    "Pays de Gex",
    "Bassin franco-suisse",
    "Genève",
  ],
} as const;

/**
 * Navigation principale — ancres de la page d'accueil + pages dédiées.
 * `megaMenu: "services"` : l'entrée déploie le mega-menu au survol (desktop).
 */
export type NavItem = {
  label: string;
  href: string;
  megaMenu?: "services";
};

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services", megaMenu: "services" },
  { label: "Réalisations", href: "/#portfolio" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Les quatre piliers de service.
 * `bg` : dégradé placeholder de la carte mega-menu (remplaçable par une vraie
 * photo plus tard). `motif` : clé du décor SVG dessiné dans ServiceCard.
 * `icon` : nom de l'icône Phosphor pour la section Services de l'accueil.
 * `blurb` : phrase plus longue que `summary`, pour la carte éditoriale.
 * `features` : livrables clés listés dans la carte-produit de l'accueil.
 */
export const services = [
  {
    slug: "sites-web",
    title: "Sites web",
    summary: "Vitrine, e-commerce et plateformes sur-mesure.",
    blurb:
      "Vitrines, boutiques en ligne et plateformes sur-mesure, pensées pour convertir.",
    icon: "browser" as const,
    features: [
      "Design sur-mesure, pas de template",
      "SEO local intégré dès la conception",
      "Formation à la prise en main",
    ],
    bg: {
      from: "#0a1830",
      via: "#0e2c50",
      to: "#123a5e",
      accent: "#35a7f0",
    },
    motif: "browser" as const,
  },
  {
    slug: "agents-ia",
    title: "Agents IA",
    summary: "Assistants et automatisation conversationnelle.",
    blurb:
      "Des assistants qui répondent à vos clients et qualifient les demandes à votre place.",
    icon: "chat" as const,
    features: [
      "Entraîné sur vos contenus et vos process",
      "Intégré à votre site ou vos messageries",
      "Reprise humaine à tout moment",
    ],
    bg: {
      from: "#0c1330",
      via: "#171b48",
      to: "#232159",
      accent: "#6a8cff",
    },
    motif: "network" as const,
  },
  {
    slug: "saas-sur-mesure",
    title: "SaaS sur-mesure",
    summary: "Applications métier taillées pour votre activité.",
    blurb:
      "Une application métier taillée pour votre activité, quand rien du marché ne convient.",
    icon: "stack" as const,
    features: [
      "Cadrage des besoins avant la première ligne",
      "Interface pensée pour vos équipes",
      "Hébergement et maintenance assurés",
    ],
    bg: {
      from: "#08201f",
      via: "#0d3236",
      to: "#123f45",
      accent: "#2fd9c8",
    },
    motif: "blocks" as const,
  },
  {
    slug: "automatisation",
    title: "Automatisation",
    summary: "Flux métier et intégrations entre vos outils.",
    blurb:
      "Vos outils reliés entre eux pour supprimer les ressaisies et les tâches répétitives.",
    icon: "flow" as const,
    features: [
      "Devis, facturation et CRM connectés",
      "Zéro double saisie entre vos outils",
      "Alertes et relances déclenchées seules",
    ],
    bg: {
      from: "#0a1226",
      via: "#111f42",
      to: "#182c58",
      accent: "#4d7cff",
    },
    motif: "flow" as const,
  },
] as const;

export type Service = (typeof services)[number];

/**
 * Réalisations clients — aperçu sur l'accueil + base des études de cas.
 * `slug` : segment d'URL de la page dédiée (/portfolio/[slug]).
 * `image` : capture optimisée dans public/portfolio/ (à fournir).
 * `url` : site en ligne du client (lien externe sur la page d'étude de cas).
 * L'ordre du tableau = ordre d'affichage dans la grille.
 *
 * ⚠️ Champs d'étude de cas (`year`, `summary`, `context`, `challenge`,
 * `solution`, `deliverables`, `result`) : contenu PLACEHOLDER à réécrire avec
 * Supa. La structure est figée, seul le texte change.
 */
export const projects = [
  {
    slug: "bushido-gym",
    name: "Bushido Gym",
    sector: "Salle de sport",
    projectType: "Site vitrine",
    area: "Pays de Gex",
    url: "https://bushidogym.fr/",
    image: "/portfolio/bushido-gym.webp",
    year: "2025",
    summary:
      "Un site vitrine qui transforme la curiosité en première séance réservée.",
    context:
      "Bushido Gym est une salle de sport et d'arts martiaux du Pays de Gex. Sa présence en ligne se limitait à une page de réseau social, difficile à trouver et peu rassurante pour un prospect qui hésite à pousser la porte.",
    challenge:
      "Donner une vitrine crédible à la salle, présenter clairement les disciplines et les créneaux, et pousser le visiteur vers une première séance d'essai — sans promettre de délai ni brader l'image.",
    solution:
      "Site vitrine sombre et graphique fidèle à l'univers arts martiaux, hiérarchie claire des disciplines, mise en avant des coachs et des horaires, appels à l'action « Réserver ma séance » présents à chaque section.",
    deliverables: [
      "Design sur-mesure aligné sur l'identité de la salle",
      "Pages disciplines, coachs, horaires et tarifs",
      "Parcours de réservation d'une séance d'essai",
      "Optimisation SEO locale (Pays de Gex)",
    ],
    result:
      "Une vitrine qui inspire confiance avant même la visite, et un chemin direct vers la première séance.",
  },
  {
    slug: "kekosan",
    name: "Kekosan",
    sector: "Restauration japonaise",
    projectType: "Site de commande en ligne",
    area: "Pays de Gex",
    url: "https://www.kekosan.com/",
    image: "/portfolio/kekosan.webp",
    year: "2025",
    summary:
      "Un site de commande en ligne qui met la cuisine du restaurant au premier plan.",
    context:
      "Kekosan est un restaurant de cuisine japonaise du Pays de Gex. La prise de commande passait par le téléphone et des plateformes tierces qui prélèvent une commission sur chaque panier.",
    challenge:
      "Reprendre la main sur la commande en ligne, donner envie avec des visuels qui rendent justice aux plats, et rendre le parcours de commande simple sur mobile.",
    solution:
      "Site de commande en propre, cartes produits photographiques, panier fluide et paiement en ligne, le tout pensé mobile-first pour la commande du soir.",
    deliverables: [
      "Catalogue produits avec photos et options",
      "Panier et paiement en ligne intégrés",
      "Parcours de commande optimisé mobile",
      "Mise en avant des menus et formules",
    ],
    result:
      "Des commandes passées en direct, sans commission d'intermédiaire, et une carte qui donne faim au premier coup d'œil.",
  },
  {
    slug: "gex-energies",
    name: "Gex Énergies",
    sector: "Énergies & chauffage",
    projectType: "Site vitrine",
    area: "Pays de Gex",
    url: "https://gex-energies.fr/",
    image: "/portfolio/gex-energies.webp",
    year: "2025",
    summary:
      "Une vitrine qui installe la crédibilité d'un artisan chauffagiste local.",
    context:
      "Gex Énergies installe et entretient des solutions de chauffage et d'énergies renouvelables dans le Pays de Gex et le nord de la Haute-Savoie.",
    challenge:
      "Rassurer un particulier qui engage plusieurs milliers d'euros de travaux, présenter les prestations (pompe à chaleur, entretien, dépannage) et générer des demandes de devis qualifiées.",
    solution:
      "Site vitrine clair et professionnel, pages prestations détaillées, mise en avant de la zone d'intervention et des certifications, formulaire de contact orienté demande de devis.",
    deliverables: [
      "Pages prestations (installation, entretien, dépannage)",
      "Zone d'intervention et certifications mises en avant",
      "Formulaire de demande de devis",
      "SEO local Pays de Gex / Haute-Savoie",
    ],
    result:
      "Une présence en ligne à la hauteur du sérieux de l'artisan, et un canal de demandes de devis en continu.",
  },
  {
    slug: "au-point-compte",
    name: "Au Point Compte",
    sector: "Broderie personnalisée",
    projectType: "Site e-commerce",
    area: "Suisse",
    url: "https://au-point-compte.ch/",
    image: "/portfolio/au-point-compte.webp",
    year: "2025",
    summary:
      "Une boutique en ligne pour vendre de la broderie personnalisée au-delà du bouche-à-oreille.",
    context:
      "Au Point Compte est un atelier suisse de broderie personnalisée. Les commandes se faisaient sur devis, au cas par cas, sans catalogue en ligne.",
    challenge:
      "Structurer l'offre en produits achetables, gérer la personnalisation (texte, motif, support) dans le parcours d'achat, et vendre à une clientèle suisse habituée à un e-commerce soigné.",
    solution:
      "Site e-commerce avec catalogue par type de produit, options de personnalisation intégrées au tunnel de commande, présentation de l'atelier et du savoir-faire.",
    deliverables: [
      "Catalogue e-commerce avec options de personnalisation",
      "Tunnel de commande et paiement en ligne",
      "Pages atelier et savoir-faire",
      "Design premium adapté au marché suisse",
    ],
    result:
      "Un atelier qui vend en ligne 24h/24, avec un parcours de personnalisation clair et une image à la hauteur de son travail.",
  },
  {
    slug: "mb-patrimoine-finance",
    name: "MB Patrimoine Finance",
    sector: "Gestion de patrimoine",
    projectType: "Site vitrine",
    area: "France",
    url: "https://mb-patrimoine-finance.fr/",
    image: "/portfolio/mb-patrimoine-finance.webp",
    year: "2025",
    summary:
      "Une vitrine sobre qui inspire confiance pour un conseiller en gestion de patrimoine.",
    context:
      "MB Patrimoine Finance accompagne des particuliers et des chefs d'entreprise dans la gestion et l'optimisation de leur patrimoine.",
    challenge:
      "Dans un métier où tout repose sur la confiance, donner une image sérieuse et rassurante, expliquer clairement les domaines d'accompagnement et faciliter la prise de premier rendez-vous.",
    solution:
      "Site vitrine épuré, ton institutionnel maîtrisé, pages domaines d'expertise, présentation du conseiller et de sa méthode, prise de contact directe.",
    deliverables: [
      "Pages domaines d'expertise (placement, prévoyance, transmission)",
      "Présentation du conseiller et de la méthode",
      "Prise de rendez-vous facilitée",
      "Mentions et conformité du secteur",
    ],
    result:
      "Une vitrine qui pose d'emblée le professionnalisme du cabinet et ouvre la conversation avec de nouveaux clients.",
  },
] as const;

export type Project = (typeof projects)[number];

/** Retrouve une réalisation par son slug (études de cas). */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
