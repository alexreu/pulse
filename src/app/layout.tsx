import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

/**
 * Geist pour toute l'interface, Geist Mono pour les identifiants et les
 * mesures. Une seule famille de texte : un produit n'a pas besoin d'une
 * fonte d'affichage séparée.
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pulse — Suivi commercial",
    template: "%s · Pulse",
  },
  description:
    "Pulse est une application CRM fictive : prospects, pipeline, chiffre d'affaires et activité d'une petite équipe commerciale.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#16161c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <a
              href="#contenu"
              className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3.5 focus:py-2 focus:text-body focus:font-medium focus:shadow-overlay"
            >
              Aller au contenu
            </a>

            <AppSidebar />

            <div className="lg:pl-[248px]">
              <AppHeader />
              <main id="contenu" className="px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>

            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast:
                    "!rounded-lg !border !border-border !bg-surface !text-foreground !font-sans !text-body !shadow-overlay",
                  title: "!font-medium",
                  description: "!text-muted-foreground",
                  actionButton: "!bg-primary !text-primary-foreground !rounded-md",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
