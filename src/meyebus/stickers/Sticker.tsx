import React from "react";
import { AbsoluteFill, random } from "remotion";
import { COLORS, FONT } from "../theme";
import { LogoMark, Wordmark } from "../Logo";
import { Icon } from "../ui";
import { QR_SIZE, QR_MODULES } from "./qr-data";

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

// Filled shield with a white check — the certification emblem.
const ShieldCheck: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" fill={COLORS.orange} />
    <path d="M12 2l8 4v6c0 5-3.5 8-8 10z" fill={COLORS.orangeDeep} opacity="0.5" />
    <path d="M8.5 12l2.4 2.4L15.5 9.8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CertPill: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 * scale, background: COLORS.orange, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 30 * scale, padding: `${11 * scale}px ${28 * scale}px`, borderRadius: 100, letterSpacing: 3 * scale }}>
    <ShieldCheck size={30 * scale} />
    CERTIFIÉ
  </div>
);

// Real, scannable QR rendered as vector from the generated matrix, with the
// M'EyeBus badge in the center (error-correction H tolerates the overlay).
const QRBranded: React.FC<{ size: number; label?: string }> = ({ size, label = "Scannez-moi" }) => {
  const quiet = 2; // quiet-zone in modules
  const n = QR_SIZE + quiet * 2;
  const cell = size / n;
  const logoBox = Math.round(QR_SIZE * 0.26) * cell; // white knockout for the logo
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", background: "#fff", padding: cell * 1.4, borderRadius: 22, boxShadow: "0 10px 28px rgba(0,0,0,0.12)" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges">
          <rect width={size} height={size} fill="#fff" />
          {Array.from({ length: QR_SIZE }).map((_, y) =>
            Array.from({ length: QR_SIZE }).map((_, x) => {
              if (!QR_MODULES[y * QR_SIZE + x]) return null;
              return <rect key={`${x}-${y}`} x={(x + quiet) * cell} y={(y + quiet) * cell} width={cell + 0.5} height={cell + 0.5} fill={COLORS.navy} />;
            }),
          )}
        </svg>
        {/* center logo knockout */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: logoBox, height: logoBox, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 3px #fff" }}>
          <LogoMark size={logoBox * 0.82} showText={false} />
        </div>
      </div>
      {label ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.1, color: COLORS.navy, letterSpacing: 0.5 }}>{label}</span> : null}
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

// ================================================== A — MACARON CERTIFIÉ (900×900)
// Scalloped trust seal. Emotional/parents tone with a certification cue.
const SealRing: React.FC = () => {
  const cx = 450, cy = 450;
  const scallops = 36;
  return (
    <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: "absolute", inset: 0 }}>
      {/* scalloped navy edge */}
      {Array.from({ length: scallops }).map((_, i) => {
        const a = (i / scallops) * Math.PI * 2;
        return <circle key={i} cx={cx + Math.cos(a) * 424} cy={cy + Math.sin(a) * 424} r={26} fill={COLORS.navy} />;
      })}
      <circle cx={cx} cy={cy} r={430} fill={COLORS.navy} />
      <circle cx={cx} cy={cy} r={414} fill="#fff" />
      <circle cx={cx} cy={cy} r={402} fill={COLORS.orange} />
      <circle cx={cx} cy={cy} r={392} fill="#fff" />
      {/* dashed inner accent */}
      <circle cx={cx} cy={cy} r={362} fill="none" stroke={COLORS.orange} strokeWidth={3} strokeDasharray="4 12" opacity={0.6} />
    </svg>
  );
};

export const MacaronCertifie: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 900, height: 900, filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.25))" }}>
      <SealRing />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 120 }}>
        <div style={{ color: COLORS.navy, fontWeight: 800, fontSize: 30, letterSpacing: 6, opacity: 0.8 }}>★ TRANSPORT SCOLAIRE ★</div>
        <div style={{ margin: "14px 0 6px" }}><ShieldCheck size={132} /></div>
        <Wordmark size={58} color={COLORS.navy} />
        <div style={{ margin: "16px 0 14px" }}><CertPill /></div>
        <div style={{ color: COLORS.navy, fontWeight: 900, fontSize: 46, textAlign: "center", lineHeight: 1.05, letterSpacing: -0.5, maxWidth: 560 }}>
          Vos enfants,<br />sous bonne garde.
        </div>
        <div style={{ marginTop: 12, color: COLORS.textMuted, fontWeight: 700, fontSize: 28 }}>Suivi en temps réel</div>
      </AbsoluteFill>
    </div>
  </AbsoluteFill>
);

