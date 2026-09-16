import { chromium } from "@playwright/test";

const BASE = process.env.PULSE_URL ?? "http://localhost:3100";

/**
 * Sonde de contraste. Chromium rend les couleurs en lab() : il faut convertir
 * en sRGB pour calculer une luminance, et composer les alphas correctement,
 * sans quoi deux calques translucides passent pour un fond opaque.
 * `PULSE_SELFTEST=1` injecte un défaut connu que la sonde doit signaler.
 */
const PROBE = `(() => {
  const D50 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];
  const labToXyz = (L, a, bb) => {
    const fy = (L + 16) / 116, fx = a / 500 + fy, fz = fy - bb / 200;
    const k = 24389 / 27, e = 216 / 24389;
    const x = fx ** 3 > e ? fx ** 3 : (116 * fx - 16) / k;
    const y = L > k * e ? ((L + 16) / 116) ** 3 : L / k;
    const z = fz ** 3 > e ? fz ** 3 : (116 * fz - 16) / k;
    return [x * D50[0], y * D50[1], z * D50[2]];
  };
  const M = [
    [3.1341359569958707, -1.6173863321612538, -0.4906619460083532],
    [-0.978795502912089, 1.9161404090176055, 0.03341436137529839],
    [0.07195537988411677, -0.2289768264158322, 1.405386058324125],
  ];
  const enc = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  const parse = (css) => {
    if (!css || css === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    let m = css.match(/^rgba?\\(([^)]+)\\)/);
    if (m) {
      const n = m[1].split(/[\\s,\\/]+/).filter(Boolean).map(Number);
      return { r: n[0], g: n[1], b: n[2], a: n[3] === undefined ? 1 : n[3] };
    }
    m = css.match(/^lab\\(([^)]+)\\)/);
    if (m) {
      const parts = m[1].split("/");
      const n = parts[0].trim().split(/\\s+/).map(parseFloat);
      const a = parts[1] === undefined ? 1 : parseFloat(parts[1]);
      const [X, Y, Z] = labToXyz(n[0], n[1], n[2]);
      const rgb = M.map((row) => enc(row[0] * X + row[1] * Y + row[2] * Z));
      return {
        r: Math.min(255, Math.max(0, rgb[0] * 255)),
        g: Math.min(255, Math.max(0, rgb[1] * 255)),
        b: Math.min(255, Math.max(0, rgb[2] * 255)),
        a: Number.isNaN(a) ? 1 : a,
      };
    }
    return { r: 0, g: 0, b: 0, a: 0 };
  };
  const over = (fg, bg) => {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a,
    };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const effBg = (el) => {
    let node = el, acc = null;
    while (node && node !== document.documentElement) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg.a > 0) acc = acc ? over(acc, bg) : bg;
      if (acc && acc.a >= 0.999) return acc;
      node = node.parentElement;
    }
    const root = parse(getComputedStyle(document.documentElement).backgroundColor);
    const base = root.a > 0 ? root : { r: 255, g: 255, b: 255, a: 1 };
    return acc ? over(acc, base) : base;
  };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  const out = [];
  for (const el of document.querySelectorAll('button, a, [role="menuitem"], [role="option"], [role="tab"], th, td, dt, dd, p, span, h1, h2, h3, time, label, kbd')) {
    const text = (el.textContent || "").trim();
    if (!text || text.length > 60) continue;
    if (el.querySelector("button, a, p, span, h1, h2, h3, time")) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.9) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const fg = parse(cs.color);
    if (fg.a === 0) continue;
    const bg = effBg(el);
    const r = ratio(over(fg, bg), bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    const floor = large ? 3 : 4.5;
    if (r < floor) {
      out.push({ text: text.slice(0, 40), tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 44), fg: hex(over(fg, bg)), bg: hex(bg), ratio: Math.round(r * 100) / 100, floor });
    }
  }
  return out;
})()`;

const CASES = [
  { path: "/dashboard", label: "vue d'ensemble" },
  { path: "/leads", label: "prospects" },
  { path: "/leads", label: "prospects + sélection", action: "select" },
  { path: "/leads", label: "prospects + dialogue", action: "dialog" },
  { path: "/leads/LD-1001", label: "fiche" },
  { path: "/clients", label: "clients" },
  { path: "/activity", label: "activité" },
  { path: "/settings", label: "réglages" },
];

const browser = await chromium.launch();
let findings = 0;
for (const theme of ["light", "dark"]) {
  for (const c of CASES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, locale: "fr-FR" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${c.path}`);
    await page.waitForLoadState("networkidle");

    if (process.env.PULSE_SELFTEST && c.path === "/dashboard") {
      await page.evaluate(() => {
        const el = document.createElement("button");
        el.textContent = "Temoin de controle";
        el.style.cssText = "position:fixed;top:4px;left:4px;z-index:9999;padding:8px 12px;font-size:14px;background:lab(42.97 33.46 -71.99);color:lab(5.81 1.32 -6.85)";
        document.body.appendChild(el);
      });
    }
    if (c.action === "select") {
      await page.getByRole("checkbox", { name: /Sélectionner toutes/ }).click();
      await page.waitForTimeout(250);
    }
    if (c.action === "dialog") {
      await page.getByRole("button", { name: "Ajouter un prospect" }).click();
      await page.getByRole("dialog").waitFor();
    }

    const bad = await page.evaluate(PROBE);
    if (bad.length) {
      findings += bad.length;
      console.log(`\n### ${theme} — ${c.label}`);
      for (const b of bad) console.log(`  ${b.ratio} (min ${b.floor})  "${b.text}"  ${b.fg} sur ${b.bg}  <${b.tag} class="${b.cls}">`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(findings === 0 ? "\naucun défaut de contraste" : `\n${findings} défauts`);
