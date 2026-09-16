import { formatInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Six teintes possibles, choisies de façon déterministe à partir du nom : la
 * même personne garde sa pastille d'un écran à l'autre. La couleur est
 * décorative, l'initiale n'est jamais la seule information de la ligne.
 */
const TONES = [
  "bg-[oklch(0.52_0.12_190)]",
  "bg-[oklch(0.51_0.17_350)]",
  "bg-[oklch(0.5_0.14_145)]",
  "bg-[oklch(0.5_0.17_290)]",
  "bg-[oklch(0.52_0.14_55)]",
  "bg-[oklch(0.51_0.15_245)]",
];

function toneFor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 997;
  }
  return TONES[hash % TONES.length];
}

export function LeadAvatar({
  firstName,
  lastName,
  className,
}: {
  firstName: string;
  lastName: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-label font-medium text-white",
        toneFor(`${firstName}${lastName}`),
        className,
      )}
    >
      {formatInitials(firstName, lastName)}
    </span>
  );
}
