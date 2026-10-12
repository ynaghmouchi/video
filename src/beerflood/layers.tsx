import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, FONT_COMIC, FONT_DISPLAY, FONT_UI, SPRING, T } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------------------
// Camera: Ken Burns on any child + whip-in / whip-out at scene boundaries.
// ---------------------------------------------------------------------------
export const Camera: React.FC<{
  from: number; // start scale
  to: number; // end scale
  origin?: string; // transform-origin, e.g. "50% 20%"
  panX?: number; // px drift over the scene
  panY?: number;
  children: React.ReactNode;
}> = ({ from, to, origin = "50% 50%", panX = 0, panY = 0, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: EASE.inOut, ...clamp });
  const scale = from + (to - from) * p;
  // Whip-in: 7 frames of blur + overshoot scale. Whip-out: last 5 frames.
  const inP = interpolate(frame, [0, 7], [0, 1], { easing: EASE.out, ...clamp });
  const outP = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [0, 1], { easing: EASE.in, ...clamp });
  const blur = (1 - inP) * 14 + outP * 16;
  const whipScale = 1 + (1 - inP) * 0.22 + outP * 0.18;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: T.bg }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale * whipScale}) translate(${panX * p}px, ${panY * p}px)`,
          transformOrigin: origin,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Finish layers: grade, grain, vignette (always on top).
// ---------------------------------------------------------------------------
export const Finish: React.FC<{ dark?: number }> = ({ dark = 0 }) => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 25%, transparent 75%, rgba(0,0,0,0.25))" }} />
      <AbsoluteFill
        style={{
          backgroundImage: noise,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Rising beer bubbles (seeded, module-level data).
// ---------------------------------------------------------------------------
const seeded = (s: number) => {
  const x = Math.sin(s * 9999) * 10000;
  return x - Math.floor(x);
};
const BUBBLES = Array.from({ length: 26 }, (_, i) => ({
  x: seeded(i + 1) * 1080,
  r: 4 + seeded(i + 50) * 10,
  speed: 1.6 + seeded(i + 90) * 2.2,
  phase: seeded(i + 130) * 1920,
  wob: seeded(i + 170) * Math.PI * 2,
}));
export const Bubbles: React.FC<{ opacity?: number }> = ({ opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {BUBBLES.map((b, i) => {
        const y = 1920 - ((frame * b.speed + b.phase) % 2100) + 90;
        const x = b.x + Math.sin(frame / 14 + b.wob) * 12;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              border: `3px solid ${T.foam}`,
              background: "rgba(255,246,220,0.18)",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Overlays in the reference's visual grammar.
// ---------------------------------------------------------------------------

// Red glowing label (like "RAYÉE SUR TOUT LE CÔTÉ").
export const Label: React.FC<{
  text: string;
  x: number;
  y: number;
  delay?: number;
  color?: string;
  rotate?: number;
  size?: number;
}> = ({ text, x, y, delay = 0, color = T.red, rotate = -3, size = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const pulse = 0.75 + Math.sin(frame / 4) * 0.25;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "14px 28px",
        background: color,
        color: T.white,
        fontFamily: FONT_COMIC,
        fontSize: size,
        letterSpacing: 2,
        borderRadius: 10,
        border: `4px solid ${T.ink}`,
        boxShadow: `0 0 ${26 * pulse}px ${color}, 0 0 ${60 * pulse}px ${color}80, 0 10px 0 ${T.ink}`,
        opacity: s,
        transform: `rotate(${rotate}deg) scale(${0.6 + s * 0.4})`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// White pill with dark text (like "TU REVIENS", "IL PAYE").
export const Tag: React.FC<{ text: string; x: number; y: number; delay?: number }> = ({ text, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "12px 26px",
        background: T.paper,
        color: T.ink,
        fontFamily: FONT_UI,
        fontWeight: 800,
        fontSize: 38,
        letterSpacing: 1,
        borderRadius: 8,
        border: `4px solid ${T.ink}`,
        boxShadow: `0 8px 0 ${T.ink}`,
        opacity: s,
        transform: `translateY(${(1 - s) * -20}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// Rubber stamp slamming down (like the MALUS stamp).
export const Stamp: React.FC<{ text: string; y: number; delay?: number; size?: number; color?: string }> = ({
  text,
  y,
  delay = 0,
  size = 120,
  color = T.red,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.slam });
  const scale = interpolate(s, [0, 1], [2.6, 1]);
  const ring = interpolate(frame - delay, [4, 30], [0.9, 1.9], { easing: EASE.out, ...clamp });
  const ringO = interpolate(frame - delay, [3, 4, 30], [0, 0.8, 0], clamp);
  const shake = frame - delay > 4 && frame - delay < 12 ? Math.sin(frame * 9) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: -60,
          width: 420,
          height: 260,
          borderRadius: "50%",
          border: `8px solid ${color}`,
          opacity: ringO,
          transform: `scale(${ring})`,
        }}
      />
      <div
        style={{
          padding: "18px 46px",
          color,
          fontFamily: FONT_DISPLAY,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: 4,
          border: `12px solid ${color}`,
          borderRadius: 26,
          background: "rgba(20,20,20,0.35)",
          boxShadow: `0 0 40px ${color}99, inset 0 0 30px ${color}55`,
          textShadow: `0 0 24px ${color}`,
          opacity: Math.min(1, s * 1.5),
          transform: `translateX(${shake}px) rotate(-8deg) scale(${scale})`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Animated counter with a glowing amber number.
export const BigNumber: React.FC<{ target: number; suffix: string; sub: string; y: number; delay?: number }> = ({
  target,
  suffix,
  sub,
  y,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 55 } });
  const pop = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const value = Math.round(interpolate(s, [0, 1], [0, target]));
  const txt = value.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ");
  const pulse = 0.8 + Math.sin(frame / 5) * 0.2;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        opacity: pop,
        transform: `scale(${0.7 + pop * 0.3})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 150,
          lineHeight: 1,
          color: T.amber,
          WebkitTextStroke: `8px ${T.ink}`,
          paintOrder: "stroke fill",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 ${30 * pulse}px ${T.amber}, 0 12px 0 ${T.ink}`,
        }}
      >
        {txt} {suffix}
      </div>
      <div
        style={{
          marginTop: 14,
          display: "inline-block",
          fontFamily: FONT_UI,
          fontWeight: 800,
          fontSize: 44,
          color: T.ink,
          background: T.foam,
          padding: "8px 26px",
          borderRadius: 8,
          border: `4px solid ${T.ink}`,
          boxShadow: `0 8px 0 ${T.ink}`,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

// Comic speech bubble (narrator).
export const Bubble: React.FC<{ text: string; x: number; y: number; delay?: number; strike?: number }> = ({
  text,
  x,
  y,
  delay = 0,
  strike,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const st = strike === undefined ? 0 : spring({ frame: frame - strike, fps, config: SPRING.slam });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "26px 40px",
        background: T.white,
        color: T.ink,
        fontFamily: FONT_COMIC,
        fontSize: 72,
        lineHeight: 1,
        letterSpacing: 2,
        borderRadius: 40,
        border: `6px solid ${T.ink}`,
        boxShadow: `0 10px 0 ${T.ink}`,
        opacity: s,
        transform: `rotate(-4deg) scale(${0.5 + s * 0.5})`,
        transformOrigin: "20% 100%",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {/* tail */}
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: -34,
          width: 0,
          height: 0,
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderTop: `40px solid ${T.ink}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          bottom: -22,
          width: 0,
          height: 0,
          borderLeft: "14px solid transparent",
          borderRight: "14px solid transparent",
          borderTop: `30px solid ${T.white}`,
        }}
      />
      {strike !== undefined && (
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "48%",
            width: `${st * 88}%`,
            height: 14,
            background: T.red,
            borderRadius: 7,
            transform: "rotate(-6deg)",
            boxShadow: `0 0 18px ${T.red}`,
          }}
        />
      )}
    </div>
  );
};
