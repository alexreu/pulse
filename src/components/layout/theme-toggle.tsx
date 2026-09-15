"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Le thème clair et le thème sombre. Les deux icônes sont rendues et c'est la
 * classe `.dark` du document qui décide laquelle s'affiche : aucun état monté
 * n'est nécessaire, donc aucun clignotement à l'hydratation.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label="Changer de thème"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <span className="sr-only dark:hidden">Passer en thème sombre</span>
      <span className="sr-only hidden dark:inline">Passer en thème clair</span>
    </Button>
  );
}
