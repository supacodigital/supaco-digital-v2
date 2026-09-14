/**
 * Envoi des e-mails transactionnels du site (fournisseur : Resend).
 *
 * Deux messages par demande :
 *  1. la notification à l'agence (avec `replyTo` sur l'adresse du prospect,
 *     pour pouvoir répondre directement depuis sa boîte) ;
 *  2. un accusé de réception au prospect — son échec ne fait jamais échouer
 *     la demande, l'essentiel étant que l'agence ait reçu le message.
 *
 * Config (variables d'environnement, jamais en dur) :
 *  - RESEND_API_KEY   : clé API Resend (obligatoire en production)
 *  - CONTACT_EMAIL_TO : destinataire des notifications (défaut : contact du site)
 *  - CONTACT_EMAIL_FROM : expéditeur, sur un domaine vérifié chez Resend
 */
import { Resend } from "resend";
import type { ContactData } from "./contact";
import { projectTypes } from "./contact";
import { site } from "./site";

type SendResult = { ok: true } | { ok: false; reason: string };

const isProd = process.env.NODE_ENV === "production";

// destinataire des notifications (par défaut : la boîte contact du site)
const RECIPIENT = process.env.CONTACT_EMAIL_TO ?? site.contact.email;

// expéditeur : doit appartenir à un domaine vérifié dans Resend
const SENDER =
  process.env.CONTACT_EMAIL_FROM ?? `${site.name} <contact@${site.domain}>`;

/** Libellé lisible du type de projet pour le corps de l'e-mail. */
function projectTypeLabel(value: ContactData["projectType"]): string {
  return projectTypes.find((t) => t.value === value)?.label ?? value;
}

/** Échappe le HTML : le contenu vient d'un formulaire public. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Corps de l'e-mail de notification envoyé à l'agence. */
export function buildContactEmail(data: ContactData): {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
} {
  const type = projectTypeLabel(data.projectType);
  const lines = [
    `Nouvelle demande de contact — ${site.name}`,
    "",
    `Nom            : ${data.name}`,
    `E-mail         : ${data.email}`,
    `Téléphone      : ${data.phone || "—"}`,
    `Type de projet : ${type}`,
    "",
    "Message :",
    data.message,
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#0b1020">
      <h2 style="margin:0 0 16px;font-size:18px">Nouvelle demande de contact</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#64738f">Nom</td><td><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64738f">E-mail</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64738f">Téléphone</td><td>${data.phone ? escapeHtml(data.phone) : "—"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64738f">Projet</td><td>${escapeHtml(type)}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#64738f">Message</p>
      <div style="padding:14px 16px;background:#f6f8fc;border-radius:10px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
    </div>
  `.trim();

  return {
    subject: `Contact site — ${type} — ${data.name}`,
    text: lines.join("\n"),
    html,
    replyTo: data.email,
  };
}

/** Accusé de réception envoyé au prospect. */
function buildAcknowledgement(data: ContactData): {
  subject: string;
  text: string;
  html: string;
} {
  const firstName = data.name.split(" ")[0];
  const text = [
    `Bonjour ${firstName},`,
    "",
    "Merci pour votre demande — elle nous est bien parvenue.",
    "Nous revenons vers vous rapidement avec une première réponse.",
    "",
    "Pour rappel, voici votre message :",
    data.message,
    "",
    "À bientôt,",
    site.founder,
    site.name,
    site.contact.phone,
    site.url,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#0b1020">
      <p>Bonjour ${escapeHtml(firstName)},</p>
      <p>Merci pour votre demande — elle nous est bien parvenue.<br>
         Nous revenons vers vous rapidement avec une première réponse.</p>
      <p style="margin:20px 0 6px;color:#64738f">Pour rappel, votre message</p>
      <div style="padding:14px 16px;background:#f6f8fc;border-radius:10px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      <p style="margin-top:24px">À bientôt,<br>
        <strong>${escapeHtml(site.founder)}</strong> — ${escapeHtml(site.name)}<br>
        <a href="tel:${site.contact.phoneHref}">${escapeHtml(site.contact.phone)}</a> ·
        <a href="${site.url}">${escapeHtml(site.domain)}</a>
      </p>
    </div>
  `.trim();

  return {
    subject: `Votre demande est bien arrivée — ${site.name}`,
    text,
    html,
  };
}

async function deliver(data: ContactData): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "missing-resend-api-key" };

  const resend = new Resend(apiKey);
  const email = buildContactEmail(data);

  const { error } = await resend.emails.send({
    from: SENDER,
    to: [RECIPIENT],
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  if (error) {
    console.error("[contact] échec envoi notification", error);
    return { ok: false, reason: error.message ?? "resend-error" };
  }

  // Accusé de réception : best-effort. Un échec ici ne doit pas faire croire
  // au visiteur que sa demande n'est pas passée — elle l'est.
  const ack = buildAcknowledgement(data);
  const { error: ackError } = await resend.emails.send({
    from: SENDER,
    to: [data.email],
    replyTo: RECIPIENT,
    subject: ack.subject,
    text: ack.text,
    html: ack.html,
  });
  if (ackError) {
    console.warn("[contact] accusé de réception non envoyé", ackError);
  }

  return { ok: true };
}

export async function sendContactEmail(data: ContactData): Promise<SendResult> {
  const result = await deliver(data);
  if (result.ok) return result;

  // en dev on laisse passer (le formulaire reste testable de bout en bout),
  // en prod on remonte l'échec pour ne pas mentir à l'utilisateur.
  if (!isProd) {
    console.info("[contact] demande reçue (dev)", {
      to: RECIPIENT,
      from: data.email,
      projectType: data.projectType,
      raison: result.reason,
    });
    console.warn("[contact] envoi réel indisponible — succès simulé (dev).");
    return { ok: true };
  }
  return result;
}
