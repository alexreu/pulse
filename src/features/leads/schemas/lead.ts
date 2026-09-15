import { z } from "zod";
import { LEAD_STATUSES } from "../types";

/**
 * Règles de saisie d'un prospect. Les messages sont ceux que l'utilisateur
 * lit sous le champ : ils nomment le problème et ce qu'il faut faire.
 */
export const leadFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Le prénom est obligatoire.")
    .max(60, "Le prénom ne doit pas dépasser 60 caractères."),
  lastName: z
    .string()
    .trim()
    .min(1, "Le nom est obligatoire.")
    .max(60, "Le nom ne doit pas dépasser 60 caractères."),
  company: z
    .string()
    .trim()
    .min(1, "L'entreprise est obligatoire.")
    .max(80, "Le nom d'entreprise ne doit pas dépasser 80 caractères."),
  email: z
    .string()
    .trim()
    .min(1, "L'e-mail est obligatoire.")
    .email("Saisissez une adresse e-mail valide, par exemple nom@entreprise.fr."),
  phone: z
    .string()
    .trim()
    .max(20, "Le téléphone ne doit pas dépasser 20 caractères.")
    .optional()
    .or(z.literal("")),
  estimatedValue: z
    .number({ invalid_type_error: "Saisissez un montant en euros." })
    .positive("Le montant estimé doit être supérieur à 0 €.")
    .max(1_000_000, "Le montant estimé ne peut pas dépasser 1 000 000 €."),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: "Choisissez une étape du pipeline." }),
  }),
  notes: z
    .string()
    .trim()
    .max(1000, "La note ne doit pas dépasser 1000 caractères.")
    .optional()
    .or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const statusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export const noteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Écrivez une note avant de l'enregistrer.")
    .max(1000, "La note ne doit pas dépasser 1000 caractères."),
});

export type NoteValues = z.infer<typeof noteSchema>;

export const bulkActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("status"),
    ids: z.array(z.string()).min(1),
    status: z.enum(LEAD_STATUSES),
  }),
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string()).min(1),
  }),
]);
