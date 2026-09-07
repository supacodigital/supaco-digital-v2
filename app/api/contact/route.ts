/**
 * Route API — réception des demandes de contact du site.
 * POST /api/contact  → valide (Zod, source de vérité) puis délègue l'envoi
 * e-mail à `lib/email`. Réponses : 200 `{ ok: true }`, 422
 * `{ ok: false, errors }`, 400 corps illisible, 502 échec d'envoi.
 */
import { NextResponse } from "next/server";
import { contactSchema, flattenContactErrors } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";

// pas de cache : endpoint purement dynamique
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: flattenContactErrors(parsed.error) },
      { status: 422 },
    );
  }

  // honeypot rempli → on répond 200 sans rien envoyer (on ne renseigne pas le bot)
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "L'envoi a échoué. Réessayez ou contactez-nous directement par e-mail.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
