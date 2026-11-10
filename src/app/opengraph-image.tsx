import { ImageResponse } from "next/og";

export const alt = "Pulse — un CRM de démonstration : prospects, pipeline et activité commerciale.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * L'aperçu partagé sur LinkedIn, Slack ou par e-mail. Les couleurs reprennent
 * les jetons du thème sombre (OKLCH converti en hexadécimal : le moteur de
 * rendu des images ne lit pas l'OKLCH).
 */
const INK = "#f3f2f0";
const MUTED = "#a8a6a1";
const CANVAS = "#131210";
const CARD = "#1f1e1b";
const BRAND = "#a5e752";

const BARS = [41, 47, 44, 56, 67, 79, 74, 92];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: CANVAS,
          padding: 72,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: INK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 16 16" fill="none">
                <path
                  d="M1.5 8.5h3L6 5l2.5 6.5L10.5 8h4"
                  stroke={CANVAS}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>Pulse</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 620 }}>
              Le suivi commercial d&apos;une petite équipe.
            </span>
            <span style={{ fontSize: 28, color: MUTED, maxWidth: 600, lineHeight: 1.35 }}>
              Prospects, pipeline, chiffre d&apos;affaires et activité. Une application de démonstration à
              utiliser, pas à regarder.
            </span>
          </div>
        </div>

        <div
          style={{
            width: 380,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: CARD,
            borderRadius: 28,
            padding: 36,
            gap: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 22, color: MUTED }}>Pipeline</span>
            <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em" }}>129 100 €</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 220 }}>
            {BARS.map((height, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  borderRadius: 8,
                  background: index === BARS.length - 1 ? BRAND : "#3a3935",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
