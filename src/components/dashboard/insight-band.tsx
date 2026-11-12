import { Lightbulb } from "lucide-react";
import { IconTile } from "@/components/ui/icon-tile";

/**
 * La phrase qui interprète le tableau. Elle ne répète pas un chiffre déjà
 * affiché : elle dit ce qu'il faut en conclure.
 */
export function InsightBand({ headline, reading }: { headline: string; reading: string }) {
  return (
    <aside className="flex gap-3 rounded-xl bg-info-tint p-4">
      <IconTile icon={Lightbulb} size="sm" className="bg-info text-white" />
      <p className="max-w-[90ch] text-body text-foreground">
        <strong className="font-medium">{headline}</strong>{" "}
        <span className="text-foreground/75">{reading}</span>
      </p>
    </aside>
  );
}
