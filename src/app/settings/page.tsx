import type { Metadata } from "next";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Réglages" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Réglages"
        description="Profil, préférences d'affichage et notifications. Ces réglages vivent dans le navigateur : rien n'est enregistré sur un serveur."
      />
      <SettingsForm />
    </div>
  );
}
