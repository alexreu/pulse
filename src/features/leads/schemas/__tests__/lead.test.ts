import { describe, expect, it } from "vitest";
import { bulkActionSchema, leadFormSchema, noteSchema } from "../lead";

const VALID = {
  firstName: "Emma",
  lastName: "Laurent",
  company: "Studio Bloom",
  email: "emma.laurent@studio-bloom.fr",
  phone: "06 12 44 87 90",
  estimatedValue: 4500,
  status: "qualified" as const,
  notes: "Refonte du site vitrine.",
};

/** Le premier message d'erreur d'un champ, tel que l'utilisateur le lit. */
function errorFor(values: unknown, field: string): string | undefined {
  const result = leadFormSchema.safeParse(values);
  if (result.success) return undefined;
  return result.error.flatten().fieldErrors[
    field as keyof ReturnType<typeof result.error.flatten>["fieldErrors"]
  ]?.[0];
}

describe("leadFormSchema", () => {
  it("accepte une fiche complète", () => {
    expect(leadFormSchema.safeParse(VALID).success).toBe(true);
  });

  it("rejette un e-mail invalide", () => {
    expect(leadFormSchema.safeParse({ ...VALID, email: "emma.laurent" }).success).toBe(false);
    expect(errorFor({ ...VALID, email: "emma.laurent" }, "email")).toBe(
      "Saisissez une adresse e-mail valide, par exemple nom@entreprise.fr.",
    );
  });

  it("rejette un e-mail vide avec son propre message", () => {
    expect(errorFor({ ...VALID, email: "" }, "email")).toBe("L'e-mail est obligatoire.");
  });

  it("exige le prénom", () => {
    expect(errorFor({ ...VALID, firstName: "   " }, "firstName")).toBe(
      "Le prénom est obligatoire.",
    );
  });

  it("exige le nom", () => {
    expect(errorFor({ ...VALID, lastName: "" }, "lastName")).toBe("Le nom est obligatoire.");
  });

  it("exige l'entreprise", () => {
    expect(errorFor({ ...VALID, company: "" }, "company")).toBe("L'entreprise est obligatoire.");
  });

  it("rejette un montant nul ou négatif", () => {
    expect(errorFor({ ...VALID, estimatedValue: 0 }, "estimatedValue")).toBe(
      "Le montant estimé doit être supérieur à 0 €.",
    );
    expect(errorFor({ ...VALID, estimatedValue: -100 }, "estimatedValue")).toBe(
      "Le montant estimé doit être supérieur à 0 €.",
    );
  });

  it("rejette un montant non numérique", () => {
    expect(leadFormSchema.safeParse({ ...VALID, estimatedValue: "beaucoup" }).success).toBe(false);
  });

  it("rejette un statut hors du vocabulaire", () => {
    expect(leadFormSchema.safeParse({ ...VALID, status: "archived" }).success).toBe(false);
  });

  it("accepte un téléphone et des notes absents", () => {
    const result = leadFormSchema.safeParse({ ...VALID, phone: "", notes: "" });
    expect(result.success).toBe(true);
  });

  it("nettoie les espaces autour des valeurs", () => {
    const result = leadFormSchema.safeParse({ ...VALID, firstName: "  Emma  " });
    expect(result.success && result.data.firstName).toBe("Emma");
  });
});

describe("noteSchema", () => {
  it("refuse une note vide", () => {
    const result = noteSchema.safeParse({ body: "   " });
    expect(result.success).toBe(false);
    expect(result.success === false && result.error.issues[0].message).toBe(
      "Écrivez une note avant de l'enregistrer.",
    );
  });

  it("accepte une note renseignée", () => {
    expect(noteSchema.safeParse({ body: "Appel découverte terminé." }).success).toBe(true);
  });
});

describe("bulkActionSchema", () => {
  it("accepte un changement d'étape sur une sélection non vide", () => {
    expect(
      bulkActionSchema.safeParse({ action: "status", ids: ["LD-1001"], status: "won" }).success,
    ).toBe(true);
  });

  it("refuse une sélection vide", () => {
    expect(bulkActionSchema.safeParse({ action: "delete", ids: [] }).success).toBe(false);
  });
});
