import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * L'échelle typographique du projet est nommée (`text-body`, `text-label`…),
 * pas numérique. Sans cette déclaration, tailwind-merge range `text-body` dans
 * le groupe des couleurs de texte et supprime le `text-primary-foreground`
 * qui le précède : le bouton primaire perdait sa couleur de texte et héritait
 * de l'encre du corps, illisible sur le fond de marque.
 */
const FONT_SIZES = ["micro", "label", "body", "lead", "panel", "title", "figure"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
