"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { LEAD_STATUSES } from "@/features/leads/types";
import { leadEditSchema, leadFormSchema, type LeadFormValues } from "@/features/leads/schemas/lead";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, describedBy } from "./field";

interface LeadFormProps {
  onSubmit: (values: LeadFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  /** Le libellé du bouton pendant l'envoi. */
  pendingLabel?: string;
  /** Message d'échec affiché en tête du formulaire, dans le flux défilant. */
  banner?: React.ReactNode;
  /**
   * `edit` reprend les valeurs d'une fiche et retire l'étape et la note de
   * départ : l'étape a son propre contrôle sur la fiche, les notes leur fil.
   */
  mode?: "create" | "edit";
  defaultValues?: Partial<LeadFormValues>;
}

/**
 * Le montant démarre vide plutôt qu'à 0 : un « 0 » préinscrit oblige
 * l'utilisateur à l'effacer avant de saisir. `valueAsNumber` rend `NaN` sur un
 * champ vide, et c'est le message de type de Zod qui le prend en charge.
 */
const DEFAULTS = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  estimatedValue: undefined,
  status: "new",
  notes: "",
} satisfies Partial<LeadFormValues> as unknown as LeadFormValues;

const CREATE_RESOLVER = zodResolver(leadFormSchema);
/**
 * Les valeurs de modification sont celles de création moins l'étape et la
 * note : le formulaire garde un seul type, le schéma retire les deux champs.
 */
const EDIT_RESOLVER = zodResolver(leadEditSchema) as unknown as Resolver<LeadFormValues>;

export function LeadForm({
  onSubmit,
  onCancel,
  submitLabel = "Créer le prospect",
  pendingLabel = "Création…",
  banner,
  mode = "create",
  defaultValues,
}: LeadFormProps) {
  const isEdit = mode === "edit";
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: isEdit ? EDIT_RESOLVER : CREATE_RESOLVER,
    defaultValues: { ...DEFAULTS, ...defaultValues },
    mode: "onSubmit",
  });

  const status = watch("status");

  /** À la première erreur, le focus part sur le premier champ fautif. */
  function focusFirstError() {
    const order: Array<keyof LeadFormValues> = [
      "firstName",
      "lastName",
      "company",
      "email",
      "phone",
      "estimatedValue",
      "status",
      "notes",
    ];
    const first = order.find((name) => errors[name]);
    if (first) setFocus(first);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, focusFirstError)}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <div className="space-y-5 px-6 py-6">
        {banner}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="firstName" label="Prénom" required error={errors.firstName?.message}>
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={describedBy("firstName", errors.firstName?.message)}
              {...register("firstName")}
            />
          </Field>

          <Field id="lastName" label="Nom" required error={errors.lastName?.message}>
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={describedBy("lastName", errors.lastName?.message)}
              {...register("lastName")}
            />
          </Field>
        </div>

        <Field id="company" label="Entreprise" required error={errors.company?.message}>
          <Input
            id="company"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company", errors.company?.message)}
            {...register("company")}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="email" label="E-mail" required error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nom@entreprise.fr"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy("email", errors.email?.message)}
              {...register("email")}
            />
          </Field>

          <Field
            id="phone"
            label="Téléphone"
            error={errors.phone?.message}
            hint="Format libre, par exemple 06 12 34 56 78."
          >
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy(
                "phone",
                errors.phone?.message,
                "Format libre, par exemple 06 12 34 56 78.",
              )}
              {...register("phone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="estimatedValue"
            label="Montant estimé (€)"
            required
            error={errors.estimatedValue?.message}
          >
            <Input
              id="estimatedValue"
              type="number"
              min={1}
              max={1_000_000}
              step={50}
              inputMode="numeric"
              aria-invalid={Boolean(errors.estimatedValue)}
              aria-describedby={describedBy("estimatedValue", errors.estimatedValue?.message)}
              {...register("estimatedValue", { valueAsNumber: true })}
            />
          </Field>

          {isEdit ? null : (
            <Field id="status" label="Étape" required error={errors.status?.message}>
              <Select
                value={status}
                onValueChange={(next) =>
                  setValue("status", next as LeadFormValues["status"], { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="status"
                  aria-invalid={Boolean(errors.status)}
                  aria-describedby={describedBy("status", errors.status?.message)}
                >
                  <SelectValue placeholder="Choisir une étape" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {STATUS_CONFIG[value].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>

        {isEdit ? null : (
          <Field
            id="notes"
            label="Note de départ"
            error={errors.notes?.message}
            hint="Ce que vous savez déjà : contexte, besoin, échéance."
          >
            <Textarea
              id="notes"
              rows={3}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={describedBy(
                "notes",
                errors.notes?.message,
                "Ce que vous savez déjà : contexte, besoin, échéance.",
              )}
              {...register("notes")}
            />
          </Field>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
