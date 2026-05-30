import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS } from "./theme";
import { StatusBar } from "./PhoneFrame";
import { Avatar, Icon } from "./ui";

const Reveal: React.FC<{ delay: number; x?: number; children: React.ReactNode }> = ({ delay, x = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 17, mass: 0.8 } });
  return <div style={{ opacity: s, transform: `translate(${(1 - s) * x}px, ${(1 - s) * 24}px)` }}>{children}</div>;
};

// ----------------------------------------------------------------- Élève
export const EleveScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const steps = [
    { c: COLORS.green, t: "Montée au bus", s: "Confirmée • 07:58", done: true },
    { c: COLORS.blue, t: "En route vers l’école", s: "Bus 12 • en direct", live: true },
    { c: COLORS.textMuted, t: "Arrivée à l’école", s: "Prévue • 08:32", done: false },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: "12px 36px" }}>
        <Reveal delay={2}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navy})`, borderRadius: 26, padding: 26, color: "#fff", display: "flex", alignItems: "center", gap: 20, boxShadow: `0 20px 40px ${COLORS.blue}33` }}>
            <Avatar initials="AB" size={78} bg={COLORS.orange} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>Aïcha Benali</div>
              <div style={{ fontSize: 21, opacity: 0.85, marginTop: 4 }}>École Al Manar • 5ᵉ B</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={8}>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, margin: "30px 4px 18px" }}>Trajet du jour</div>
        </Reveal>

        <div style={{ background: COLORS.white, borderRadius: 24, padding: "10px 26px", boxShadow: "0 12px 30px rgba(14,42,71,0.08)" }}>
          {steps.map((st, i) => (
            <Reveal key={i} delay={12 + i * 6} x={30}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 0", borderBottom: i < 2 ? `1px solid ${COLORS.line}` : "none" }}>
                <div style={{ position: "relative", width: 40, display: "flex", justifyContent: "center" }}>
                  {st.live ? <span style={{ position: "absolute", width: 40, height: 40, borderRadius: 40, background: st.c, opacity: 0.18 * (1 - pulse) + 0.06 }} /> : null}
                  <div style={{ width: st.done || st.live ? 34 : 26, height: st.done || st.live ? 34 : 26, borderRadius: 40, background: st.done ? st.c : st.live ? st.c : "transparent", border: st.live || st.done ? "none" : `3px solid ${COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {st.done ? <Icon name="check" size={20} color="#fff" strokeWidth={3} /> : st.live ? <Icon name="bus" size={18} color="#fff" /> : null}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: st.done || st.live ? COLORS.text : COLORS.textMuted }}>{st.t}</div>
                  <div style={{ fontSize: 20, color: COLORS.textMuted, marginTop: 3 }}>{st.s}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={34}>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, background: COLORS.greenSoft, borderRadius: 22, padding: "22px 26px" }}>
            <Icon name="shield" size={40} color={COLORS.green} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.green }}>Trajet sécurisé</div>
              <div style={{ fontSize: 20, color: COLORS.text, opacity: 0.7 }}>Chaque montée et descente est vérifiée.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------- Chauffeur
