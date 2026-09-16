"use client";

import * as React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, MoreHorizontal } from "lucide-react";
import type { Lead, LeadSort, SortField } from "@/features/leads/types";
import { formatCurrency, formatFullName, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadAvatar } from "./lead-avatar";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadsPagination } from "./leads-pagination";

interface LeadsTableProps {
  leads: Lead[];
  sort: LeadSort;
  onSortChange: (field: SortField) => void;
  selection: RowSelectionState;
  onSelectionChange: (next: RowSelectionState) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  emptyState: React.ReactNode;
}

/** Ce que chaque colonne pèse : le tableau ne cède pas les mêmes en premier. */
const COLUMN_VISIBILITY: Record<string, string> = {
  company: "hidden md:table-cell",
  email: "hidden xl:table-cell",
  createdAt: "hidden lg:table-cell",
};

function SortButton({
  label,
  field,
  sort,
  onSortChange,
  align = "left",
}: {
  label: string;
  field: SortField;
  sort: LeadSort;
  onSortChange: (field: SortField) => void;
  align?: "left" | "right";
}) {
  const isActive = sort.field === field;
  const Icon = !isActive ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;
  const nextDirection = isActive && sort.direction === "asc" ? "décroissant" : "croissant";

  return (
    <button
      type="button"
      onClick={() => onSortChange(field)}
      aria-label={`Trier par ${label.toLowerCase()}, ordre ${nextDirection}`}
      className={cn(
        "ui-label inline-flex items-center gap-1.5 rounded-sm py-0.5 transition-colors duration-200 ease-out-soft hover:text-foreground",
        isActive && "font-medium text-foreground",
        align === "right" && "flex-row-reverse",
      )}
    >
      {label}
      <Icon className={cn("size-3", isActive ? "text-brand-text" : "text-subtle")} aria-hidden />
    </button>
  );
}

export function LeadsTable({
  leads,
  sort,
  onSortChange,
  selection,
  onSelectionChange,
  pageSize,
  onPageSizeChange,
  emptyState,
}: LeadsTableProps) {
  const columns = React.useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
            aria-label="Sélectionner toutes les lignes de la page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value === true)}
            aria-label={`Sélectionner ${formatFullName(row.original.firstName, row.original.lastName)}`}
          />
        ),
      },
      {
        id: "name",
        header: () => (
          <SortButton label="Prospect" field="name" sort={sort} onSortChange={onSortChange} />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <LeadAvatar
              firstName={row.original.firstName}
              lastName={row.original.lastName}
            />
            <div className="min-w-0">
              <Link
                href={`/leads/${row.original.id}`}
                className="block truncate font-medium text-foreground underline-offset-4 hover:underline"
              >
                {formatFullName(row.original.firstName, row.original.lastName)}
              </Link>
              <span className="block truncate text-label text-subtle md:hidden">
                {row.original.company}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "company",
        header: () => <span className="ui-label">Entreprise</span>,
        cell: ({ row }) => <span className="block truncate">{row.original.company}</span>,
      },
      {
        id: "email",
        header: () => <span className="ui-label">E-mail</span>,
        cell: ({ row }) => (
          <a
            href={`mailto:${row.original.email}`}
            className="block truncate text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {row.original.email}
          </a>
        ),
      },
      {
        id: "estimatedValue",
        header: () => (
          <SortButton
            label="Montant"
            field="estimatedValue"
            sort={sort}
            onSortChange={onSortChange}
            align="right"
          />
        ),
        cell: ({ row }) => (
          <span data-slot="figure" className="ui-figure block text-right font-medium">
            {formatCurrency(row.original.estimatedValue)}
          </span>
        ),
      },
      {
        id: "status",
        header: () => <span className="ui-label">Étape</span>,
        cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
      },
      {
        id: "createdAt",
        header: () => (
          <SortButton label="Créé le" field="createdAt" sort={sort} onSortChange={onSortChange} />
        ),
        cell: ({ row }) => (
          <time
            dateTime={row.original.createdAt}
            className="whitespace-nowrap font-mono text-label text-muted-foreground"
          >
            {formatShortDate(row.original.createdAt)}
          </time>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions pour ${formatFullName(row.original.firstName, row.original.lastName)}`}
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/leads/${row.original.id}`}>
                  <ChevronRight className="size-4" aria-hidden />
                  Ouvrir la fiche
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.email}`}>Écrire un e-mail</a>
              </DropdownMenuItem>
              {row.original.phone ? (
                <DropdownMenuItem asChild>
                  <a href={`tel:${row.original.phone.replace(/\s/g, "")}`}>Appeler</a>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [sort, onSortChange],
  );

  const table = useReactTable({
    data: leads,
    columns,
    getRowId: (row) => row.id,
    state: { rowSelection: selection, pagination: { pageIndex: 0, pageSize } },
    onRowSelectionChange: (updater) =>
      onSelectionChange(typeof updater === "function" ? updater(selection) : updater),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  React.useEffect(() => {
    if (pageIndex > 0 && pageIndex >= pageCount) table.setPageIndex(Math.max(pageCount - 1, 0));
  }, [pageIndex, pageCount, table]);

  if (leads.length === 0) return <>{emptyState}</>;

  return (
    <>
      {/*
        Sur mobile, le tableau tient dans la largeur : les colonnes secondaires
        sont masquées et il ne reste que nom, montant, étape et actions. Aucune
        largeur minimale n'est imposée avant `md`, sinon le navigateur mobile
        dézoome la page entière pour faire entrer le tableau.
      */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body md:min-w-[44rem]">
          <caption className="sr-only">
            Prospects — {leads.length} lignes, triées par {sort.field}, ordre{" "}
            {sort.direction === "asc" ? "croissant" : "décroissant"}
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border bg-sunk/60">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sort.field === header.id
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={cn(
                      "px-2 py-2.5 text-left align-middle font-normal sm:px-3",
                      header.id === "estimatedValue" && "text-right",
                      header.id === "select" && "w-8 pr-0 sm:w-10",
                      header.id === "actions" && "w-9 px-1 sm:w-10 sm:px-3",
                      COLUMN_VISIBILITY[header.id],
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="transition-colors duration-150 hover:bg-muted data-[state=selected]:bg-info-tint"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-2 py-2.5 align-middle sm:px-3",
                      cell.column.id === "select" && "pr-0",
                      cell.column.id === "name" && "max-w-[11rem] sm:max-w-[16rem]",
                      cell.column.id === "company" && "max-w-[12rem]",
                      cell.column.id === "email" && "max-w-[16rem]",
                      cell.column.id === "actions" && "px-1 sm:px-3",
                      COLUMN_VISIBILITY[cell.column.id],
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LeadsPagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        rowCount={leads.length}
        onPageChange={(index) => table.setPageIndex(index)}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
