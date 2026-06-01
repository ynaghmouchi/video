import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random } from "remotion";
import { COLORS, FONT } from "../theme";
import { Child, Parent, Secretary } from "./People";
import { Rain } from "./Rain";
import { Subtitle } from "../Subtitles";
import { Icon } from "../ui";

// --------------------------------------------------------------- backgrounds
const ColdSky: React.FC = () => {
  const frame = useCurrentFrame();
  const d = interpolate(Math.sin(frame / 90), [-1, 1], [0, 50]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #3A4452 0%, #2A3340 40%, #1B222C 100%)" }}>
      {/* drifting clouds */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", top: 120 + i * 130, left: -200 + ((frame * (0.4 + i * 0.2) + i * 500) % 1500), width: 420, height: 110, borderRadius: 80, background: "rgba(255,255,255,0.05)", filter: "blur(18px)" }} />
      ))}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "rgba(90,110,130,0.16)", filter: "blur(120px)", left: -160 + d, top: 120 }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 360px rgba(0,0,0,0.7)" }} />
    </AbsoluteFill>
  );
};

const WarmRoom: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 30% 10%, #11365F 0%, ${COLORS.navy} 50%, ${COLORS.navyDeep} 100%)` }}>
    {/* window */}
    <div style={{ position: "absolute", left: 120, top: 200, width: 300, height: 360, borderRadius: 16, background: "linear-gradient(180deg, rgba(120,150,190,0.25), rgba(40,60,90,0.25))", border: "10px solid rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", left: 268, top: 200, width: 6, height: 360, background: "rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", left: 120, top: 372, width: 300, height: 6, background: "rgba(255,255,255,0.10)" }} />
  </AbsoluteFill>
);

// Detailed, more realistic bus shelter (roof, glass panels, bench, sign).
const BusShelter: React.FC = () => (
  <svg width={520} height={560} viewBox="0 0 520 560" style={{ position: "absolute", left: 40, top: 520, overflow: "visible" }}>
    {/* roof */}
    <rect x="20" y="20" width="420" height="34" rx="8" fill="#37485E" />
    <rect x="20" y="20" width="420" height="12" rx="6" fill="#46586F" />
    {/* posts */}
    <rect x="34" y="54" width="16" height="430" rx="6" fill="#2C3A4D" />
    <rect x="410" y="54" width="16" height="430" rx="6" fill="#2C3A4D" />
    {/* back glass panels */}
    <rect x="58" y="70" width="344" height="320" rx="6" fill="rgba(150,180,210,0.12)" stroke="rgba(180,205,230,0.22)" strokeWidth="3" />
    <line x1="230" y1="70" x2="230" y2="390" stroke="rgba(180,205,230,0.18)" strokeWidth="3" />
    {/* rain streaks on glass */}
    {[80, 140, 300, 360].map((x, i) => (
      <line key={i} x1={x} y1={80} x2={x - 8} y2={380} stroke="rgba(200,220,240,0.10)" strokeWidth="6" strokeLinecap="round" />
    ))}
    {/* bench */}
    <rect x="80" y="410" width="300" height="20" rx="8" fill="#3A4A60" />
    <rect x="96" y="430" width="14" height="54" rx="4" fill="#2C3A4D" />
    <rect x="350" y="430" width="14" height="54" rx="4" fill="#2C3A4D" />
  </svg>
);

// Stand-alone schedule sign on a pole.
const BusSign: React.FC = () => (
  <svg width={180} height={520} viewBox="0 0 180 520" style={{ position: "absolute", right: 70, top: 460 }}>
    <rect x="84" y="120" width="12" height="380" rx="6" fill="#2A3646" />
    <rect x="24" y="40" width="132" height="120" rx="14" fill="#13233A" stroke="#33506F" strokeWidth="4" />
    <rect x="24" y="40" width="132" height="34" rx="14" fill={COLORS.navy} />
    <g transform="translate(40 50)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2"><rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 10h16" /><path d="M8 17v2M16 17v2" /><circle cx="8" cy="14" r="1.2" fill={COLORS.orange} stroke="none" /><circle cx="16" cy="14" r="1.2" fill={COLORS.orange} stroke="none" /></svg>
    </g>
    <rect x="40" y="90" width="100" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
    <rect x="40" y="106" width="74" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
    <rect x="40" y="122" width="86" height="8" rx="4" fill="rgba(255,255,255,0.14)" />
  </svg>
);

