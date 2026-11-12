"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Clock,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import { LEAD_STATUSES, type Activity, type Lead, type LeadStatus } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { formatCurrency, formatDate, formatDateTime, formatFullName } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/empty-state";
import { EditLeadDialog } from "./edit-lead-dialog";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadTimeline } from "./lead-timeline";
import { LeadsBackLink } from "./leads-back-link";

interface LeadDetailProps {
  lead: Lead;
  initialActivities: Activity[];
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // Le groupe dt/dd est l'enfant direct de la liste : l'icône vit dans le dt,
    // la valeur s'aligne sous le libellé (16 px d'icône + 12 px d'écart).
    <div className="px-4 py-3">
      <dt className="ui-label flex items-center gap-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {label}
      </dt>
      <dd className="mt-0.5 min-w-0 break-words pl-7 text-body text-foreground">{children}</dd>
    </div>
  );
}

export function LeadDetail({ lead: initialLead, initialActivities }: LeadDetailProps) {
  const router = useRouter();
  const { leads, changeStatus, addNote, removeMany, restoreDeleted } = useLeads();
  const lead = leads.find((entry) => entry.id === initialLead.id) ?? initialLead;

  const [activities, setActivities] = React.useState(initialActivities);
  // Chaque écriture rafraîchit la page serveur : l'historique qu'elle renvoie
  // fait foi et remplace les ajouts locaux, comparé pendant le rendu.
  const [seenActivities, setSeenActivities] = React.useState(initialActivities);
  if (seenActivities !== initialActivities) {
    setSeenActivities(initialActivities);
    setActivities(initialActivities);
  }
  const [deleting, setDeleting] = React.useState(false);
  const [statusPending, setStatusPending] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteError, setNoteError] = React.useState<string | null>(null);
  const [notePending, setNotePending] = React.useState(false);

  async function applyStatus(next: string) {
    const status = next as LeadStatus;
    if (status === lead.status) return;

    const previous = lead.status;
    setStatusPending(true);
    try {
      const updated = await changeStatus(lead.id, status);
      setActivities((current) => [
        {
          id: `${lead.id}-AS-${updated.lastContactAt ?? Date.now()}`,
          leadId: lead.id,
          leadName: formatFullName(lead.firstName, lead.lastName),
          company: lead.company,
          type: "status_changed",
          createdAt: updated.lastContactAt ?? new Date().toISOString(),
          fromStatus: previous,
          toStatus: status,
          summary: `Statut passé de « ${STATUS_CONFIG[previous].label} » à « ${STATUS_CONFIG[status].label} ».`,
        },
        ...current,
      ]);
      const undo = {
        label: "Annuler",
        onClick: () => void applyStatus(previous),
      };
      if (status === "won") {
        // Le seul moment de joie d'un CRM ne ressemble pas à un changement d'étape ordinaire.
        toast.success(`Affaire signée : ${formatCurrency(updated.estimatedValue)} au chiffre d'affaires.`, {
          description: `${formatFullName(lead.firstName, lead.lastName)} rejoint vos clients.`,
          action: { label: "Voir les clients", onClick: () => router.push("/clients") },
          cancel: undo,
          duration: 8000,
        });
      } else {
        toast.success(`Étape mise à jour : ${STATUS_CONFIG[status].label}.`, {
          action: undo,
          duration: 6000,
        });
      }
    } catch (error) {
      toast.error("L'étape n'a pas pu être modifiée.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setStatusPending(false);
    }
  }

  async function submitNote(event: React.FormEvent) {
    event.preventDefault();
    const body = note.trim();

    if (body.length === 0) {
      setNoteError("Écrivez une note avant de l'enregistrer.");
      return;
    }

    setNoteError(null);
    setNotePending(true);
    try {
      const updated = await addNote(lead.id, body);
      const created = updated.notes[updated.notes.length - 1];
      setActivities((current) => [
        {
          id: `${created.id}-AN`,
          leadId: lead.id,
          leadName: formatFullName(lead.firstName, lead.lastName),
          company: lead.company,
          type: "note_added",
          createdAt: created.createdAt,
          summary: created.body,
        },
        ...current,
      ]);
      setNote("");
      toast.success("Note enregistrée.");
    } catch (error) {
      setNoteError(
        error instanceof Error ? error.message : "La note n'a pas pu être enregistrée.",
      );
    } finally {
      setNotePending(false);
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      await removeMany([lead.id]);
      router.push("/leads");
      toast.success(`Fiche de ${formatFullName(lead.firstName, lead.lastName)} supprimée.`, {
        duration: 8000,
        action: {
          label: "Annuler",
          onClick: async () => {
            try {
              await restoreDeleted();
              router.push(`/leads/${lead.id}`);
            } catch (error) {
              toast.error("La suppression n'a pas pu être annulée.", {
                description: error instanceof Error ? error.message : undefined,
              });
            }
          },
        },
      });
    } catch (error) {
      setDeleting(false);
      toast.error("La suppression a échoué.", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  const notes = [...lead.notes].reverse();
  const phoneHref = lead.phone ? `tel:${lead.phone.replace(/\s/g, "")}` : null;

  return (
    <div className="space-y-5">
      <div>
        <LeadsBackLink />

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <h1 className="text-title font-semibold tracking-[-0.022em] text-foreground">
              {formatFullName(lead.firstName, lead.lastName)}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-body text-muted-foreground">
              <span>{lead.company}</span>
              <LeadStatusBadge status={lead.status} />
              <span className="font-mono text-label text-subtle">
                <span className="sr-only">Référence&nbsp;</span>
                {lead.id}
              </span>
            </p>
            {/* Entre deux rendez-vous, sur téléphone : appeler sans descendre jusqu'aux coordonnées. */}
            <div className="mt-3 flex gap-2 xl:hidden">
              {phoneHref ? (
                <Button asChild variant="secondary" size="sm">
                  <a href={phoneHref}>
                    <Phone className="size-4" aria-hidden />
                    Appeler
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="secondary" size="sm">
                <a href={`mailto:${lead.email}`}>
                  <Mail className="size-4" aria-hidden />
                  Écrire
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sur téléphone, le libellé reste lu mais s'efface : sélecteur, Modifier et Supprimer tiennent sur une ligne. */}
            <label htmlFor="lead-status" className="ui-label whitespace-nowrap max-sm:sr-only">
              Étape
            </label>
            <div className="w-36 sm:w-48">
              <Select value={lead.status} onValueChange={applyStatus} disabled={statusPending}>
                <SelectTrigger id="lead-status" aria-describedby="lead-status-help">
                  <SelectValue>{STATUS_CONFIG[lead.status].label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {statusPending ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
            ) : null}
            <p id="lead-status-help" className="sr-only">
              {STATUS_CONFIG[lead.status].description}
            </p>
            <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <EditLeadDialog lead={lead} />
            <Button
              variant="destructive"
              size="icon"
              type="button"
              onClick={remove}
              disabled={deleting}
              aria-label={`Supprimer la fiche de ${formatFullName(lead.firstName, lead.lastName)}`}
              title="Supprimer la fiche (annulable)"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Notes</CardTitle>
          <CardAction>
              <p className="text-label text-muted-foreground">
                {notes.length} note{notes.length > 1 ? "s" : ""}
              </p></CardAction>
        </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={submitNote} className="space-y-2">
                <label htmlFor="new-note" className="ui-label block font-medium text-foreground">
                  Ajouter une note
                </label>
                <Textarea
                  id="new-note"
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ce qui vient de se passer : appel, échange, décision…"
                  aria-invalid={Boolean(noteError)}
                  aria-describedby={noteError ? "note-error" : undefined}
                />
                {noteError ? (
                  <p id="note-error" className="text-label font-medium text-danger">
                    {noteError}
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <Button type="submit" variant="default" size="sm" disabled={notePending}>
                    {notePending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Enregistrement…
                      </>
                    ) : (
                      "Enregistrer la note"
                    )}
                  </Button>
                </div>
              </form>

              {notes.length === 0 ? (
                <p className="border-t border-border pt-4 text-body text-muted-foreground">
                  Aucune note pour l&apos;instant. La première note fera date dans l&apos;historique.
                </p>
              ) : (
                <ol className="divide-y divide-border border-t border-border">
                  {notes.map((entry) => (
                    <li key={entry.id} className="py-3">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-body font-medium text-foreground">{entry.author}</span>
                        <time
                          dateTime={entry.createdAt}
                          className="font-mono text-label text-subtle"
                        >
                          {formatDateTime(entry.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1 max-w-[70ch] text-body text-foreground">{entry.body}</p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Historique</CardTitle>
          <CardAction>
              <p className="text-label text-muted-foreground">{activities.length} évènements</p></CardAction>
        </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Aucun évènement."
                  description="L'historique se remplira dès la première action sur cette fiche."
                />
              ) : (
                <LeadTimeline activities={activities} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader className="border-b">
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <dl className="divide-y divide-border">
            <InfoRow icon={Mail} label="E-mail">
              <a
                href={`mailto:${lead.email}`}
                className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-current"
              >
                {lead.email}
              </a>
            </InfoRow>

            <InfoRow icon={Phone} label="Téléphone">
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-current"
                >
                  {lead.phone}
                </a>
              ) : (
                <span className="text-muted-foreground">Non renseigné</span>
              )}
            </InfoRow>

            <InfoRow icon={Building2} label="Entreprise">
              {lead.company}
            </InfoRow>

            <InfoRow icon={Wallet} label="Montant estimé">
              <span data-slot="figure" className="ui-figure text-lead font-semibold">
                {formatCurrency(lead.estimatedValue)}
              </span>
            </InfoRow>

            <InfoRow icon={CalendarDays} label="Créé le">
              <time dateTime={lead.createdAt} className="font-mono text-label">
                {formatDate(lead.createdAt)}
              </time>
            </InfoRow>

            <InfoRow icon={Clock} label="Dernier contact">
              {lead.lastContactAt ? (
                <time dateTime={lead.lastContactAt} className="font-mono text-label">
                  {formatDateTime(lead.lastContactAt)}
                </time>
              ) : (
                <span className="text-muted-foreground">Aucun échange enregistré</span>
              )}
            </InfoRow>
          </dl>
        </Card>
      </div>
    </div>
  );
}
