import type { Metadata } from "next";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageIntro } from "@/components/layout/page-intro";
import { getFailNextWrite } from "@/features/leads/api/repository";

export const metadata: Metadata = { title: "Réglages" };

export default async function SettingsPage() {
  const failNextWrite = await getFailNextWrite();

  return (
    <div className="space-y-6">
      <PageIntro description="Profil, préférences d'affichage et notifications. Ces réglages vivent dans le navigateur : rien n'est enregistré sur un serveur."
      />
      <SettingsForm initialFailNextWrite={failNextWrite} />
    </div>
  );
}
