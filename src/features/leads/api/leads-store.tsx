"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "../types";
import type { LeadEditValues, LeadFormValues } from "../schemas/lead";
import {
  deleteLeads as deleteLeadsRequest,
  patchBulkStatus,
  patchLeadStatus,
  postLead,
  postNote,
  putLead,
  resetDemo,
  restoreDeletedLeads,
} from "./client";

interface LeadsContextValue {
  leads: Lead[];
  createLead: (values: LeadFormValues) => Promise<Lead>;
  updateLead: (id: string, values: LeadEditValues) => Promise<Lead>;
  changeStatus: (id: string, status: LeadStatus) => Promise<Lead>;
  addNote: (id: string, body: string) => Promise<Lead>;
  changeStatusMany: (ids: string[], status: LeadStatus) => Promise<number>;
  removeMany: (ids: string[]) => Promise<number>;
  /** Annule la dernière suppression groupée. */
  restoreDeleted: () => Promise<number>;
  /** Remet tout le jeu de données dans son état initial. */
  resetAll: () => Promise<void>;
}

const LeadsContext = React.createContext<LeadsContextValue | null>(null);

/**
 * L'état des prospects côté client. Il part des données rendues par le serveur
 * et applique chaque écriture localement après l'appel HTTP, puis demande au
 * routeur de rafraîchir les pages serveur qui affichent les mêmes chiffres.
 */
export function LeadsProvider({
  initialLeads,
  children,
}: {
  initialLeads: Lead[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [leads, setLeads] = React.useState(initialLeads);
  const [seed, setSeed] = React.useState(initialLeads);

  // Le serveur renvoie une nouvelle liste après un `router.refresh()` : on
  // réaligne l'état pendant le rendu plutôt que dans un effet, pour éviter
  // un rendu en cascade.
  if (seed !== initialLeads) {
    setSeed(initialLeads);
    setLeads(initialLeads);
  }

  const value = React.useMemo<LeadsContextValue>(() => {
    function replace(updated: Lead) {
      setLeads((current) =>
        current.map((lead) => (lead.id === updated.id ? updated : lead)),
      );
    }

    return {
      leads,
      async createLead(values) {
        const { lead } = await postLead(values);
        setLeads((current) => [lead, ...current]);
        router.refresh();
        return lead;
      },
      async updateLead(id, values) {
        const { lead } = await putLead(id, values);
        replace(lead);
        router.refresh();
        return lead;
      },
      async changeStatus(id, status) {
        const { lead } = await patchLeadStatus(id, status);
        replace(lead);
        router.refresh();
        return lead;
      },
      async addNote(id, body) {
        const { lead } = await postNote(id, body);
        replace(lead);
        router.refresh();
        return lead;
      },
      async changeStatusMany(ids, status) {
        const { updated } = await patchBulkStatus(ids, status);
        const byId = new Map(updated.map((lead) => [lead.id, lead]));
        setLeads((current) => current.map((lead) => byId.get(lead.id) ?? lead));
        router.refresh();
        return updated.length;
      },
      async removeMany(ids) {
        const { removed } = await deleteLeadsRequest(ids);
        setLeads((current) => current.filter((lead) => !removed.includes(lead.id)));
        router.refresh();
        return removed.length;
      },
      async restoreDeleted() {
        const { leads: next, restored } = await restoreDeletedLeads();
        setLeads(next);
        router.refresh();
        return restored;
      },
      async resetAll() {
        await resetDemo();
        router.refresh();
      },
    };
  }, [leads, router]);

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads(): LeadsContextValue {
  const context = React.useContext(LeadsContext);
  if (!context) throw new Error("useLeads doit être utilisé dans un LeadsProvider.");
  return context;
}
