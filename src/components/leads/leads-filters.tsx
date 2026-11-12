"use client";

import * as React from "react";
import { BellRing, CalendarRange, ListFilter, Search, X } from "lucide-react";
import { LEAD_STATUSES, type LeadFilters, type LeadStatus, type ValueBracket } from "@/features/leads/types";
import { PRIORITY_RULES } from "@/features/leads/utils/attention";
import { VALUE_BRACKETS } from "@/features/leads/utils/collection";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadsFiltersProps {
  filters: LeadFilters;
  onChange: (next: LeadFilters) => void;
  onReset: () => void;
  /** Le nombre de lignes restantes, relu à chaque changement de filtre. */
  resultCount: number;
  totalCount: number;
}

const VALUE_OPTIONS: Array<{ value: ValueBracket; label: string }> = [
  { value: "all", label: "Tous les montants" },
  { value: "under-1000", label: VALUE_BRACKETS["under-1000"].label },
  { value: "1000-5000", label: VALUE_BRACKETS["1000-5000"].label },
  { value: "over-5000", label: VALUE_BRACKETS["over-5000"].label },
];

export function LeadsFilters({
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: LeadsFiltersProps) {
  /** La saisie reste immédiate ; la recherche part 250 ms après la frappe. */
  const [term, setTerm] = React.useState(filters.search);
  const [syncedSearch, setSyncedSearch] = React.useState(filters.search);

  // La réinitialisation des filtres vient de l'extérieur : on reprend la
  // valeur pendant le rendu plutôt que dans un effet.
  if (syncedSearch !== filters.search) {
    setSyncedSearch(filters.search);
    setTerm(filters.search);
  }

  React.useEffect(() => {
    if (term === filters.search) return;
    const timer = setTimeout(() => onChange({ ...filters, search: term }), 250);
    return () => clearTimeout(timer);
  }, [term, filters, onChange]);

  function toggleStatus(status: LeadStatus, checked: boolean) {
    onChange({
      ...filters,
      statuses: checked
        ? [...filters.statuses, status]
        : filters.statuses.filter((value) => value !== status),
    });
  }

  const dateCount = [filters.createdFrom, filters.createdTo].filter(Boolean).length;

  const isFiltered =
    filters.search.length > 0 ||
    filters.statuses.length > 0 ||
    filters.valueBracket !== "all" ||
    Boolean(filters.createdFrom) ||
    Boolean(filters.createdTo) ||
    Boolean(filters.priority);

  const priority = filters.priority ? PRIORITY_RULES[filters.priority] : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
      {priority ? (
        // La règle de « À faire en premier » qui a ouvert ce tableau, retirable d'un geste.
        <div className="flex w-full items-center gap-2 rounded-lg bg-warning-tint py-1 pl-3 pr-1 text-body">
          <BellRing className="size-4 shrink-0 text-warning" aria-hidden />
          <p className="min-w-0 flex-1">
            <span className="font-medium">{priority.label}</span>
            <span className="text-foreground/75"> · {priority.detail.toLowerCase()}</span>
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label={`Retirer le filtre « ${priority.label} »`}
            onClick={() => onChange({ ...filters, priority: undefined })}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      ) : null}

      {/* Les largeurs minimales font passer la barre sur trois lignes en mobile au lieu d'écraser les champs. */}
      <div className="relative min-w-48 flex-1 sm:max-w-xs">
        <label htmlFor="leads-search" className="sr-only">
          Rechercher un prospect par nom, entreprise ou e-mail
        </label>
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="leads-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Rechercher…"
          className="pl-8"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <ListFilter className="size-4" aria-hidden />
            Étape
            {filters.statuses.length > 0 ? (
              <span data-slot="figure" className="ml-0.5 rounded-full bg-primary px-1.5 text-label font-medium text-primary-foreground">
                {filters.statuses.length}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filtrer par étape</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LEAD_STATUSES.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.statuses.includes(status)}
              onCheckedChange={(checked) => toggleStatus(status, checked === true)}
              onSelect={(event) => event.preventDefault()}
            >
              {STATUS_CONFIG[status].label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="min-w-36 flex-1 sm:w-48 sm:flex-none">
        <label htmlFor="leads-value" className="sr-only">
          Filtrer par montant estimé
        </label>
        <Select
          value={filters.valueBracket}
          onValueChange={(value) => onChange({ ...filters, valueBracket: value as ValueBracket })}
        >
          <SelectTrigger id="leads-value">
            {/* Le libellé est écrit d'avance : sans lui, le rendu serveur laisse le champ vide jusqu'à l'hydratation. */}
            <SelectValue>
              {VALUE_OPTIONS.find((option) => option.value === filters.valueBracket)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {VALUE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/*
        La période est un filtre facultatif : elle vit dans un panneau plutôt
        que dans la barre, où deux champs de date pleine largeur débordaient de
        l'écran sur mobile et écrasaient les filtres principaux sur desktop.
      */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            <CalendarRange className="size-4" aria-hidden />
            Période
            {dateCount > 0 ? (
              <span
                data-slot="figure"
                className="ml-0.5 rounded-full bg-primary px-1.5 text-label font-medium text-primary-foreground"
              >
                {dateCount}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="ui-label mb-2 font-medium text-foreground">Date de création</p>
          <div className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="leads-from" className="ui-label">
                À partir du
              </label>
              <Input
                id="leads-from"
                type="date"
                value={filters.createdFrom?.slice(0, 10) ?? ""}
                onChange={(event) =>
                  onChange({ ...filters, createdFrom: event.target.value || undefined })
                }
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="leads-to" className="ui-label">
                Jusqu&apos;au
              </label>
              <Input
                id="leads-to"
                type="date"
                value={filters.createdTo?.slice(0, 10) ?? ""}
                onChange={(event) =>
                  onChange({ ...filters, createdTo: event.target.value || undefined })
                }
              />
            </div>
            {dateCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="w-full"
                onClick={() =>
                  onChange({ ...filters, createdFrom: undefined, createdTo: undefined })
                }
              >
                Effacer la période
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      <p className="ml-auto whitespace-nowrap text-label text-muted-foreground" aria-live="polite">
        {resultCount} / {totalCount} prospects
      </p>

      {isFiltered ? (
        <Button variant="ghost" size="sm" onClick={onReset} type="button">
          <X className="size-4" aria-hidden />
          Réinitialiser
        </Button>
      ) : null}
    </div>
  );
}
