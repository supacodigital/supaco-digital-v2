/**
 * Schéma de la demande de contact — partagé entre le formulaire client
 * (validation à la soumission) et la route API (validation serveur, source
 * de vérité). Zod 4.
 */
import { z } from "zod";

/** Les trois familles de projet proposées dans le formulaire. */
export const projectTypes = [
  { value: "site", label: "Site web" },
  { value: "saas", label: "SaaS sur-mesure" },
  { value: "automatisation", label: "Automatisation / IA" },
] as const;

export type ProjectType = (typeof projectTypes)[number]["value"];

const projectTypeValues = projectTypes.map((t) => t.value) as [
  ProjectType,
  ...ProjectType[],
];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(80, "Nom trop long."),
  email: z
    .string()
    .trim()
    .min(1, "Indiquez votre e-mail.")
    .email("Adresse e-mail invalide."),
  // optionnel : chaîne vide autorisée, sinon format téléphone souple
  phone: z
    .string()
    .trim()
    .max(30, "Numéro trop long.")
    .refine(
      (v) => v === "" || /^[+()\d\s.-]{6,}$/.test(v),
      "Numéro de téléphone invalide.",
    )
    .optional()
    .default(""),
  projectType: z.enum(projectTypeValues, {
    message: "Choisissez un type de projet.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez votre projet en quelques mots (10 caractères min.).")
    .max(4000, "Message trop long (4000 caractères max.)."),
  // anti-bot : champ caché (honeypot). On accepte n'importe quelle valeur au
  // niveau du schéma ; c'est la route API qui, s'il est rempli, répond 200
  // sans rien envoyer (on ne renseigne pas le bot sur la raison du rejet).
  company: z.string().max(200).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Valeurs initiales du formulaire côté client. */
export const emptyContactForm: ContactInput = {
  name: "",
  email: "",
  phone: "",
  projectType: "site",
  message: "",
  company: "",
};

/**
 * Aplati les erreurs Zod en `{ champ: message }` (premier message par champ) —
 * format consommé aussi bien par le client que renvoyé par la route API.
 */
export function flattenContactErrors(
  error: z.ZodError<ContactData>,
): Partial<Record<keyof ContactData, string>> {
  const out: Partial<Record<keyof ContactData, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactData | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