export const ChauffeurScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const kids = [
    { n: "Aïcha Benali", in: true },
    { n: "Youssef Alami", in: true },
    { n: "Lina Tazi", in: false },
    { n: "Omar Idrissi", in: false },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar dark />
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blueDark})`, padding: "6px 34px 28px", color: "#fff" }}>
        <div style={{ fontSize: 22, opacity: 0.8, fontWeight: 600 }}>Bonjour, Karim</div>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 2 }}>Bus 12 • Ligne Salé Centre</div>
      </div>
      <div style={{ padding: "24px 34px" }}>
        <Reveal delay={2}>
          <div style={{ background: COLORS.white, borderRadius: 24, padding: 26, boxShadow: "0 14px 32px rgba(14,42,71,0.1)" }}>
            <div style={{ fontSize: 20, color: COLORS.textMuted, fontWeight: 700, letterSpacing: 1 }}>PROCHAIN ARRÊT</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.text }}>Rue des Orangers</div>
                <div style={{ fontSize: 22, color: COLORS.blue, fontWeight: 700, marginTop: 4 }}>dans 600 m • 2 min</div>
              </div>
              <div style={{ width: 76, height: 76, borderRadius: 22, background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.96 + pulse * 0.08})` }}>
                <Icon name="navigation" size={38} color="#fff" />
              </div>
            </div>
            <div style={{ marginTop: 20, height: 12, borderRadius: 12, background: COLORS.line, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueSoft})` }} />
            </div>
            <div style={{ fontSize: 20, color: COLORS.textMuted, marginTop: 10 }}>Arrêt 3 sur 5</div>
          </div>
        </Reveal>

        <Reveal delay={9}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "28px 4px 16px" }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: COLORS.text }}>Élèves à bord</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.textMuted }}>2 / 12</span>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {kids.map((k, i) => (
            <Reveal key={i} delay={14 + i * 5} x={28}>
              <div style={{ background: COLORS.white, borderRadius: 20, padding: "18px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 8px 22px rgba(14,42,71,0.06)" }}>
                <Avatar initials={k.n.split(" ").map((p) => p[0]).join("")} size={56} bg={k.in ? COLORS.blue : COLORS.line} color={k.in ? "#fff" : COLORS.textMuted} />
                <span style={{ flex: 1, fontSize: 25, fontWeight: 700, color: COLORS.text }}>{k.n}</span>
                {k.in ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.green, fontWeight: 800, fontSize: 21 }}>
                    <Icon name="check" size={22} color={COLORS.green} strokeWidth={3} /> À bord
                  </span>
                ) : (
                  <span style={{ color: COLORS.textMuted, fontWeight: 700, fontSize: 21 }}>En attente</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------- Admin
const Stat: React.FC<{ value: string; label: string; tint: string; delay: number }> = ({ value, label, tint, delay }) => (
  <Reveal delay={delay}>
    <div style={{ background: COLORS.white, borderRadius: 22, padding: "22px 8px", textAlign: "center", boxShadow: "0 10px 26px rgba(14,42,71,0.07)" }}>
      <div style={{ fontSize: 42, fontWeight: 800, color: tint }}>{value}</div>
      <div style={{ fontSize: 19, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  </Reveal>
);

export const AdminScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const buses = [
    { x: 90, y: 70, d: 0 },
    { x: 250, y: 150, d: 1.7 },
    { x: 160, y: 250, d: 3.1 },
    { x: 360, y: 210, d: 4.4 },
  ];
  const rows: { icon: Parameters<typeof Icon>[0]["name"]; t: string; n: string; tint: string }[] = [
    { icon: "bus", t: "Gestion des bus", n: "8", tint: COLORS.blue },
    { icon: "user", t: "Chauffeurs", n: "8", tint: COLORS.orange },
    { icon: "shield", t: "Élèves", n: "240", tint: COLORS.green },
    { icon: "pin", t: "Arrêts & circuits", n: "32", tint: COLORS.navy },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: "10px 32px" }}>
        <Reveal delay={2}>
          <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>Tableau de bord</div>
          <div style={{ fontSize: 21, color: COLORS.textMuted, marginBottom: 22 }}>École Al Manar — Flotte en direct</div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Stat value="8" label="Bus actifs" tint={COLORS.blue} delay={6} />
          <Stat value="240" label="Élèves" tint={COLORS.orange} delay={9} />
          <Stat value="98%" label="À l’heure" tint={COLORS.green} delay={12} />
        </div>

        <Reveal delay={16}>
          <div style={{ marginTop: 20, height: 360, borderRadius: 24, background: COLORS.mapBg, position: "relative", overflow: "hidden", boxShadow: "0 12px 30px rgba(14,42,71,0.08)" }}>
            <svg width="100%" height="100%" viewBox="0 0 460 360" style={{ position: "absolute", inset: 0 }}>
              <rect x="30" y="40" width="150" height="110" rx="20" fill={COLORS.mapGreen} />
              <rect x="300" y="220" width="140" height="120" rx="20" fill={COLORS.mapGreen} />
              {[120, 250].map((y) => <line key={y} x1="0" y1={y} x2="460" y2={y} stroke="#fff" strokeWidth="12" opacity="0.7" />)}
              {[150, 320].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="#fff" strokeWidth="12" opacity="0.7" />)}
            </svg>
            {buses.map((b, i) => {
              const dx = Math.sin(frame / 22 + b.d) * 16;
              const pulse = 0.5 + 0.5 * Math.sin(frame / 6 + b.d);
              return (
                <div key={i} style={{ position: "absolute", left: b.x + dx, top: b.y, transform: "translate(-50%,-50%)" }}>
                  <span style={{ position: "absolute", left: "50%", top: "50%", width: 44, height: 44, borderRadius: 44, background: COLORS.blue, opacity: 0.16 * (1 - pulse), transform: "translate(-50%,-50%)" }} />
                  <div style={{ width: 40, height: 40, borderRadius: 40, background: "#fff", border: `4px solid ${COLORS.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="bus" size={20} color={COLORS.blue} />
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.92)", borderRadius: 14, padding: "8px 16px", fontSize: 19, fontWeight: 800, color: COLORS.navy, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 11, height: 11, borderRadius: 11, background: COLORS.red }} /> 8 bus en circulation
            </div>
          </div>
        </Reveal>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r, i) => (
            <Reveal key={i} delay={22 + i * 4} x={26}>
              <div style={{ background: COLORS.white, borderRadius: 18, padding: "16px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 8px 20px rgba(14,42,71,0.05)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${r.tint}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={r.icon} size={26} color={r.tint} />
                </div>
                <span style={{ flex: 1, fontSize: 25, fontWeight: 700, color: COLORS.text }}>{r.t}</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.textMuted }}>{r.n}</span>
                <Icon name="chevron" size={24} color={COLORS.textMuted} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};
