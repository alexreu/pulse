import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PULSE_URL ?? "http://127.0.0.1:3100";

/**
 * Captures de revue et captures de portfolio.
 * `action` permet d'ouvrir une boîte de dialogue avant la prise de vue.
 */
const SHOTS = [
  { file: ".impeccable/review/desktop.png", path: "/dashboard", w: 1440, h: 900, full: true },
  { file: ".impeccable/review/desktop-leads.png", path: "/leads", w: 1440, h: 900 },
  { file: ".impeccable/review/desktop-dark.png", path: "/dashboard", w: 1440, h: 900, theme: "dark", full: true },
  { file: ".impeccable/review/desktop-detail.png", path: "/leads/LD-1001", w: 1440, h: 900, full: true },
  { file: ".impeccable/review/desktop-dialog.png", path: "/leads", w: 1440, h: 900, action: "dialog" },
  { file: ".impeccable/review/desktop-dropdown.png", path: "/leads", w: 1440, h: 900, action: "stage" },
  { file: ".impeccable/review/desktop-clients.png", path: "/clients", w: 1440, h: 900 },
  { file: ".impeccable/review/desktop-activity.png", path: "/activity", w: 1440, h: 900 },
  { file: ".impeccable/review/desktop-settings.png", path: "/settings", w: 1440, h: 900, full: true },
  { file: ".impeccable/review/mobile.png", path: "/dashboard", phone: true, full: true },
  { file: ".impeccable/review/mobile-leads.png", path: "/leads", phone: true },
  { file: ".impeccable/review/mobile-nav.png", path: "/dashboard", phone: true, action: "nav" },
  { file: ".impeccable/review/mobile-dark.png", path: "/leads", phone: true, theme: "dark" },

  { file: "docs/screenshots/01-dashboard.png", path: "/dashboard", w: 1440, h: 980, full: true },
  { file: "docs/screenshots/02-leads.png", path: "/leads", w: 1440, h: 980 },
  { file: "docs/screenshots/03-add-lead.png", path: "/leads", w: 1440, h: 980, action: "dialog" },
  { file: "docs/screenshots/04-lead-detail.png", path: "/leads/LD-1001", w: 1440, h: 980, full: true },
  { file: "docs/screenshots/05-dark-mode.png", path: "/dashboard", w: 1440, h: 980, theme: "dark", full: true },
  { file: "docs/screenshots/06-mobile.png", path: "/leads", phone: true, full: true },
];

await mkdir(".impeccable/review", { recursive: true });
await mkdir("docs/screenshots", { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const shot of SHOTS) {
  const context = await browser.newContext({
    ...(shot.phone ? devices["Pixel 7"] : { viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 2 }),
    colorScheme: shot.theme ?? "light",
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${BASE}${shot.path}`);
  await page.waitForLoadState("networkidle");

  if (shot.action === "dialog") {
    await page.getByRole("button", { name: "Ajouter un prospect" }).click();
    await page.getByRole("dialog").waitFor();
  }
  if (shot.action === "stage") {
    await page.getByRole("button", { name: /Étape/ }).click();
    await page.getByRole("menu").waitFor();
  }
  if (shot.action === "nav") {
    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
    await page.getByRole("dialog", { name: "Navigation principale" }).waitFor();
  }

  // Les animations d'entrée sont figées avant la prise de vue : un élément
  // masqué par le minutage d'une animation se lirait comme un élément absent.
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important}" +
      "nextjs-portal{display:none!important}",
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot.file, fullPage: Boolean(shot.full) });

  if (errors.length) problems.push(`${shot.file} :: ${errors.join(" | ")}`);
  await context.close();
}

await browser.close();
console.log(`${SHOTS.length} captures`);
if (problems.length) {
  console.log("ERREURS CONSOLE:");
  for (const problem of problems) console.log(" -", problem);
} else {
  console.log("aucune erreur console");
}
