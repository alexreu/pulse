import Link from "next/link";
import type { Lead } from "@/features/leads/types";
import { countLeadsByStage } from "@/features/leads/utils/metrics";
import { STATUS_CONFIG, TONE_VAR } from "@/features/leads/utils/status";
import { formatCurrency, formatNumber } from "@/lib/format";

/**
 * Le pipeline en lignes d'étape : étiquette, barre de signal proportionnelle,
 * compte et montant alignés à droite. La barre double le chiffre, elle ne le
 * remplace pas.
 */
export function PipelineOverview({ leads }: { leads: Lead[] }) {
  const stages = countLeadsByStage(leads);
  const max = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <ol className="divide-y divide-border">
      {stages.map((stage) => {
        const config = STATUS_CONFIG[stage.stage];
        const share = Math.round((stage.count / max) * 100);

        return (
          <li key={stage.stage}>
            <Link
              href={`/leads?status=${stage.stage}`}
              className="group block px-4 py-3 transition-colors duration-150 hover:bg-muted"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body font-medium text-foreground">
                  {config.label}
                </span>
                <span className="flex items-baseline gap-3">
                  <span className="text-label text-subtle">{formatCurrency(stage.value)}</span>
                  <span
                    data-slot="figure"
                    className="ui-figure w-8 text-right text-body text-foreground"
                  >
                    {formatNumber(stage.count)}
                  </span>
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full bg-muted">
                <div
                  aria-hidden
                  className="h-full rounded-full transition-[width] duration-300 ease-out-soft"
                  style={{
                    width: `${share}%`,
                    backgroundColor: `color-mix(in oklch, ${TONE_VAR[config.tone]} 72%, transparent)`,
                  }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