// Rain puddle with expanding ripples.
const Puddle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={520} height={70} viewBox="0 0 520 70" style={{ position: "absolute", left: "50%", bottom: 60, transform: "translateX(-50%)" }}>
      <ellipse cx="260" cy="40" rx="240" ry="26" fill="rgba(120,150,180,0.22)" />
      {[0, 1, 2, 3].map((i) => {
        const t = (frame + i * 22) % 88;
        const r = interpolate(t, [0, 88], [4, 60]);
        const o = interpolate(t, [0, 88], [0.5, 0]);
        const cx = 120 + random(`rip${i}`) * 280;
        return <ellipse key={i} cx={cx} cy={42} rx={r} ry={r * 0.34} fill="none" stroke="rgba(190,215,240,1)" strokeWidth="2" opacity={o} />;
      })}
    </svg>
  );
};

// ----------------------------------------------------- SCENE 1 — child in rain
export const EnfantPluieScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill>
      <ColdSky />
      <BusShelter />
      <BusSign />
      <Puddle />
      <div style={{ position: "absolute", left: "50%", bottom: 360, transformOrigin: "bottom center", transform: `translateX(-50%) scale(1.35) translateY(${(1 - enter) * 40}px)`, opacity: enter }}>
        <Child cold />
      </div>
      {/* cold breath puff */}
      <Breath x="58%" y={1050} />
      <Rain count={90} opacity={0.5} />
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

const Breath: React.FC<{ x: string; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const t = frame % 70;
  const o = interpolate(t, [0, 20, 50], [0, 0.4, 0], { extrapolateRight: "clamp" });
  const s = interpolate(t, [0, 50], [0.6, 1.6]);
  return <div style={{ position: "absolute", left: x, top: y, width: 60, height: 36, borderRadius: 30, background: "rgba(255,255,255,0.6)", filter: "blur(8px)", opacity: o, transform: `translateX(${t * 1.5}px) scale(${s})` }} />;
};

