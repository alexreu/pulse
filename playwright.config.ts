import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
/**
 * `E2E_BASE_URL` vise un serveur déjà lancé, par exemple la topologie
 * « à la Vercel » de `scripts/split-proxy.mjs`, où l'API et les pages
 * tournent dans deux processus qui ne partagent pas leur mémoire.
 */
const EXTERNAL_URL = process.env.E2E_BASE_URL;
const BASE_URL = EXTERNAL_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: EXTERNAL_URL
    ? undefined
    : {
        // L'état vit dans les cookies du navigateur : chaque test, dans un
        // contexte neuf, repart du jeu de données initial.
        command: `npm run build && npm run start -- --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: false,
        timeout: 240_000,
      },
});
