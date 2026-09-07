"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
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
 * Formulaire de contact — validation à la soumission (schéma Zod partagé avec
 * la route API), erreurs par champ, états idle / submitting / success / error.
 * Champs contrôlés, honeypot caché. Les transitions sont neutralisées par
 * `prefers-reduced-motion` (CSS).
 */
export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactInput>(emptyContactForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const fieldId = (name: keyof ContactInput) => `${uid}-${name}`;
  const errorId = (name: keyof ContactData) => `${uid}-${name}-error`;

  function update<K extends keyof ContactInput>(name: K, value: ContactInput[K]) {
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
      // focus sur le premier champ en erreur
      const firstKey = Object.keys(flat)[0];
      if (firstKey) {
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
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
          "L'envoi a échoué. Réessayez ou écrivez-nous directement par e-mail.",
      );
      setStatus("error");
    } catch {
      setFormError(
        "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.done} role="status">
        <CheckCircle
          size={32}
          weight="fill"
          aria-hidden="true"
          className={styles.doneIcon}
        />
        <p className={styles.doneTitle}>Message envoyé</p>
        <p className={styles.doneText}>
          Merci, votre demande est bien arrivée. Nous revenons vers vous
          rapidement avec une première réponse.
        </p>
        <button
          type="button"
          className={styles.doneReset}
          onClick={() => setStatus("idle")}
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <p className={styles.formTitle}>Décrivez votre projet</p>

      <div className={styles.row}>
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
          <label htmlFor={fieldId("email")} className={styles.label}>
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? errorId("email") : undefined}
            required
          />
          {errors.email && (
            <p id={errorId("email")} className={styles.fieldError}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("phone")} className={styles.label}>
          Téléphone <span className={styles.optional}>(facultatif)</span>
        </label>
        <input
          id={fieldId("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          className={styles.input}
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? errorId("phone") : undefined}
        />
        {errors.phone && (
          <p id={errorId("phone")} className={styles.fieldError}>
            {errors.phone}
          </p>
        )}
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>
          Type de projet <span aria-hidden="true">*</span>
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
                className={styles.choiceInput}
              />
              <span className={styles.choiceLabel}>{type.label}</span>
            </label>
          ))}
        </div>
        {errors.projectType && (
          <p id={errorId("projectType")} className={styles.fieldError}>
            {errors.projectType}
          </p>
        )}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={fieldId("message")} className={styles.label}>
          Votre projet <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          className={styles.textarea}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Votre activité, ce que vous attendez du site ou de l'outil, vos échéances…"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          required
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

      <div className={styles.submit}>
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? "Envoi…" : "Envoyer ma demande"}
        </Button>
        <p className={styles.consent}>
          En envoyant ce formulaire, vous acceptez d&apos;être recontacté au
          sujet de votre demande.
        </p>
      </div>
    </form>
  );
}
