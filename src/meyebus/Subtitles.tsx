import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT } from "./theme";
import { Icon } from "./ui";

// TikTok-style subtitle: words pop in one by one, the leading word flashes orange.
export const Subtitle: React.FC<{ text: string; wps?: number }> = ({ text, wps = 5.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: 70, right: 70, bottom: 235, textAlign: "center", fontFamily: FONT }}>
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 14px",
          background: "rgba(8,18,38,0.62)",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: "20px 30px",
          borderRadius: 26,
          maxWidth: "100%",
        }}
      >
        {words.map((w, i) => {
          const start = 6 + i * wps;
          const s = spring({ frame: frame - start, fps, config: { damping: 200, stiffness: 220 } });
          const active = frame >= start && frame < start + 10;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 50,
                fontWeight: 800,
                letterSpacing: -1,
                color: active ? COLORS.orange : "#fff",
                opacity: s,
                transform: `translateY(${(1 - s) * 22}px) scale(${active ? 1.06 : 1})`,
                textShadow: "0 4px 18px rgba(0,0,0,0.5)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Top persona chip ("Pour les parents", etc.) with an icon + accent colour.
export const PersonaTag: React.FC<{
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
}> = ({ label, icon, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * -18}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: tint,
          color: "#fff",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 34,
          padding: "14px 30px 14px 22px",
          borderRadius: 100,
          boxShadow: `0 16px 36px ${tint}66`,
        }}
      >
        <div style={{ background: "rgba(255,255,255,0.22)", borderRadius: 100, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={28} color="#fff" />
        </div>
        {label}
      </div>
    </div>
  );
};
