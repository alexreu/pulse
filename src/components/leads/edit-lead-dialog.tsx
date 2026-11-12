"use client";

import * as React from "react";
import { PencilLine } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import type { Lead } from "@/features/leads/types";
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

/** Corriger une coordonnée ou réviser le montant, sans quitter la fiche. */
export function EditLeadDialog({ lead }: { lead: Lead }) {
  const { updateLead } = useLeads();
  const [open, setOpen] = React.useState(false);
  const [failure, setFailure] = React.useState<string | null>(null);

  function change(next: boolean) {
    setOpen(next);
    if (!next) setFailure(null);
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PencilLine className="size-4" aria-hidden />
          Modifier
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la fiche</DialogTitle>
          <DialogDescription>
            Coordonnées et montant estimé. L&apos;étape se change depuis la fiche ; chaque
            modification est inscrite à l&apos;historique.
          </DialogDescription>
        </DialogHeader>

        {/* Monté à l'ouverture : le formulaire repart toujours des valeurs à jour de la fiche. */}
        {open ? (
          <LeadForm
            mode="edit"
            submitLabel="Enregistrer"
            pendingLabel="Enregistrement…"
            defaultValues={{
              firstName: lead.firstName,
              lastName: lead.lastName,
              company: lead.company,
              email: lead.email,
              phone: lead.phone ?? "",
              estimatedValue: lead.estimatedValue,
            }}
            onCancel={() => change(false)}
            onSubmit={async (values) => {
              setFailure(null);
              try {
                await updateLead(lead.id, values);
                change(false);
                toast.success("Fiche enregistrée.");
              } catch (error) {
                setFailure(error instanceof Error ? error.message : "La fiche n'a pas pu être enregistrée.");
              }
            }}
            banner={
              failure ? (
                <ErrorState
                  title="La fiche n'a pas été enregistrée."
                  description="Le serveur a refusé l'écriture. Vos saisies sont conservées : renvoyez le formulaire."
                  detail={failure}
                  className="py-6"
                />
              ) : null
            }
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
