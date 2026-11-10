"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { CURRENT_USER } from "@/data/user";
import { setDemoFailure } from "@/features/leads/api/client";
import { useLeads } from "@/features/leads/api/leads-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_LABELS: Record<string, string> = { fr: "Français", en: "English" };
const TIMEZONE_LABELS: Record<string, string> = {
  "Europe/Paris": "Europe/Paris",
  "Europe/Lisbon": "Europe/Lisbonne",
  "America/Montreal": "Amérique/Montréal",
};
const THEME_LABELS: Record<string, string> = { light: "Clair", dark: "Sombre", system: "Système" };

const NOTIFICATIONS = [
  {
    id: "new-lead",
    label: "Nouveau prospect",
    description: "À chaque fiche ajoutée à la base.",
    initial: true,
  },
  {
    id: "deal-won",
    label: "Affaire gagnée",
    description: "Quand un prospect passe à l'étape « Gagné ».",
    initial: true,
  },
  {
    id: "weekly-report",
    label: "Rapport hebdomadaire",
    description: "Une synthèse du portefeuille, chaque lundi matin.",
    initial: false,
  },
];

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-body font-medium text-foreground">{title}</p>
        <p className="mt-0.5 max-w-[60ch] text-label text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">{control}</div>
    </div>
  );
}

/**
 * Les réglages sont purement frontend : rien n'est persisté côté serveur,
 * sauf le bloc Démonstration, qui pilote le dépôt du visiteur.
 */
export function SettingsForm({ initialFailNextWrite = false }: { initialFailNextWrite?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { resetAll } = useLeads();
  const [resetting, setResetting] = React.useState(false);

  const [profile, setProfile] = React.useState<{
    name: string;
    email: string;
    role: string;
  }>({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    role: CURRENT_USER.role,
  });
  const [language, setLanguage] = React.useState("fr");
  const [timezone, setTimezone] = React.useState("Europe/Paris");
  const [notifications, setNotifications] = React.useState(() =>
    Object.fromEntries(NOTIFICATIONS.map((entry) => [entry.id, entry.initial])),
  );
  const [failNextWrite, setFailNextWrite] = React.useState(initialFailNextWrite);
  const [saving, setSaving] = React.useState(false);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    // Aucun enregistrement réel : le délai rend l'état d'attente visible.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    toast.success("Profil enregistré.", {
      description: "Les réglages ne sont pas persistés : ils reviendront au rechargement.",
    });
  }

  async function toggleFailure(enabled: boolean) {
    setFailNextWrite(enabled);
    try {
      await setDemoFailure(enabled);
      toast.success(
        enabled
          ? "La prochaine écriture échouera."
          : "Les écritures fonctionnent de nouveau.",
      );
    } catch {
      setFailNextWrite(!enabled);
      toast.error("L'interrupteur n'a pas pu être basculé.");
    }
  }

  async function resetDemo() {
    setResetting(true);
    try {
      await resetAll();
      setFailNextWrite(false);
      toast.success("Démonstration réinitialisée.", {
        description: "Le jeu de données est revenu à son état de départ.",
      });
    } catch {
      toast.error("La démonstration n'a pas pu être réinitialisée.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader className="border-b">
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Nom</Label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  autoComplete="name"
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email">E-mail</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  autoComplete="email"
                  onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-role">Rôle</Label>
                <Input
                  id="profile-role"
                  value={profile.role}
                  onChange={(event) => setProfile({ ...profile, role: event.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer le profil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <div className="divide-y divide-border">
          <SettingRow
            title="Langue"
            description="La langue de l'interface."
            control={
              <div className="w-40">
                <Label htmlFor="pref-language" className="sr-only">
                  Langue
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="pref-language">
                    <SelectValue>{LANGUAGE_LABELS[language]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
          <SettingRow
            title="Fuseau horaire"
            description="Les dates et heures affichées dans les fiches."
            control={
              <div className="w-40">
                <Label htmlFor="pref-timezone" className="sr-only">
                  Fuseau horaire
                </Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="pref-timezone">
                    <SelectValue>{TIMEZONE_LABELS[timezone]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="Europe/Lisbon">Europe/Lisbonne</SelectItem>
                    <SelectItem value="America/Montreal">Amérique/Montréal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
          <SettingRow
            title="Thème"
            description="Clair, sombre, ou celui de votre système."
            control={
              <div className="w-40">
                <Label htmlFor="pref-theme" className="sr-only">
                  Thème
                </Label>
                <Select value={theme ?? "system"} onValueChange={setTheme}>
                  <SelectTrigger id="pref-theme">
                    <SelectValue>{THEME_LABELS[theme ?? "system"]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
        </div>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <div className="divide-y divide-border">
          {NOTIFICATIONS.map((entry) => (
            <SettingRow
              key={entry.id}
              title={entry.label}
              description={entry.description}
              control={
                <div className="flex items-center gap-2">
                  <span className="text-label text-muted-foreground">
                    {notifications[entry.id] ? "Activé" : "Désactivé"}
                  </span>
                  <Switch
                    checked={notifications[entry.id]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [entry.id]: checked })
                    }
                    aria-label={entry.label}
                  />
                </div>
              }
            />
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="border-b">
          <CardTitle>Démonstration</CardTitle>
          <CardAction>
          <p className="text-label text-muted-foreground">
            Pour montrer les états d&apos;erreur sans casser quoi que ce soit.
          </p></CardAction>
        </CardHeader>
        <div className="divide-y divide-border">
          <SettingRow
            title="Réinitialiser la démonstration"
            description="Remet les prospects, les notes et l'historique dans leur état de départ. Vos modifications sont propres à votre navigateur : personne d'autre ne les voit."
            control={
              <Button variant="secondary" onClick={resetDemo} disabled={resetting}>
                {resetting ? "Réinitialisation…" : "Réinitialiser"}
              </Button>
            }
          />
          <SettingRow
            title="Simuler une erreur serveur"
            description="La prochaine création, note ou action groupée échouera avec une erreur 500. L'interrupteur se désarme tout seul après le déclenchement."
            control={
              <div className="flex items-center gap-2">
                <span className="text-label text-muted-foreground">
                  {failNextWrite ? "Armé" : "Désarmé"}
                </span>
                <Switch
                  checked={failNextWrite}
                  onCheckedChange={toggleFailure}
                  aria-label="Simuler une erreur serveur sur la prochaine écriture"
                />
              </div>
            }
          />
        </div>
      </Card>
    </div>
  );
}