// ----------------------------------------- SCENE 2 — parent + traffic-jam map
export const ParentPaniqueScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const mapIn = spring({ frame: frame - 24, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <WarmRoom />
      <ThoughtBubble x={90} y={130} text="Il est où ?" delay={10} />
      <ThoughtBubble x={560} y={210} text="Pourquoi ce retard ?" delay={40} />
      <div style={{ position: "absolute", left: "50%", bottom: 360, transformOrigin: "bottom center", transform: `translateX(-50%) scale(1.15) translateY(${(1 - enter) * 40}px)`, opacity: enter }}>
        <Parent anxious />
      </div>
      {/* floating city map showing the bus stuck in traffic — the parent can't see it */}
      <div style={{ position: "absolute", left: "50%", top: 560, width: 420, transform: `translateX(-50%) translateY(${(1 - mapIn) * 60}px) scale(${0.9 + mapIn * 0.1})`, opacity: mapIn }}>
        <TrafficMap />
        <div style={{ marginTop: 12, textAlign: "center", color: "rgba(255,255,255,0.6)", fontFamily: FONT, fontWeight: 700, fontSize: 24 }}>… mais il ne le voit pas</div>
      </div>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// Small city map: roads, jammed cars, a stuck bus pin, the home marker.
const TrafficMap: React.FC = () => {
  const frame = useCurrentFrame();
  const jitter = (i: number) => Math.sin(frame / 6 + i) * 1.2;
  return (
    <svg width={380} height={300} viewBox="0 0 380 300" style={{ borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
      <rect width="380" height="300" rx="24" fill={COLORS.mapBg} />
      <rect x="0" y="0" width="160" height="150" fill={COLORS.mapGreen} opacity="0.6" />
      <rect x="240" y="160" width="140" height="140" fill={COLORS.mapWater} opacity="0.6" />
      {/* roads */}
      <rect x="150" y="0" width="46" height="300" fill={COLORS.mapRoad} />
      <rect x="0" y="120" width="380" height="46" fill={COLORS.mapRoad} />
      <line x1="173" y1="0" x2="173" y2="300" stroke="#CBD6E4" strokeWidth="3" strokeDasharray="10 12" />
      {/* jammed cars on the vertical road */}
      {[40, 76, 112, 210, 246, 282].map((y, i) => (
        <g key={i} transform={`translate(${(i % 2 ? 178 : 154) + jitter(i)} ${y})`}>
          <rect width="22" height="34" rx="6" fill={["#E2574C", "#2D6CDF", "#F2A23B", "#16233A", "#E2574C", "#2D6CDF"][i]} />
          <rect x="3" y="5" width="16" height="9" rx="3" fill="rgba(255,255,255,0.5)" />
        </g>
      ))}
      {/* stuck bus pin */}
      <g transform="translate(150 150)">
        <path d="M22 -34c0 24-22 40-22 40s-22-16-22-40a22 22 0 0 1 44 0z" fill={COLORS.orange} />
        <circle cx="0" cy="-34" r="13" fill="#fff" />
        <svg x="-9" y="-43" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2.5"><rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 10h16" /></svg>
      </g>
      {/* congestion label */}
      <g transform="translate(196 60)">
        <rect width="150" height="40" rx="20" fill="#E2574C" />
        <text x="48" y="26" fill="#fff" fontFamily={FONT} fontWeight="800" fontSize="20">Bouchon</text>
        <circle cx="24" cy="20" r="7" fill="#fff" opacity={0.4 + Math.abs(Math.sin(frame / 8)) * 0.6} />
      </g>
    </svg>
  );
};

// --------------------------------------------- SCENE 3 — overwhelmed secretary
export const EcoleDebordeeScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const calls = Math.min(99, Math.floor(interpolate(frame, [10, 140], [1, 24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <AbsoluteFill>
      <WarmRoom />
      {/* ringing phone icons popping around her */}
      {[{ x: 80, y: 470, d: 0 }, { x: 800, y: 440, d: 12 }, { x: 110, y: 760, d: 24 }, { x: 820, y: 740, d: 36 }].map((p, i) => (
        <RingingPhone key={i} {...p} />
      ))}
      {/* call counter */}
      <div style={{ position: "absolute", top: 230, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, background: "#E2574C", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "18px 38px", borderRadius: 100, boxShadow: "0 16px 40px rgba(226,87,76,0.45)", whiteSpace: "nowrap" }}>
        <Icon name="bell" size={36} color="#fff" />
        {calls} appels en attente
      </div>
      {/* flying post-its */}
      {[0, 1, 2, 3].map((i) => <PostIt key={i} i={i} />)}
      <div style={{ position: "absolute", left: "50%", bottom: 330, transformOrigin: "bottom center", transform: `translateX(-50%) scale(1.25) translateY(${(1 - enter) * 40}px)`, opacity: enter }}>
        <Secretary overwhelmed />
      </div>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

const RingingPhone: React.FC<{ x: number; y: number; d: number }> = ({ x, y, d }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin((frame + d) / 4) * 12;
  const s = interpolate((frame + d) % 100, [0, 12, 88, 100], [0.6, 1, 1, 0.6]);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${wob}deg) scale(${s})` }}>
      <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(226,87,76,0.18)", border: "2px solid rgba(226,87,76,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="bell" size={48} color="#E2574C" />
      </div>
    </div>
  );
};

const PostIt: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const start = i * 18;
  const t = (frame - start);
  if (t < 0) return null;
  const y = interpolate(t, [0, 60], [-80, 380 + i * 64], { extrapolateRight: "clamp" });
  const rot = Math.sin((frame + i * 20) / 18) * 10 + (i % 2 ? 8 : -8);
  const x = 150 + i * 26;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 120, height: 110, background: ["#FFE08A", "#FFD0D0", "#CDEBC5", "#CFE4FF"][i], borderRadius: 6, transform: `rotate(${rot}deg)`, boxShadow: "0 8px 20px rgba(0,0,0,0.3)", padding: 12, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: "#3A3A2A" }}>
      {["Bus 12 ?", "Mon fils ?", "Retard ??", "Rappeler"][i]}
    </div>
  );
};

const ThoughtBubble: React.FC<{ x: number; y: number; text: string; delay: number }> = ({ x, y, text, delay }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fl = Math.sin((frame - delay) / 22) * 7;
  return (
    <div style={{ position: "absolute", left: x, top: y + fl, opacity: o, background: "rgba(255,255,255,0.95)", color: COLORS.navy, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "18px 28px", borderRadius: 28, boxShadow: "0 14px 34px rgba(0,0,0,0.35)" }}>
      {text}
      <div style={{ position: "absolute", bottom: -10, left: 30, width: 22, height: 22, background: "rgba(255,255,255,0.95)", borderRadius: 6, transform: "rotate(45deg)" }} />
    </div>
  );
};

// ----------------------------------------------- SCENE — bascule (the question)
export const BasculeScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame / 14) * 0.04;
  const glow = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, #14233A 0%, #0B1626 60%, #060E1A 100%)" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -160 }}>
        <div style={{ width: 420 * glow, height: 420 * glow, borderRadius: "50%", background: `${COLORS.blue}22`, filter: "blur(90px)", transform: `scale(${pulse})` }} />
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------- SCENE — apaisement (3 panels)
export const ApaisementScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panel = (i: number) => spring({ frame: frame - 6 - i * 10, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, #16518C 0%, ${COLORS.navy} 55%, ${COLORS.navyDeep} 100%)` }}>
      <AbsoluteFill style={{ flexDirection: "column", padding: "230px 60px 320px", gap: 34 }}>
        {/* child happy */}
        <PanelRow s={panel(0)} tint={COLORS.orange} character={<Child happy />} cScale={0.34} title="L'enfant" line="Le bus arrive — il le voit." />
        {/* parent relaxed with alert */}
        <PanelRow s={panel(1)} tint={COLORS.blue} character={<Parent anxious={false} />} cScale={0.3} title="Le parent" line="« Bus à 3 min »" badge />
        {/* secretary calm */}
        <PanelRow s={panel(2)} tint={COLORS.green} character={<Secretary overwhelmed={false} calm />} cScale={0.38} title="L'école" line="Tout est sous contrôle." />
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

const PanelRow: React.FC<{ s: number; tint: string; character: React.ReactNode; cScale: number; title: string; line: string; badge?: boolean }> = ({ s, tint, character, cScale, title, line, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30, background: "rgba(255,255,255,0.06)", border: `2px solid ${tint}55`, borderRadius: 32, padding: "10px 30px 10px 10px", opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
    <div style={{ width: 210, height: 210, borderRadius: 26, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
      <div style={{ transform: `scale(${cScale})`, transformOrigin: "center" }}>{character}</div>
    </div>
    <div style={{ fontFamily: FONT }}>
      <div style={{ color: tint, fontWeight: 800, fontSize: 30, letterSpacing: 1 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
        {badge && <div style={{ width: 44, height: 44, borderRadius: 14, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="bell" size={24} color="#fff" /></div>}
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 40 }}>{line}</span>
      </div>
    </div>
  </div>
);
