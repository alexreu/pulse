"use client";

import * as React from "react";
import { Loader2, Tag, Trash2, X } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionsBarProps {
  count: number;
  pending: boolean;
  onChangeStatus: (status: LeadStatus) => void;
  onDelete: () => void;
  onClear: () => void;
}

/**
 * La sélection multiple transforme la ligne d'en-tête du tableau en barre
 * d'actions. Ce n'est pas une barre flottante : elle prend la place de
 * l'en-tête, à l'intérieur du même filet.
 */
export function BulkActionsBar({
  count,
  pending,
  onChangeStatus,
  onDelete,
  onClear,
}: BulkActionsBarProps) {
  return (
    <div
      role="region"
      aria-label="Actions sur la sélection"
      className="flex flex-wrap items-center gap-2 border-b border-border bg-brand-tint px-3 py-2.5"
    >
      <p className="text-body font-medium text-brand-text" aria-live="polite">
        {count} prospect{count > 1 ? "s" : ""} sélectionné{count > 1 ? "s" : ""}
      </p>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              disabled={pending}
              
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Tag className="size-4" aria-hidden />
              )}
              Changer l&apos;étape
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Nouvelle étape</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LEAD_STATUSES.map((status) => (
              <DropdownMenuItem key={status} onSelect={() => onChangeStatus(status)}>
                {STATUS_CONFIG[status].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={onDelete}
          disabled={pending}
        >
          <Trash2 className="size-4" aria-hidden />
          Supprimer
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          onClick={onClear}
          disabled={pending}
          aria-label="Vider la sélection"
          
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
