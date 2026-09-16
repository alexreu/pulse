import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { listLeads } from "@/features/leads/api/repository";
import { listActivities } from "@/features/leads/api/repository";
import { LeadsProvider } from "@/features/leads/api/leads-store";
import { getClients } from "@/features/leads/utils/metrics";
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
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a18" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // La coquille connaît les prospects : la barre du haut porte la création et
  // la palette ⌘K, le rail porte les compteurs. Une seule lecture pour tous.
  const [leads, activities] = await Promise.all([listLeads(), listActivities()]);
  const counts = {
    leads: leads.length,
    clients: getClients(leads).length,
    activity: activities.length,
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <LeadsProvider initialLeads={leads}>
              <a
                href="#contenu"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3.5 focus:py-2 focus:text-body focus:font-medium focus:shadow-overlay"
              >
                Aller au contenu
              </a>

              <AppSidebar counts={counts} />

              <div className="lg:pl-[248px]">
                <AppHeader leads={leads} counts={counts} />
                <main id="contenu" className="px-4 pb-10 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
            </LeadsProvider>

            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast:
                    "!rounded-xl !border-0 !bg-surface !text-foreground !font-sans !text-body !shadow-overlay",
                  title: "!font-medium",
                  description: "!text-muted-foreground",
                  actionButton: "!bg-action !text-action-ink !rounded-lg",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
