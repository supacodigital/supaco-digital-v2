/**
 * Schéma de la demande de contact — partagé entre le formulaire client
 * (validation à la soumission) et la route API (validation serveur, source
 * de vérité). Zod 4.
 */
import { z } from "zod";

/** Les types de projet proposés (facultatifs) dans le formulaire. */
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

const emailFormat = z.email();

/** Le moyen de contact saisi est-il une adresse e-mail (sinon : un téléphone) ? */
export function isEmailContact(value: string): boolean {
  return emailFormat.safeParse(value).success;
}

/** Format téléphone souple (FR / CH / international) : au moins 8 chiffres. */
function isPhoneContact(value: string): boolean {
  return /^[+()\d\s.-]+$/.test(value) && value.replace(/\D/g, "").length >= 8;
}

/**
 * Formulaire en une étape, réduit au minimum pour le prospect : nom + un seul
 * moyen de contact (téléphone OU e-mail, au choix). Type de projet et message
 * sont facultatifs.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(80, "Nom trop long."),
  contact: z
    .string()
    .trim()
    .min(1, "Indiquez un téléphone ou un e-mail.")
    .max(120, "Coordonnée trop longue.")
    .refine(
      (v) => isEmailContact(v) || isPhoneContact(v),
      "Entrez un numéro de téléphone ou une adresse e-mail valide.",
    ),
  projectType: z.enum(projectTypeValues).optional(),
  message: z
    .string()
    .trim()
    .max(4000, "Message trop long (4000 caractères max.).")
    .optional()
    .default(""),
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
  contact: "",
  projectType: undefined,
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
