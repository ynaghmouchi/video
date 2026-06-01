import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT } from "../theme";
import { Child, Parent } from "./People";
import { Rain } from "./Rain";

// A validation poster: top = "Enfant sous la pluie", bottom = "Parent en panique".
// Purely to judge the SVG character rendering quality. Not part of the final cut.
export const CharacterPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* TOP — cold rainy bus stop */}
      <AbsoluteFill style={{ height: "50%", overflow: "hidden", background: "radial-gradient(120% 100% at 50% 0%, #2A3340 0%, #1B222C 60%, #12161C 100%)" }}>
        {/* bus stop pole + sign */}
        <div style={{ position: "absolute", left: 120, top: 120, width: 14, height: 640, background: "#2A3646", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 70, top: 120, width: 150, height: 96, background: "#1E2A3A", border: "3px solid #3A4A60", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2"><rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 10h16" /><path d="M8 17v2M16 17v2" /></svg>
        </div>
        {/* puddle */}
        <div style={{ position: "absolute", left: "50%", bottom: 40, transform: "translateX(-50%)", width: 360, height: 38, borderRadius: "50%", background: "rgba(120,150,180,0.22)", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", left: "50%", top: 30, transform: "translateX(-50%)" }}>
          <Child cold />
        </div>
        <Rain count={70} opacity={0.45} />
        <Label text="Enfant sous la pluie — sans M'EyeBus" tone="cold" />
      </AbsoluteFill>

      {/* BOTTOM — anxious parent */}
      <AbsoluteFill style={{ top: "50%", height: "50%", overflow: "hidden", background: `radial-gradient(120% 100% at 50% 0%, #11365F 0%, ${COLORS.navy} 50%, ${COLORS.navyDeep} 100%)` }}>
        {/* anxious thought bubbles */}
        <ThoughtBubble x={150} y={90} text="Il est où ?" delay={0} />
        <ThoughtBubble x={620} y={70} text="Pourquoi ce retard ?" delay={20} />
        <div style={{ position: "absolute", left: "50%", top: 40, transform: "translateX(-50%)" }}>
          <Parent anxious />
        </div>
        <Label text="Parent en panique — aucune info" tone="navy" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; tone: "cold" | "navy" }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center" }}>
    <span style={{ display: "inline-block", background: "rgba(8,18,38,0.6)", color: "#fff", fontWeight: 800, fontSize: 30, padding: "12px 26px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)" }}>{text}</span>
  </div>
);

const ThoughtBubble: React.FC<{ x: number; y: number; text: string; delay: number }> = ({ x, y, text, delay }) => {
  const frame = useCurrentFrame();
  const o = interpolate((frame - delay) % 120, [0, 20, 90, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp" });
  const fl = Math.sin((frame - delay) / 20) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y + fl, opacity: o, background: "rgba(255,255,255,0.94)", color: COLORS.navy, fontWeight: 800, fontSize: 30, padding: "16px 26px", borderRadius: 26, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>
      {text}
    </div>
  );
};
