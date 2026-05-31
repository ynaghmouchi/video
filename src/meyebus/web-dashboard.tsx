import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT } from "./theme";
import { Icon } from "./ui";
import { RealLogo } from "./assets";

const Reveal: React.FC<{ delay: number; x?: number; y?: number; children: React.ReactNode }> = ({ delay, x = 0, y = 18, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 17, mass: 0.8 } });
  return <div style={{ opacity: s, transform: `translate(${(1 - s) * x}px, ${(1 - s) * y}px)` }}>{children}</div>;
};

// macOS-style browser window wrapping a desktop web app.
export const BrowserFrame: React.FC<{ width: number; height: number; url?: string; children: React.ReactNode }> = ({
  width,
  height,
  url = "app.meyebus.ma/tableau-de-bord",
  children,
}) => (
  <div style={{ width, height, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 50px 110px rgba(0,0,0,0.55)", fontFamily: FONT }}>
    <div style={{ height: 66, background: "#E9EEF5", display: "flex", alignItems: "center", padding: "0 26px", gap: 18, borderBottom: "1px solid #D7DEE8" }}>
      <div style={{ display: "flex", gap: 11 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 17, height: 17, borderRadius: 17, background: c }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 32px", fontSize: 23, color: "#5B6B7E", display: "flex", alignItems: "center", gap: 12, minWidth: "58%", justifyContent: "center", border: "1px solid #DCE3EC" }}>
          <Icon name="shield" size={19} color="#28C840" /> {url}
        </div>
      </div>
    </div>
    <div style={{ height: height - 66, display: "flex" }}>{children}</div>
  </div>
);

const navItems: { icon: Parameters<typeof Icon>[0]["name"]; label: string; active?: boolean }[] = [
  { icon: "home", label: "Tableau de bord", active: true },
  { icon: "bus", label: "Bus" },
  { icon: "user", label: "Chauffeurs" },
  { icon: "shield", label: "Élèves" },
  { icon: "pin", label: "Arrêts" },
  { icon: "navigation", label: "Suivi live" },
];

const stats: { v: string; l: string; t: string; ic: Parameters<typeof Icon>[0]["name"] }[] = [
  { v: "8", l: "Bus actifs", t: COLORS.blue, ic: "bus" },
  { v: "240", l: "Élèves", t: COLORS.orange, ic: "shield" },
  { v: "98%", l: "À l’heure", t: COLORS.green, ic: "clock" },
  { v: "0", l: "Alertes", t: COLORS.navy, ic: "navigation" },
];

const fleet: { n: string; line: string; status: string; tint: string }[] = [
  { n: "12", line: "Ligne Salé Centre", status: "En route", tint: COLORS.green },
  { n: "07", line: "Ligne Médina", status: "À l’arrêt", tint: COLORS.blue },
  { n: "03", line: "Ligne Hassan", status: "En route", tint: COLORS.green },
  { n: "21", line: "Ligne Agdal", status: "Retard 4 min", tint: COLORS.red },
];

export const AdminDashboardWeb: React.FC = () => {
  const frame = useCurrentFrame();
  const buses = [
    { x: 80, y: 60, d: 0 },
    { x: 250, y: 120, d: 1.7 },
    { x: 150, y: 200, d: 3.1 },
    { x: 330, y: 170, d: 4.4 },
  ];
  return (
    <>
      {/* Sidebar */}
      <div style={{ width: 252, background: `linear-gradient(180deg, ${COLORS.navy}, ${COLORS.navyDeep})`, padding: "28px 18px", color: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 34, padding: "0 6px" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 6, display: "flex" }}>
            <RealLogo width={34} />
          </div>
          <span style={{ fontSize: 25, fontWeight: 800 }}>M’EyeBus</span>
        </div>
        {navItems.map((n, i) => (
          <Reveal key={i} delay={4 + i * 3} x={-18} y={0}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderRadius: 14, marginBottom: 6, background: n.active ? "rgba(255,255,255,0.13)" : "transparent", position: "relative" }}>
              {n.active ? <span style={{ position: "absolute", left: 0, top: 11, bottom: 11, width: 4, borderRadius: 4, background: COLORS.orange }} /> : null}
              <Icon name={n.icon} size={24} color={n.active ? "#fff" : "rgba(255,255,255,0.6)"} />
              <span style={{ fontSize: 21, fontWeight: n.active ? 800 : 600, color: n.active ? "#fff" : "rgba(255,255,255,0.72)" }}>{n.label}</span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: "#F4F7FB", padding: "30px 34px", overflow: "hidden" }}>
        <Reveal delay={2}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 35, fontWeight: 800, color: COLORS.text }}>Tableau de bord</div>
              <div style={{ fontSize: 21, color: COLORS.textMuted, marginTop: 4 }}>École Al Manar</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 100, padding: "12px 22px", fontSize: 20, fontWeight: 700, color: COLORS.text }}>
              <span style={{ width: 12, height: 12, borderRadius: 12, background: COLORS.green }} /> En direct
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginTop: 24 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={6 + i * 3}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 22, boxShadow: "0 10px 26px rgba(14,42,71,0.06)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.t}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.ic} size={24} color={s.t} />
                </div>
                <div style={{ fontSize: 42, fontWeight: 800, color: s.t, marginTop: 14 }}>{s.v}</div>
                <div style={{ fontSize: 19, color: COLORS.textMuted }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
          {/* Fleet map */}
          <Reveal delay={16}>
            <div style={{ width: 430, height: 300, borderRadius: 22, background: COLORS.mapBg, position: "relative", overflow: "hidden", boxShadow: "0 12px 30px rgba(14,42,71,0.07)" }}>
              <svg width="100%" height="100%" viewBox="0 0 430 300" style={{ position: "absolute", inset: 0 }}>
                <rect x="20" y="30" width="140" height="90" rx="18" fill={COLORS.mapGreen} />
                <rect x="280" y="180" width="130" height="100" rx="18" fill={COLORS.mapGreen} />
                {[100, 210].map((y) => <line key={y} x1="0" y1={y} x2="430" y2={y} stroke="#fff" strokeWidth="11" opacity="0.7" />)}
                {[140, 300].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#fff" strokeWidth="11" opacity="0.7" />)}
              </svg>
              {buses.map((b, i) => {
                const dx = Math.sin(frame / 22 + b.d) * 14;
                const pulse = 0.5 + 0.5 * Math.sin(frame / 6 + b.d);
                return (
                  <div key={i} style={{ position: "absolute", left: b.x + dx, top: b.y, transform: "translate(-50%,-50%)" }}>
                    <span style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, borderRadius: 40, background: COLORS.blue, opacity: 0.16 * (1 - pulse), transform: "translate(-50%,-50%)" }} />
                    <div style={{ width: 36, height: 36, borderRadius: 36, background: "#fff", border: `4px solid ${COLORS.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="bus" size={18} color={COLORS.blue} />
                    </div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.92)", borderRadius: 12, padding: "8px 14px", fontSize: 18, fontWeight: 800, color: COLORS.navy, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 10, background: COLORS.red }} /> Flotte en direct
              </div>
            </div>
          </Reveal>

          {/* Fleet list */}
          <Reveal delay={20} x={26}>
            <div style={{ width: 250, height: 300, background: "#fff", borderRadius: 22, padding: "8px 18px", boxShadow: "0 12px 30px rgba(14,42,71,0.06)" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, padding: "14px 4px 8px" }}>Bus en service</div>
              {fleet.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: i < 3 ? `1px solid ${COLORS.line}` : "none" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, lineHeight: 1 }}>BUS</span>
                    <span style={{ fontSize: 18, color: COLORS.navy, fontWeight: 800, lineHeight: 1.1 }}>{f.n}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.line}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 8, background: f.tint }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: f.tint }}>{f.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
};
