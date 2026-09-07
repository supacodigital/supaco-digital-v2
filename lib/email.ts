/**
 * Envoi des e-mails transactionnels du site.
 *
 * ⚠️ L'envoi réel n'est pas encore branché : la brique (Resend, SMTP via
 * Nodemailer, …) reste à décider. En attendant, `sendContactEmail` journalise
 * la demande et se comporte comme un succès en développement, comme un échec
 * en production (pour ne pas faire croire à l'utilisateur que le message est
 * parti alors que rien n'est configuré).
 *
 * Pour brancher l'envoi : implémenter le corps de `deliver()` ci-dessous avec
 * le fournisseur retenu, en lisant la config depuis les variables
 * d'environnement (jamais en dur).
 */
import type { ContactData } from "./contact";
import { projectTypes } from "./contact";
import { site } from "./site";

type SendResult = { ok: true } | { ok: false; reason: string };

const isProd = process.env.NODE_ENV === "production";

/** Libellé lisible du type de projet pour le corps de l'e-mail. */
function projectTypeLabel(value: ContactData["projectType"]): string {
  return projectTypes.find((t) => t.value === value)?.label ?? value;
}

/** Corps texte de l'e-mail de notification envoyé à l'agence. */
export function buildContactEmail(data: ContactData): {
  subject: string;
  text: string;
  replyTo: string;
} {
  const lines = [
    `Nouvelle demande de contact — ${site.name}`,
    "",
    `Nom          : ${data.name}`,
    `E-mail       : ${data.email}`,
    `Téléphone    : ${data.phone || "—"}`,
    `Type de projet : ${projectTypeLabel(data.projectType)}`,
    "",
    "Message :",
    data.message,
  ];
  return {
    subject: `Contact site — ${projectTypeLabel(data.projectType)} — ${data.name}`,
    text: lines.join("\n"),
    replyTo: data.email,
  };
}

// destinataire des notifications (par défaut : la boîte contact du site)
const RECIPIENT = process.env.CONTACT_EMAIL_TO ?? site.contact.email;

/**
 * Point d'intégration du fournisseur d'envoi. À implémenter.
 * Doit renvoyer `{ ok: true }` en cas de succès, `{ ok: false, reason }` sinon.
 */
async function deliver(
  email: ReturnType<typeof buildContactEmail>,
): Promise<SendResult> {
  // TODO(supa) : brancher Resend ou Nodemailer/SMTP ici, en envoyant `email`
  // (subject / text / replyTo) vers RECIPIENT.
  void email;
  void RECIPIENT;
  return { ok: false, reason: "email-provider-not-configured" };
}

export async function sendContactEmail(data: ContactData): Promise<SendResult> {
  const email = buildContactEmail(data);

  // trace serveur — utile tant que l'envoi n'est pas branché
  console.info("[contact] demande reçue", {
    name: data.name,
    email: data.email,
    projectType: data.projectType,
    hasPhone: Boolean(data.phone),
    to: RECIPIENT,
  });

  const result = await deliver(email);
  if (result.ok) return result;

  // en dev on laisse passer (le formulaire reste testable de bout en bout),
  // en prod on remonte l'échec pour ne pas mentir à l'utilisateur.
  if (!isProd) {
    console.warn(
      "[contact] envoi e-mail non configuré — succès simulé (dev).",
    );
    return { ok: true };
  }
  return result;
}
