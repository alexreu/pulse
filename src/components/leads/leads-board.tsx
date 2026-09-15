"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import type { RowSelectionState } from "@tanstack/react-table";
import { FilterX, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import {
  EMPTY_FILTERS,
  LEAD_STATUSES,
  type LeadFilters,
  type LeadSort,
  type LeadStatus,
  type SortField,
} from "@/features/leads/types";
import { filterLeads, sortLeads } from "@/features/leads/utils/collection";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { EmptyState } from "@/components/common/empty-state";
import { AddLeadDialog } from "./add-lead-dialog";
import { BulkActionsBar } from "./bulk-actions-bar";
import { LeadsFilters } from "./leads-filters";
import { LeadsTable } from "./leads-table";

function isStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

/**
 * Le tableau des prospects. Les filtres, le tri et la pagination sont une
 * seule commande : chaque changement relit le compteur, le tableau et
 * l'emplacement vide ensemble.
 */
export function LeadsBoard() {
  const { leads, changeStatusMany, removeMany } = useLeads();
  const searchParams = useSearchParams();

  const [filters, setFilters] = React.useState<LeadFilters>(() => {
    const status = searchParams.get("status");
    return {
      ...EMPTY_FILTERS,
      search: searchParams.get("q") ?? "",
      statuses: status && isStatus(status) ? [status] : [],
    };
  });

  const [sort, setSort] = React.useState<LeadSort>({ field: "createdAt", direction: "desc" });
  const [selection, setSelection] = React.useState<RowSelectionState>({});
  const [pageSize, setPageSize] = React.useState(10);
  const [pending, setPending] = React.useState(false);

  // Le tri et le filtrage passent par les fonctions du domaine, pas par le tableau.
  const visible = React.useMemo(
    () => sortLeads(filterLeads(leads, filters), sort),
    [leads, filters, sort],
  );

  const selectedIds = React.useMemo(
    () => Object.keys(selection).filter((id) => selection[id]),
    [selection],
  );

  function toggleSort(field: SortField) {
    setSort((current) =>
      current.field === field
        ? { field, direction: current.direction === "asc" ? "desc" : "asc" }
        : { field, direction: field === "name" ? "asc" : "desc" },
    );
  }

  function reset() {
    setFilters(EMPTY_FILTERS);
  }

  async function applyStatus(status: LeadStatus) {
    setPending(true);
    try {
      const count = await changeStatusMany(selectedIds, status);
      setSelection({});
      toast.success(
        count === 0
          ? "Aucune fiche à mettre à jour."
          : `${count} fiche${count > 1 ? "s" : ""} passée${count > 1 ? "s" : ""} à « ${STATUS_CONFIG[status].label} ».`,
      );
    } catch (error) {
      toast.error("L'étape n'a pas pu être modifiée.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  async function removeSelected() {
    setPending(true);
    try {
      const count = await removeMany(selectedIds);
      setSelection({});
      toast.success(`${count} prospect${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`);
    } catch (error) {
      toast.error("La suppression a échoué.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  const hasLeads = leads.length > 0;

  return (
    <Panel>
      {selectedIds.length > 0 ? (
        <BulkActionsBar
          count={selectedIds.length}
          pending={pending}
          onChangeStatus={applyStatus}
          onDelete={removeSelected}
          onClear={() => setSelection({})}
        />
      ) : (
        <LeadsFilters
          filters={filters}
          onChange={setFilters}
          onReset={reset}
          resultCount={visible.length}
          totalCount={leads.length}
        />
      )}

      <LeadsTable
        leads={visible}
        sort={sort}
        onSortChange={toggleSort}
        selection={selection}
        onSelectionChange={setSelection}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        emptyState={
          hasLeads ? (
            <EmptyState
              icon={FilterX}
              title="Aucun prospect ne correspond à vos filtres."
              description="Élargissez la recherche, retirez une étape ou changez la tranche de montant."
              action={
                <Button variant="secondary" onClick={reset} type="button">
                  <FilterX className="size-4" aria-hidden />
                  Réinitialiser les filtres
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Target}
              title="Vous n'avez encore aucun prospect."
              description="Créez votre première fiche : elle rejoindra le pipeline et la vue d'ensemble immédiatement."
              action={
                <AddLeadDialog
                  trigger={
                    <Button variant="primary">
                      <Plus className="size-4" aria-hidden />
                      Ajouter votre premier prospect
                    </Button>
                  }
                />
              }
            />
          )
        }
      />
    </Panel>
  );
}
