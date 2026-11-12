"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/features/leads/utils/query";

interface LeadsPaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  onPageChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}

export { PAGE_SIZES };

export function LeadsPagination({
  pageIndex,
  pageCount,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
}: LeadsPaginationProps) {
  const first = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="ui-label whitespace-nowrap">
          Lignes par page
        </label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger id="page-size" className="h-8 w-[4.5rem]">
            <SelectValue>{pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-label text-muted-foreground" aria-live="polite">
        {first}–{last} sur {rowCount}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Précédent
        </Button>
        <span className="px-1 whitespace-nowrap text-label text-muted-foreground">
          Page {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          Suivant
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
