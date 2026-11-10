import { expect, test, type Page } from "@playwright/test";

/**
 * L'état de chaque visiteur vit dans ses cookies : chaque test démarre dans un
 * contexte de navigateur neuf, donc avec le jeu de données initial. Les
 * scénarios restent écrits sans supposer l'ordre dans lequel ils s'exécutent.
 */
const RUN = `${Date.now().toString(36)}`;

/**
 * Ouvre une route et attend que la page soit réellement interactive : au tout
 * premier chargement d'un serveur fraîchement démarré, un clic envoyé avant
 * l'hydratation ne déclenche aucun gestionnaire React.
 */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

/** Le tiroir remplace le rail sous 1024 px : la navigation diffère. */
async function goToDestination(page: Page, name: string | RegExp) {
  const isMobile = (page.viewportSize()?.width ?? 1280) < 1024;
  if (isMobile) {
    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
  }
  await page.getByRole("navigation", { name: "Destinations" }).getByRole("link", { name }).click();
}

test.describe("Pulse", () => {
  test("Scénario 1 — la vue d'ensemble s'affiche avec ses quatre indicateurs", async ({ page }) => {
    await open(page, "/");
    await expect(page).toHaveURL(/\/dashboard$/);

    await expect(page.getByRole("heading", { level: 1, name: "Vue d'ensemble" })).toBeVisible();

    for (const label of ["Chiffre d'affaires", "Pipeline", "Prospects", "Conversion"]) {
      await expect(page.getByRole("heading", { level: 3, name: label })).toBeVisible();
    }

    // Le graphique expose ses chiffres à l'assistance technique.
    await expect(
      page.getByRole("table", { name: /Chiffre d'affaires mensuel/ }),
    ).toBeAttached();

    await expect(page.getByRole("heading", { name: "Pipeline par étape" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Prospects récents" })).toBeVisible();
  });

  test("Scénario 2 — la navigation mène au tableau des prospects", async ({ page }) => {
    await open(page, "/dashboard");
    await goToDestination(page, "Prospects");

    await expect(page).toHaveURL(/\/leads$/);
    await expect(page.getByRole("heading", { level: 1, name: "Prospects" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("Scénario 3 — le filtre « Qualifié » ne laisse que des qualifiés", async ({ page }) => {
    await open(page, "/leads");

    await page.getByRole("button", { name: /Étape/ }).click();
    await page.getByRole("menuitemcheckbox", { name: "Qualifié" }).click();
    await page.keyboard.press("Escape");

    const rows = page.getByRole("row").filter({ hasNot: page.getByRole("columnheader") });
    await expect(rows.first()).toBeVisible();

    const badges = page.getByRole("cell").getByText(/^(Nouveau|Contacté|Qualifié|Proposition|Gagné|Perdu)$/);
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(badges.nth(index)).toHaveText("Qualifié");
    }

    // Le compteur relit la sélection en même temps que le tableau.
    await expect(page.getByText(/\d+ \/ \d+ prospects/)).toBeVisible();
  });

  test("Scénario 4 — la création d'un prospect valide puis enregistre", async ({
    page,
  }, testInfo) => {
    const lastName = `Marchetti-${testInfo.project.name}-${RUN}`;
    await open(page, "/leads");
    await page.getByRole("button", { name: "Ajouter un prospect" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Nouveau prospect" })).toBeVisible();

    // Un e-mail invalide est refusé et le message s'affiche sous le champ.
    await dialog.getByLabel(/^Prénom/).fill("Lucie");
    await dialog.getByLabel(/^Nom/).fill(lastName);
    await dialog.getByLabel(/^Entreprise/).fill("Atelier Marchetti");
    await dialog.getByLabel(/^E-mail/).fill("pas-un-email");
    await dialog.getByLabel(/Montant estimé/).fill("3200");
    await dialog.getByRole("button", { name: "Créer le prospect" }).click();

    await expect(
      dialog.getByText("Saisissez une adresse e-mail valide, par exemple nom@entreprise.fr."),
    ).toBeVisible();

    await dialog.getByLabel(/^E-mail/).fill("lucie@atelier-marchetti.fr");
    await dialog.getByRole("button", { name: "Créer le prospect" }).click();

    await expect(page.getByText("Prospect créé.")).toBeVisible();
    await expect(dialog).not.toBeVisible();

    await page.getByRole("searchbox", { name: /Rechercher un prospect par nom/ }).fill(lastName);
    await expect(page.getByRole("link", { name: `Lucie ${lastName}` })).toBeVisible();
  });

  test("Scénario 5 — la fiche d'un prospect s'ouvre depuis le tableau", async ({ page }) => {
    await open(page, "/leads");
    await page.getByRole("searchbox", { name: /Rechercher un prospect par nom/ }).fill("Emma");

    await page.getByRole("link", { name: "Emma Laurent" }).click();

    await expect(page).toHaveURL(/\/leads\/LD-1001$/);
    await expect(page.getByRole("heading", { level: 1, name: "Emma Laurent" })).toBeVisible();
    await expect(page.getByText("Studio Bloom").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Informations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Historique" })).toBeVisible();
  });

  test("Scénario 6 — changer l'étape met à jour la fiche et l'historique", async ({ page }) => {
    await open(page, "/leads/LD-1002");

    const select = page.getByLabel("Étape", { exact: true });
    // L'étape courante n'est lisible qu'une fois le composant hydraté.
    await expect(select).toHaveText(/\S/);
    const current = (await select.textContent())?.trim();
    // On vise une étape différente de celle affichée, quel que soit l'ordre
    // dans lequel les scénarios ont déjà touché cette fiche.
    const target = current === "Gagné" ? "Proposition" : "Gagné";

    await select.click();
    await page.getByRole("option", { name: target, exact: true }).click();

    await expect(page.getByText(`Étape mise à jour : ${target}.`)).toBeVisible();
    await expect(select).toHaveText(target);

    // Un évènement daté s'est écrit dans l'historique.
    await expect(page.getByText("Étape modifiée").first()).toBeVisible();
  });

  test("Scénario 7 — une note s'ajoute à la fiche", async ({ page }, testInfo) => {
    const body = `Relance effectuée, rappel prévu lundi (${testInfo.project.name}-${RUN}).`;
    await open(page, "/leads/LD-1004");

    await page.getByLabel("Ajouter une note").fill(body);
    await page.getByRole("button", { name: "Enregistrer la note" }).click();

    await expect(page.getByText("Note enregistrée.")).toBeVisible();
    await expect(page.getByText(body).first()).toBeVisible();
  });

  test("Scénario 8 — les filtres sans résultat affichent leur état vide", async ({ page }) => {
    await open(page, "/leads");

    await page
      .getByRole("searchbox", { name: /Rechercher un prospect par nom/ })
      .fill("zzz-introuvable");

    await expect(page.getByText("Aucun prospect ne correspond à vos filtres.")).toBeVisible();

    await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });
});

test.describe("Démonstration publique", () => {
  test("Scénario 10 — une suppression groupée s'annule depuis le toast", async ({ page }) => {
    await open(page, "/leads");
    await expect(page.getByText("45 / 45 prospects")).toBeVisible();

    await page.getByRole("checkbox", { name: "Sélectionner toutes les lignes de la page" }).click();
    await page.getByRole("region", { name: "Actions sur la sélection" }).getByRole("button", { name: "Supprimer" }).click();

    await expect(page.getByText("10 prospects supprimés.")).toBeVisible();
    await expect(page.getByText("35 / 35 prospects")).toBeVisible();

    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByText("10 prospects restaurés.")).toBeVisible();
    await expect(page.getByText("45 / 45 prospects")).toBeVisible();
  });

  test("Scénario 11 — ce qu'un visiteur supprime, un autre le voit encore", async ({ browser }) => {
    const first = await browser.newContext();
    const second = await browser.newContext();
    const visitor = await first.newPage();
    const recruiter = await second.newPage();

    await open(visitor, "/leads");
    await visitor.getByRole("checkbox", { name: "Sélectionner toutes les lignes de la page" }).click();
    await visitor.getByRole("region", { name: "Actions sur la sélection" }).getByRole("button", { name: "Supprimer" }).click();
    await expect(visitor.getByText("35 / 35 prospects")).toBeVisible();

    await open(recruiter, "/leads");
    await expect(recruiter.getByText("45 / 45 prospects")).toBeVisible();

    await first.close();
    await second.close();
  });

  test("Scénario 14 — un prospect créé survit au rechargement et s'ouvre", async ({ page }, testInfo) => {
    const lastName = `Durable-${testInfo.project.name}-${RUN}`;
    await open(page, "/leads");
    await page.getByRole("button", { name: "Ajouter un prospect" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/^Prénom/).fill("Inès");
    await dialog.getByLabel(/^Nom/).fill(lastName);
    await dialog.getByLabel(/^Entreprise/).fill("Atelier Durable");
    await dialog.getByLabel(/^E-mail/).fill("ines@atelier-durable.fr");
    await dialog.getByLabel(/Montant estimé/).fill("2400");
    await dialog.getByRole("button", { name: "Créer le prospect" }).click();
    await expect(page.getByText("Prospect créé.")).toBeVisible();
    await expect(page.getByText("46 / 46 prospects")).toBeVisible();

    // Un rendu serveur complet, éventuellement par une autre instance.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("46 / 46 prospects")).toBeVisible();

    await page.getByRole("searchbox", { name: /Rechercher un prospect par nom/ }).fill(lastName);
    await page.getByRole("link", { name: `Inès ${lastName}` }).click();
    await expect(page.getByRole("heading", { level: 1, name: `Inès ${lastName}` })).toBeVisible();
  });

  test("Scénario 12 — la vue d'ensemble est datée du jour", async ({ page }) => {
    await open(page, "/dashboard");
    const today = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(new Date());
    const yesterday = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(new Date(Date.now() - 86_400_000));
    // Avant l'heure du dernier évènement du jeu, la démonstration se date de la veille.
    await expect(page.getByText(new RegExp(`L'état du portefeuille au (${today}|${yesterday})`))).toBeVisible();
  });
});

test.describe("Navigation mobile", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 1280) >= 1024, "Le tiroir n'existe qu'en mobile.");

  test("Scénario 9 — le tiroir ouvre, navigue, puis se referme", async ({ page }) => {
    await open(page, "/dashboard");

    const trigger = page.getByRole("button", { name: "Ouvrir la navigation" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const drawer = page.getByRole("dialog", { name: "Navigation principale" });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Clients" }).click();

    await expect(page).toHaveURL(/\/clients$/);
    await expect(drawer).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Clients" })).toBeVisible();
  });

  test("Scénario 13 — le tiroir se referme d'un glissement vers la gauche", async ({ page }) => {
    await open(page, "/dashboard");
    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();

    const drawer = page.getByRole("dialog", { name: "Navigation principale" });
    await expect(drawer).toBeVisible();
    // On laisse l'animation d'entrée finir avant de saisir le tiroir.
    await page.waitForTimeout(300);

    const box = await drawer.boundingBox();
    if (!box) throw new Error("Le tiroir n'a pas de boîte.");
    const y = box.y + box.height * 0.75;
    await page.mouse.move(box.x + box.width - 40, y);
    await page.mouse.down();
    for (let step = 1; step <= 8; step += 1) {
      await page.mouse.move(box.x + box.width - 40 - step * 30, y);
    }
    await page.mouse.up();

    await expect(drawer).not.toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
