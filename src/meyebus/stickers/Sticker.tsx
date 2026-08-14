import React from "react";
import { AbsoluteFill, random } from "remotion";
import { COLORS, FONT } from "../theme";
import { LogoMark, Wordmark } from "../Logo";
import { Icon } from "../ui";

// ---------------------------------------------------------------------------
// Print-ready marketing stickers for partner buses. Pure vector → scale to any
// physical size without pixelation. Render to PNG via the CharacterPreview
// pipeline (see Root.tsx) or export the SVG for a print shop.
// ---------------------------------------------------------------------------

// Decorative QR placeholder (finder patterns + modules). NOT a real code —
// drop the app's actual QR PNG here before printing.
const QRPlaceholder: React.FC<{ size: number; label?: string }> = ({ size, label = "Scannez-moi" }) => {
  const n = 11;
  const cell = size / n;
  const finder = (cx: number, cy: number) => (
    <>
      <rect x={cx * cell} y={cy * cell} width={cell * 3} height={cell * 3} fill={COLORS.navy} />
      <rect x={(cx + 0.5) * cell} y={(cy + 0.5) * cell} width={cell * 2} height={cell * 2} fill="#fff" />
      <rect x={(cx + 1) * cell} y={(cy + 1) * cell} width={cell} height={cell} fill={COLORS.navy} />
    </>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ background: "#fff", padding: cell * 0.8, borderRadius: 18, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: n }).map((_, y) =>
            Array.from({ length: n }).map((_, x) => {
              const isFinder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
              if (isFinder) return null;
              return random(`${x}-${y}`) > 0.5 ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={COLORS.navy} /> : null;
            }),
          )}
          {finder(0, 0)}
          {finder(n - 3, 0)}
          {finder(0, n - 3)}
        </svg>
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.11, color: COLORS.navy, letterSpacing: 1 }}>{label}</span>
    </div>
  );
};

const LiveBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 * scale, background: COLORS.red, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 30 * scale, padding: `${12 * scale}px ${26 * scale}px`, borderRadius: 100, letterSpacing: 2 }}>
    <span style={{ width: 16 * scale, height: 16 * scale, borderRadius: "50%", background: "#fff" }} />
    EN DIRECT
  </div>
);

const StoreLine: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * scale, fontFamily: FONT, fontWeight: 700, fontSize: 26 * scale, color: COLORS.textMuted }}>
    <Icon name="navigation" size={26 * scale} color={COLORS.orange} />
    Gratuit sur iOS &amp; Android
  </div>
);

// ========================================================= ROUND STICKER (1080×1080)
export const StickerRound: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 1040, height: 1040, borderRadius: "50%", background: "#fff", border: `26px solid ${COLORS.orange}`, boxShadow: "0 30px 80px rgba(0,0,0,0.25)", overflow: "hidden" }}>
      {/* inner navy ring */}
      <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: `4px solid ${COLORS.navy}22` }} />
      {/* soft brand glow */}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `${COLORS.blue}12`, filter: "blur(80px)", left: -120, top: -120 }} />
      <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", background: `${COLORS.orange}14`, filter: "blur(80px)", right: -120, bottom: -160 }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "space-between", padding: "82px 70px 104px", fontFamily: FONT }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <LiveBadge />
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={128} showText={false} />
            <Wordmark size={70} color={COLORS.navy} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 66, color: COLORS.navy, letterSpacing: -1.5, textAlign: "center", lineHeight: 1.02 }}>
            CE BUS EST<br />SUIVI EN<br />TEMPS RÉEL
          </div>
          <div style={{ marginTop: 16, fontWeight: 700, fontSize: 32, color: COLORS.textMuted, textAlign: "center", maxWidth: 700 }}>
            Parents, suivez le trajet de votre enfant en direct.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <QRPlaceholder size={150} />
          <div style={{ height: 150, width: 2, background: COLORS.line }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <StoreLine />
            <div style={{ fontWeight: 900, fontSize: 34, color: COLORS.orange }}>meyebus.app</div>
          </div>
        </div>
      </AbsoluteFill>
    </div>
  </AbsoluteFill>
);

// ========================================================= BANNER (1600×520)
export const StickerBanner: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 1560, height: 500, borderRadius: 44, background: `linear-gradient(120deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden", display: "flex", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", background: `${COLORS.blue}33`, filter: "blur(90px)", left: -160, top: -180 }} />
      <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", background: `${COLORS.orange}2E`, filter: "blur(90px)", right: -120, bottom: -180 }} />
      {/* left: logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 50px 0 60px", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 32, padding: 20 }}>
          <LogoMark size={150} showText={false} />
        </div>
        <Wordmark size={44} color="#fff" />
      </div>
      {/* middle: message */}
      <div style={{ flex: 1, color: "#fff" }}>
        <div style={{ marginBottom: 14 }}><LiveBadge scale={0.9} /></div>
        <div style={{ fontWeight: 900, fontSize: 74, letterSpacing: -1.5, lineHeight: 1 }}>Bus suivi en<br />temps réel</div>
        <div style={{ marginTop: 14, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.75)" }}>
          Suivez ce trajet en direct — téléchargez M'EyeBus.
        </div>
      </div>
      {/* right: QR */}
      <div style={{ padding: "0 56px" }}>
        <QRPlaceholder size={210} label="Scannez pour suivre" />
      </div>
    </div>
  </AbsoluteFill>
);
