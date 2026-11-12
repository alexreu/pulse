"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { RowSelectionState } from "@tanstack/react-table";
import { FilterX, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { useLeads } from "@/features/leads/api/leads-store";
import {
  EMPTY_FILTERS,
  type LeadFilters,
  type LeadSort,
  type LeadStatus,
  type SortField,
} from "@/features/leads/types";
import { filterLeads, sortLeads } from "@/features/leads/utils/collection";
import { parseLeadsQuery, serializeLeadsQuery } from "@/features/leads/utils/query";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { AddLeadDialog } from "./add-lead-dialog";
import { BulkActionsBar } from "./bulk-actions-bar";
import { LeadsFilters } from "./leads-filters";
import { LEAD_VIEWS, LeadsTabs, type LeadViewId } from "./leads-tabs";
import { rememberLeadsQuery } from "./leads-back-link";
import { LeadsTable } from "./leads-table";

/** L'onglet qui correspond exactement aux étapes filtrées, s'il y en a un. */
function viewFor(statuses: LeadStatus[]): LeadViewId | null {
  const view = LEAD_VIEWS.find(
    (entry) =>
      entry.statuses.length === statuses.length &&
      entry.statuses.every((status) => statuses.includes(status)),
  );
  return view?.id ?? null;
}

/**
 * Le tableau des prospects. Les filtres, le tri et la pagination sont une
 * seule commande : chaque changement relit le compteur, le tableau et
 * l'emplacement vide ensemble, et s'écrit dans l'URL — on peut partager une
 * vue filtrée, et la retrouver en revenant d'une fiche.
 *
 * Les onglets ne sont pas un second filtre : ils posent les étapes du filtre
 * « Étape », et s'allument quand ce filtre correspond exactement à l'un d'eux.
 */
export function LeadsBoard() {
  const { leads, changeStatusMany, removeMany, restoreDeleted } = useLeads();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.toString();

  const [initial] = React.useState(() => parseLeadsQuery(searchParams));
  const [filters, setFilters] = React.useState<LeadFilters>(initial.filters);
  const [sort, setSort] = React.useState<LeadSort>(initial.sort);
  const [pageSize, setPageSize] = React.useState(initial.pageSize);
  const [selection, setSelection] = React.useState<RowSelectionState>({});
  const [pending, setPending] = React.useState(false);

  const query = serializeLeadsQuery({ filters, sort, pageSize });

  // Une navigation vers /leads avec d'autres paramètres (palette, lien du
  // tableau de bord) remplace l'état. Comparé pendant le rendu, pas dans un
  // effet : notre propre réécriture d'URL redonne `query` et ne déclenche rien.
  const [seenUrlQuery, setSeenUrlQuery] = React.useState(urlQuery);
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    if (urlQuery !== query) {
      const next = parseLeadsQuery(searchParams);
      setFilters(next.filters);
      setSort(next.sort);
      setPageSize(next.pageSize);
    }
  }

  React.useEffect(() => {
    if (query !== new URLSearchParams(window.location.search).toString()) {
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    }
    rememberLeadsQuery(query);
  }, [query, pathname]);

  // Le tri et le filtrage passent par les fonctions du domaine, pas par le tableau.
  const visible = React.useMemo(() => sortLeads(filterLeads(leads, filters), sort), [leads, filters, sort]);
  const activeView = viewFor(filters.statuses);

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

  function selectView(id: LeadViewId) {
    const view = LEAD_VIEWS.find((entry) => entry.id === id);
    if (view) setFilters((current) => ({ ...current, statuses: [...view.statuses] }));
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
      // Pas de boîte de confirmation : on rend l'erreur réparable plutôt que
      // de faire valider chaque geste. Le toast reste assez longtemps pour
      // qu'on ait le temps de changer d'avis.
      toast.success(`${count} prospect${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`, {
        duration: 8000,
        action: {
          label: "Annuler",
          onClick: () => void undoRemove(),
        },
      });
    } catch (error) {
      toast.error("La suppression a échoué.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  async function undoRemove() {
    try {
      const count = await restoreDeleted();
      toast.success(`${count} prospect${count > 1 ? "s" : ""} restauré${count > 1 ? "s" : ""}.`);
    } catch (error) {
      toast.error("La suppression n'a pas pu être annulée.", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  const hasLeads = leads.length > 0;

  return (
    <div className="space-y-4">
      <LeadsTabs leads={leads} value={activeView} onChange={selectView} />

      <Card className="gap-0 py-0">
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
                    <Button variant="default">
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
      </Card>
    </div>
  );
}
