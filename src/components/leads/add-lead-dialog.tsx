"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import type { LeadFormValues } from "@/features/leads/schemas/lead";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/common/error-state";
import { LeadForm } from "./lead-form";

interface AddLeadDialogProps {
  trigger?: React.ReactNode;
}

/**
 * La création d'un prospect. Radix rend le focus au déclencheur à la fermeture
 * et le piège dans la boîte tant qu'elle est ouverte.
 */
export function AddLeadDialog({ trigger }: AddLeadDialogProps) {
  const { createLead } = useLeads();
  const [open, setOpen] = React.useState(false);
  const [failure, setFailure] = React.useState<string | null>(null);

  async function submit(values: LeadFormValues) {
    setFailure(null);
    try {
      const lead = await createLead(values);
      setOpen(false);
      toast.success("Prospect créé.", {
        description: `${lead.firstName} ${lead.lastName} — ${lead.company}`,
      });
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "Le prospect n'a pas pu être enregistré.",
      );
    }
  }

  function change(next: boolean) {
    setOpen(next);
    if (!next) setFailure(null);
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default">
            <Plus className="size-4" aria-hidden />
            Ajouter un prospect
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau prospect</DialogTitle>
          <DialogDescription>
            Les champs marqués d&apos;une astérisque sont obligatoires. La fiche rejoint
            immédiatement le tableau et le pipeline.
          </DialogDescription>
        </DialogHeader>

        <LeadForm
          onSubmit={submit}
          onCancel={() => change(false)}
          banner={
            failure ? (
              <ErrorState
                title="Le prospect n'a pas été enregistré."
                description="Le serveur a refusé l'écriture. Vérifiez les informations puis renvoyez le formulaire."
                detail={failure}
                className="py-6"
              />
            ) : null
          }
        />
      </DialogContent>
    </Dialog>
  );
}
