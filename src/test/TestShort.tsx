import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../meyebus/theme";

// =============================================================================
// COMPOSITION CONFIG — 5 s vertical test short (TikTok / Reels / Shorts)
// =============================================================================
export const TEST_SHORT_FPS = 30;
export const TEST_SHORT_FRAMES = 5 * TEST_SHORT_FPS;

const EASINGS = {
  out: Easing.bezier(0.33, 1, 0.68, 1),
  inOut: Easing.bezier(0.37, 0, 0.63, 1),
} as const;

// =============================================================================
// PRE-GENERATED DATA (module level — never Math.random() during render)
// =============================================================================
const seeded = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};
const DOTS = Array.from({ length: 28 }, (_, i) => ({
  x: seeded(i + 1) * 1080,
  y: seeded(i + 101) * 1920,
  r: 3 + seeded(i + 201) * 6,
  phase: seeded(i + 301) * Math.PI * 2,
}));

const HOOK = ["Et", "si", "ton", "bus", "te", "prévenait", "?"];
const PAYOFF = "M'EyeBus — le trajet scolaire, en temps réel.";

// =============================================================================
// LAYERS
// =============================================================================
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 80], {
    easing: EASINGS.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + drift * 0.3}% ${20 + drift * 0.2}%, ${COLORS.blue} 0%, ${COLORS.navy} 45%, ${COLORS.navyDeep} 100%)`,
      }}
    >
      {DOTS.map((d, i) => {
        const breathe = Math.sin(frame / 18 + d.phase) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y + breathe,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: "50%",
              background: i % 5 === 0 ? COLORS.orange : COLORS.white,
              opacity: 0.18,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// A stylised bus drawn in CSS: slides in from the left, then idles with a bounce.
const Bus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 90 } });
  const x = interpolate(enter, [0, 1], [-700, 0]);
  const idle = Math.sin(frame / 5) * 4;
  const wheel = frame * 14;
  const W = 520;
  const H = 230;
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - W) / 2 + x,
        top: 760 + idle,
        width: W,
        height: H,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 42,
          background: COLORS.orange,
          boxShadow: `0 30px 60px rgba(0,0,0,0.45), inset 0 -18px 0 ${COLORS.orangeDeep}`,
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 40 + i * 118,
            top: 42,
            width: 86,
            height: 76,
            borderRadius: 16,
            background: COLORS.mapWater,
            boxShadow: `inset 0 -10px 0 ${COLORS.blueSoft}`,
          }}
        />
      ))}
      {[110, 410].map((cx) => (
        <div
          key={cx}
          style={{
            position: "absolute",
            left: cx - 44,
            top: H - 50,
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: COLORS.text,
            border: `14px solid ${COLORS.textMuted}`,
            transform: `rotate(${wheel}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 4,
              width: 6,
              height: 24,
              marginLeft: -3,
              background: COLORS.white,
              borderRadius: 3,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Notification pill popping above the bus — the "payoff".
const Ping: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 62, fps, config: { damping: 11, stiffness: 160 } });
  const ring = interpolate(frame, [62, 100], [0.6, 2.2], {
    easing: EASINGS.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [61, 62, 100], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `6px solid ${COLORS.green}`,
          opacity: ringOpacity,
          transform: `scale(${ring})`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 36px",
          borderRadius: 999,
          background: COLORS.white,
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 800,
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + s * 0.2})`,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: COLORS.green,
            boxShadow: `0 0 0 8px ${COLORS.greenSoft}`,
          }}
        />
        Bus dans 2 min
      </div>
    </div>
  );
};

const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [92, 104], [1, 0], {
    easing: EASINGS.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 330,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "8px 22px",
        fontFamily: FONT,
        opacity: exit,
        transform: `translateY(${(1 - exit) * -30}px)`,
      }}
    >
      {HOOK.map((w, i) => {
        const s = spring({ frame: frame - (4 + i * 4), fps, config: { damping: 16, stiffness: 180 } });
        const hero = w === "prévenait";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.05,
              color: hero ? COLORS.orange : COLORS.white,
              opacity: s,
              transform: `translateY(${(1 - s) * 50}px) scale(${0.85 + s * 0.15})`,
              textShadow: "0 8px 30px rgba(0,0,0,0.45)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const PayoffText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 100, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1120,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 56,
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: -1,
        color: COLORS.white,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        textShadow: "0 8px 30px rgba(0,0,0,0.45)",
      }}
    >
      {PAYOFF}
    </div>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1560, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.18)" }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 4, background: COLORS.orange }} />
    </div>
  );
};

// Grade + vignette on top of everything; keeps the "five-layer stack" rule.
const Finish: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export const TestShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <HookText />
      <Bus />
      <Ping />
      <PayoffText />
      <Progress />
      <Finish />
    </AbsoluteFill>
  );
};
