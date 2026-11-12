"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

/**
 * Le thème choisi dans l'application vit dans le stockage local (next-themes).
 * Cette page remplace le layout racine : elle relit ce choix elle-même, avant
 * le premier rendu, pour ne pas éblouir un visiteur en thème sombre.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}`;

/**
 * Le dernier filet : une erreur dans le layout racine (entête, rail,
 * palette de recherche) ne laisse pas l'écran par défaut de Next.js en anglais.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>Erreur · Pulse</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh items-center justify-center bg-background p-4 font-sans text-foreground antialiased">
        <main
          role="alert"
          className="flex w-full max-w-md flex-col items-center rounded-xl bg-surface px-6 py-12 text-center shadow-card dark:shadow-none dark:ring-1 dark:ring-border"
        >
          <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-danger-tint text-danger">
            <TriangleAlert className="size-4.5" aria-hidden />
          </span>
          <h1 className="text-panel font-semibold tracking-[-0.014em]">Pulse a rencontré une erreur.</h1>
          <p className="mt-1.5 max-w-[46ch] text-body text-muted-foreground">
            L&apos;affichage s&apos;est interrompu. Vos modifications sont conservées dans ce
            navigateur : réessayez, ou repartez de la vue d&apos;ensemble.
          </p>
          {digest ? (
            <p className="mt-3 rounded-md bg-sunk px-2.5 py-1.5 font-mono text-label text-muted-foreground">
              Référence : {digest}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={() => retry()}>
              <RotateCcw className="size-4" aria-hidden />
              Réessayer
            </Button>
            {/* Un lien natif : le routeur client a peut-être lui-même échoué. */}
            <Button asChild variant="secondary">
              <a href="/dashboard">Vue d&apos;ensemble</a>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
