"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, Clock, Loader2, Mail, Phone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import { LEAD_STATUSES, type Activity, type Lead, type LeadStatus } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { formatCurrency, formatDate, formatDateTime, formatFullName } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/empty-state";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadTimeline } from "./lead-timeline";

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
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <dt className="ui-label">{label}</dt>
        <dd className="mt-0.5 break-words text-body text-foreground">{children}</dd>
      </div>
    </div>
  );
}

export function LeadDetail({ lead: initialLead, initialActivities }: LeadDetailProps) {
  const { leads, changeStatus, addNote } = useLeads();
  const lead = leads.find((entry) => entry.id === initialLead.id) ?? initialLead;

  const [activities, setActivities] = React.useState(initialActivities);
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
      toast.success(`Étape mise à jour : ${STATUS_CONFIG[status].label}.`);
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

  const notes = [...lead.notes].reverse();

  return (
    <div className="space-y-5">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2.5">
          <Link href="/leads">
            <ArrowLeft className="size-4" aria-hidden />
            Retour au tableau
          </Link>
        </Button>

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
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="lead-status" className="ui-label whitespace-nowrap">
              Étape
            </label>
            <div className="w-48">
              <Select value={lead.status} onValueChange={applyStatus} disabled={statusPending}>
                <SelectTrigger id="lead-status" aria-describedby="lead-status-help">
                  <SelectValue />
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
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel>
            <PanelHeader>
              <PanelTitle>Notes</PanelTitle>
              <p className="text-label text-muted-foreground">
                {notes.length} note{notes.length > 1 ? "s" : ""}
              </p>
            </PanelHeader>

            <PanelBody className="space-y-4">
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
                  <Button type="submit" variant="primary" size="sm" disabled={notePending}>
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
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle>Historique</PanelTitle>
              <p className="text-label text-muted-foreground">{activities.length} évènements</p>
            </PanelHeader>
            <PanelBody>
              {activities.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Aucun évènement."
                  description="L'historique se remplira dès la première action sur cette fiche."
                />
              ) : (
                <LeadTimeline activities={activities} />
              )}
            </PanelBody>
          </Panel>
        </div>

        <Panel className="h-fit">
          <PanelHeader>
            <PanelTitle>Informations</PanelTitle>
          </PanelHeader>
          <dl className="divide-y divide-border">
            <InfoRow icon={Mail} label="E-mail">
              <a
                href={`mailto:${lead.email}`}
                className="underline-offset-4 hover:underline"
              >
                {lead.email}
              </a>
            </InfoRow>

            <InfoRow icon={Phone} label="Téléphone">
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="underline-offset-4 hover:underline"
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
        </Panel>
      </div>
    </div>
  );
}
