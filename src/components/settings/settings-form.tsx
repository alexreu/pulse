"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { CURRENT_USER } from "@/data/user";
import { setDemoFailure } from "@/features/leads/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
 * sauf l'interrupteur de démonstration d'erreur, qui pilote le dépôt.
 */
export function SettingsForm() {
  const { theme, setTheme } = useTheme();

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
  const [failNextWrite, setFailNextWrite] = React.useState(false);
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel className="lg:col-span-2">
        <PanelHeader>
          <PanelTitle>Profil</PanelTitle>
        </PanelHeader>
        <PanelBody>
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
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer le profil"}
              </Button>
            </div>
          </form>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelTitle>Préférences</PanelTitle>
        </PanelHeader>
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
                    <SelectValue />
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
                    <SelectValue />
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
                    <SelectValue />
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
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelTitle>Notifications</PanelTitle>
        </PanelHeader>
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
      </Panel>

      <Panel className="lg:col-span-2">
        <PanelHeader>
          <PanelTitle>Démonstration</PanelTitle>
          <p className="text-label text-muted-foreground">
            Pour montrer les états d&apos;erreur sans casser quoi que ce soit.
          </p>
        </PanelHeader>
        <div className="divide-y divide-border">
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
      </Panel>
    </div>
  );
}