// A — MACARON, version « accroche + QR » : phrase parents forte + QR à scanner.
export const MacaronApp: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 900, height: 900, filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.25))" }}>
      <SealRing />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 96 }}>
        <div style={{ color: COLORS.navy, fontWeight: 800, fontSize: 24, letterSpacing: 5, opacity: 0.75 }}>
          ★ TRANSPORT SCOLAIRE ★
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16 }}>
          <Wordmark size={58} color={COLORS.navy} />
          <CertPill scale={0.72} />
        </div>
        <div style={{ marginTop: 22, color: COLORS.navy, fontWeight: 900, fontSize: 60, textAlign: "center", lineHeight: 1.0, letterSpacing: -1 }}>
          Où est le bus ?<br /><span style={{ color: COLORS.orange }}>Vous le savez.</span>
        </div>
        <div style={{ marginTop: 14, color: COLORS.textMuted, fontWeight: 700, fontSize: 27, textAlign: "center", maxWidth: 700 }}>
          Le trajet de votre enfant, en direct.
        </div>
        <div style={{ marginTop: 26 }}>
          <QRBranded size={188} label="Scannez pour suivre le bus" />
        </div>
      </AbsoluteFill>
    </div>
  </AbsoluteFill>
);

// ================================================== B — BANDEAU NOTORIÉTÉ (1600×520)
export const BannerNotoriete: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 1560, height: 500, borderRadius: 44, background: `linear-gradient(120deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden", display: "flex", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `${COLORS.blue}33`, filter: "blur(90px)", left: -180, top: -200 }} />
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `${COLORS.orange}30`, filter: "blur(90px)", right: -140, bottom: -200 }} />
      {/* left: XXL logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 56px 0 66px", gap: 14 }}>
        <div style={{ background: "#fff", borderRadius: 40, padding: 26 }}>
          <LogoMark size={190} showText={false} />
        </div>
        <Wordmark size={54} color="#fff" />
      </div>
      {/* right: emotional message */}
      <div style={{ flex: 1, color: "#fff", paddingRight: 56 }}>
        <div style={{ marginBottom: 16 }}><CertPill scale={0.95} /></div>
        <div style={{ fontWeight: 900, fontSize: 82, letterSpacing: -2, lineHeight: 0.98 }}>Vos enfants,<br />sous bonne garde.</div>
        <div style={{ marginTop: 16, fontWeight: 700, fontSize: 34, color: "rgba(255,255,255,0.78)" }}>
          Transport scolaire suivi en temps réel.
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

// ================================================== C — CO-BRANDÉ ÉCOLE (1600×640)
// Placeholder school crest — swap for the partner school's real logo.
const SchoolCrest: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ width: 190, height: 190, borderRadius: 28, background: "#EEF2F8", border: `3px dashed ${COLORS.textMuted}66`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
      <Icon name="home" size={64} color={COLORS.navy} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: COLORS.textMuted }}>Logo école</span>
    </div>
    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COLORS.navy, maxWidth: 300, textAlign: "center", lineHeight: 1.1 }}>{name}</span>
  </div>
);

export const CoBrand: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 1560, height: 600, borderRadius: 44, background: "#fff", border: `3px solid ${COLORS.line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.18)", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.blue})` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "70px 60px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <SchoolCrest name="Groupe Scolaire Les Cèdres" />
          <span style={{ fontWeight: 300, fontSize: 90, color: COLORS.textMuted }}>×</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <LogoMark size={190} showText={false} />
            <Wordmark size={54} color={COLORS.navy} />
          </div>
        </div>
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 18 }}>
          <CertPill scale={0.9} />
          <span style={{ fontWeight: 900, fontSize: 46, color: COLORS.navy, letterSpacing: -0.5 }}>École partenaire — vos enfants, sous bonne garde.</span>
        </div>
      </AbsoluteFill>
    </div>
  </AbsoluteFill>
);
