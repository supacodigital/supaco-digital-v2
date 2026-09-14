"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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
 * Les trois temps du formulaire. On demande d'abord le choix le moins coûteux
 * (un clic) : un formulaire qui commence par un champ libre décourage, un
 * formulaire déjà engagé après un clic se termine.
 */
const steps = [
  { id: "type", label: "Projet", fields: ["projectType"] },
  { id: "brief", label: "Besoin", fields: ["message"] },
  { id: "contact", label: "Coordonnées", fields: ["name", "email", "phone"] },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  fields: ReadonlyArray<keyof ContactData>;
}>;

/** Sous-titre affiché sous le pas courant — oriente la saisie. */
const stepHints = [
  "Ce que vous voulez construire.",
  "En quelques phrases, ce que vous avez en tête.",
  "Pour vous répondre avec une proposition chiffrée.",
] as const;

/**
 * Formulaire de contact en trois étapes — validation par étape (schéma Zod
 * partagé avec la route API, seuls les champs de l'étape sont contrôlés), puis
 * validation complète à l'envoi. Les transitions entre étapes sont des springs
 * Framer Motion, directionnelles (avant / arrière) et neutralisées par
 * `prefers-reduced-motion`.
 */
export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const reduceMotion = useReducedMotion();

  const [values, setValues] = useState<ContactInput>(emptyContactForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  // `direction` pilote le sens de l'animation : +1 en avant, -1 en arrière
  const [[step, direction], setStep] = useState<[number, number]>([0, 1]);

  const isLast = step === steps.length - 1;
  const fieldId = (name: keyof ContactInput) => `${uid}-${name}`;
  const errorId = (name: keyof ContactData) => `${uid}-${name}-error`;

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

  /** Focus le premier champ en erreur du DOM courant. */
  function focusFirstError(keys: string[]) {
    const first = keys[0];
    if (!first) return;
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"]`)
      ?.focus();
  }

  /**
   * Valide uniquement les champs de l'étape courante : on parse l'objet complet
   * puis on ne retient que les erreurs qui concernent cette étape — le schéma
   * reste la source de vérité unique, sans schéma partiel à maintenir.
   */
  function validateStep(index: number, data: ContactInput = values): boolean {
    const parsed = contactSchema.safeParse(data);
    if (parsed.success) return true;

    const all = flattenContactErrors(parsed.error);
    const scoped: FieldErrors = {};
    for (const field of steps[index].fields) {
      if (all[field]) scoped[field] = all[field];
    }

    if (Object.keys(scoped).length === 0) return true;
    setErrors(scoped);
    focusFirstError(Object.keys(scoped));
    return false;
  }

  function goNext(data: ContactInput = values) {
    if (!validateStep(step, data)) return;
    setErrors({});
    setFormError(null);
    setStep(([current]) => [Math.min(current + 1, steps.length - 1), 1]);
  }

  function goBack() {
    setErrors({});
    setFormError(null);
    setStep(([current]) => [Math.max(current - 1, 0), -1]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    // Entrée sur une étape intermédiaire = avancer, pas envoyer
    if (!isLast) {
      goNext();
      return;
    }

    setFormError(null);
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const flat = flattenContactErrors(parsed.error);
      setErrors(flat);
      setStatus("error");
      // une erreur peut concerner une étape précédente : on y retourne
      const firstKey = Object.keys(flat)[0] as keyof ContactData | undefined;
      const owner = steps.findIndex((s) =>
        firstKey ? (s.fields as readonly string[]).includes(firstKey) : false,
      );
      if (owner >= 0 && owner !== step) {
        setStep([owner, -1]);
        return;
      }
      focusFirstError(Object.keys(flat));
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

  function restart() {
    setStatus("idle");
    setStep([0, -1]);
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
        <p className={styles.doneTitle}>Message envoyé</p>
        <p className={styles.doneText}>
          Merci, votre demande est bien arrivée. Nous revenons vers vous
          rapidement avec une première réponse.
        </p>
        <button type="button" className={styles.doneReset} onClick={restart}>
          Envoyer une autre demande
        </button>
      </motion.div>
    );
  }

  // décalage horizontal des étapes — annulé en mouvement réduit (fondu seul)
  const shift = reduceMotion ? 0 : 34;

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* --- En-tête : progression --- */}
      <div className={styles.progress}>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={styles.stepChip}
              data-state={i === step ? "current" : i < step ? "done" : "todo"}
              aria-current={i === step ? "step" : undefined}
            >
              <span className={styles.stepIndex} aria-hidden="true">
                {i < step ? <CheckCircle size={13} weight="fill" /> : i + 1}
              </span>
              <span className={styles.stepLabel}>{s.label}</span>
            </li>
          ))}
        </ol>
        <div className={styles.bar}>
          <motion.span
            className={styles.barFill}
            initial={false}
            animate={{ scaleX: (step + 1) / steps.length }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.5, bounce: 0.15 }
            }
          />
        </div>
        <p className={styles.hint}>{stepHints[step]}</p>
      </div>

      {/* --- Corps : une étape à la fois ---
          `mode="popLayout"` sort l'élément quittant du flux : les deux étapes
          ne se poussent pas l'une l'autre pendant le croisement. */}
      <div className={styles.stage}>
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={steps[step].id}
            className={styles.panel}
            custom={direction}
            initial={{ opacity: 0, x: direction * shift }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -shift }}
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { type: "spring", duration: 0.42, bounce: 0 }
            }
          >
            {step === 0 && (
              <fieldset className={styles.field}>
                <legend className={styles.srOnly}>Type de projet</legend>
                <div className={styles.choices}>
                  {projectTypes.map((type) => (
                    <label key={type.value} className={styles.choice}>
                      <input
                        type="radio"
                        name="projectType"
                        value={type.value}
                        checked={values.projectType === type.value}
                        onChange={() => {
                          update("projectType", type.value);
                          // sélectionner un service avance directement à l'étape suivante
                          goNext({ ...values, projectType: type.value });
                        }}
                        className={styles.choiceInput}
                      />
                      <span className={styles.choiceBody}>
                        <span className={styles.choiceLabel}>{type.label}</span>
                        <span className={styles.choiceCheck} aria-hidden="true">
                          <CheckCircle size={17} weight="fill" />
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.projectType && (
                  <p id={errorId("projectType")} className={styles.fieldError}>
                    {errors.projectType}
                  </p>
                )}
              </fieldset>
            )}

            {step === 1 && (
              <div className={styles.field}>
                <label htmlFor={fieldId("message")} className={styles.label}>
                  Votre projet <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id={fieldId("message")}
                  name="message"
                  rows={7}
                  className={styles.textarea}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Votre activité, ce que vous attendez du site ou de l'outil, vos échéances…"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={
                    errors.message ? errorId("message") : undefined
                  }
                  required
                />
                {errors.message && (
                  <p id={errorId("message")} className={styles.fieldError}>
                    {errors.message}
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className={styles.group}>
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
                      aria-describedby={
                        errors.name ? errorId("name") : undefined
                      }
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
                      aria-describedby={
                        errors.email ? errorId("email") : undefined
                      }
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
                    Téléphone{" "}
                    <span className={styles.optional}>(facultatif)</span>
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
                    aria-describedby={
                      errors.phone ? errorId("phone") : undefined
                    }
                  />
                  {errors.phone && (
                    <p id={errorId("phone")} className={styles.fieldError}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <p className={styles.consent}>
                  En envoyant ce formulaire, vous acceptez d&apos;être
                  recontacté au sujet de votre demande.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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

      {/* --- Pied : navigation --- */}
      <div className={styles.actions}>
        {step > 0 ? (
          <button type="button" className={styles.back} onClick={goBack}>
            <ArrowLeft size={15} weight="bold" aria-hidden="true" />
            Retour
          </button>
        ) : (
          <span className={styles.stepCount} aria-hidden="true">
            Étape {step + 1} / {steps.length}
          </span>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          <span className={styles.cta}>
            {isLast
              ? status === "submitting"
                ? "Envoi…"
                : "Envoyer ma demande"
              : "Continuer"}
            {isLast ? (
              <PaperPlaneTilt size={15} weight="fill" aria-hidden="true" />
            ) : (
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            )}
          </span>
        </Button>
      </div>
    </form>
  );
}
