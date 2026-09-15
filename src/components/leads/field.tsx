import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Un champ de formulaire : étiquette liée, aide et erreur rattachées par
 * `aria-describedby` côté contrôle, message d'erreur sous le champ.
 */
export function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">
            (facultatif)
          </span>
        )}
      </Label>

      {children}

      {hint && !error ? (
        <p id={`${id}-hint`} className="text-label text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className="text-label font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Les identifiants d'aide et d'erreur d'un champ, pour `aria-describedby`. */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  const parts = [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
