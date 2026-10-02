"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle,
  PaperPlaneTilt,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import {
  contactSchema,
  emptyContactForm,
  flattenContactErrors,
  projectTypes,
  type ContactData,
  type ContactInput,
} from "@/lib/contact";
import styles from "./ContactForm.module.css";

type FieldErrors = Partial<Record<keyof ContactData, string>>;
type Status = "idle" | "submitting" | "success" | "error";

/**
 * Formulaire de contact en une étape — tout est visible d'emblée, le prospect
 * sait ce qu'on lui demande avant de commencer. Deux champs obligatoires
 * seulement : le nom et UN moyen de contact (téléphone ou e-mail, au choix).
 * Type de projet et message sont facultatifs. Validation par le schéma Zod
 * partagé avec la route API.
 */
export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const reduceMotion = useReducedMotion();

  const [values, setValues] = useState<ContactInput>(emptyContactForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const fieldId = (name: keyof ContactInput) => `${uid}-${name}`;
  const errorId = (name: keyof ContactData) => `${uid}-${name}-error`;
  const contactHintId = `${uid}-contact-hint`;

  function update<K extends keyof ContactInput>(
    name: K,
    value: ContactInput[K],
  ) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // on efface l'erreur du champ dès que l'utilisateur le corrige
    if (errors[name as keyof ContactData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactData];
        return next;
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError(null);
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const flat = flattenContactErrors(parsed.error);
      setErrors(flat);
      setStatus("error");
      const first = Object.keys(flat)[0];
      if (first) {
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${first}"]`)
          ?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        setStatus("success");
        setValues(emptyContactForm);
        return;
      }

      const data = (await res.json().catch(() => null)) as
        | { errors?: FieldErrors; error?: string }
        | null;
      if (data?.errors) setErrors(data.errors);
      setFormError(
        data?.error ??
          "L'envoi a échoué. Réessayez ou appelez-nous directement.",
      );
      setStatus("error");
    } catch {
      setFormError(
        "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      );
      setStatus("error");
    }
  }

  // --- Écran de succès ---
  if (status === "success") {
    return (
      <motion.div
        className={styles.done}
        role="status"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      >
        <span className={styles.doneIcon} aria-hidden="true">
          <CheckCircle size={30} weight="fill" />
        </span>
        <p className={styles.doneTitle}>Demande envoyée</p>
        <p className={styles.doneText}>
          Merci, votre demande est bien arrivée. Nous revenons vers vous
          rapidement, par le moyen de contact que vous avez indiqué.
        </p>
        <button
          type="button"
          className={styles.doneReset}
          onClick={() => setStatus("idle")}
        >
          Envoyer une autre demande
        </button>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* type de projet : facultatif, un second clic désélectionne */}
      <fieldset className={styles.field}>
        <legend className={styles.label}>
          Votre projet <span className={styles.optional}>(facultatif)</span>
        </legend>
        <div className={styles.choices}>
          {projectTypes.map((type) => (
            <label key={type.value} className={styles.choice}>
              <input
                type="radio"
                name="projectType"
                value={type.value}
                checked={values.projectType === type.value}
                onChange={() => update("projectType", type.value)}
                onClick={() => {
                  if (values.projectType === type.value) {
                    update("projectType", undefined);
                  }
                }}
                className={styles.choiceInput}
              />
              <span className={styles.choiceBody}>{type.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={fieldId("name")} className={styles.label}>
          Nom <span aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          className={styles.input}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? errorId("name") : undefined}
          required
        />
        {errors.name && (
          <p id={errorId("name")} className={styles.fieldError}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("contact")} className={styles.label}>
          Téléphone ou e-mail <span aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId("contact")}
          name="contact"
          type="text"
          className={styles.input}
          value={values.contact}
          onChange={(e) => update("contact", e.target.value)}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={
            errors.contact
              ? `${contactHintId} ${errorId("contact")}`
              : contactHintId
          }
          required
        />
        <p id={contactHintId} className={styles.hint}>
          Celui que vous préférez : on vous répond par ce moyen.
        </p>
        {errors.contact && (
          <p id={errorId("contact")} className={styles.fieldError}>
            {errors.contact}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("message")} className={styles.label}>
          Message <span className={styles.optional}>(facultatif)</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          className={styles.textarea}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Votre activité, ce dont vous avez besoin…"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
        />
        {errors.message && (
          <p id={errorId("message")} className={styles.fieldError}>
            {errors.message}
          </p>
        )}
      </div>

      {/* honeypot anti-bot : hors flux visuel et hors tab, mais pas display:none */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={fieldId("company")}>Ne pas remplir</label>
        <input
          id={fieldId("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      {formError && (
        <p className={styles.formError} role="alert">
          <WarningCircle size={17} weight="fill" aria-hidden="true" />
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
      >
        <span className={styles.cta}>
          {status === "submitting" ? "Envoi…" : "Envoyer ma demande"}
          <PaperPlaneTilt size={15} weight="fill" aria-hidden="true" />
        </span>
      </Button>

      <p className={styles.consent}>
        En envoyant ce formulaire, vous acceptez d&apos;être recontacté au sujet
        de votre demande.
      </p>
    </form>
  );
}
