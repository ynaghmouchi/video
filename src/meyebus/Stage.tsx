import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT } from "./theme";
import { LogoMark, Wordmark } from "./Logo";

export const CinematicBackground: React.FC<{ variant?: "deep" | "light" }> = ({ variant = "deep" }) => {
  const frame = useCurrentFrame();
  const drift = (a: number, b: number, speed: number) =>
    interpolate(Math.sin(frame / speed), [-1, 1], [a, b]);

  if (variant === "light") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, ${COLORS.bg} 60%, #DCE6F3 100%)` }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `${COLORS.blue}1A`, filter: "blur(90px)", left: drift(-160, -40, 90), top: drift(120, 240, 110) }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `${COLORS.orange}18`, filter: "blur(90px)", right: drift(-160, -60, 100), bottom: drift(120, 260, 95) }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 100% at 50% -10%, #11365F 0%, ${COLORS.navy} 45%, ${COLORS.navyDeep} 100%)` }}>
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", background: `${COLORS.blue}33`, filter: "blur(110px)", left: drift(-200, -40, 120), top: drift(60, 220, 140) }} />
      <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", background: `${COLORS.orange}26`, filter: "blur(110px)", right: drift(-200, -60, 130), bottom: drift(120, 300, 120) }} />
      {/* dotted grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.10) 2px, transparent 2px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(80% 70% at 50% 40%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 40%, black 0%, transparent 80%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 360px rgba(3,10,22,0.8)" }} />
    </AbsoluteFill>
  );
};

export const BrandChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * -20}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 100,
          padding: "12px 28px 12px 14px",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ background: "#fff", borderRadius: 100, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LogoMark size={42} />
        </div>
        <Wordmark size={34} color="#fff" />
      </div>
    </div>
  );
};

export const Caption: React.FC<{ kicker?: string; title: string }> = ({ kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = title.split(" ");
  const k = spring({ frame: frame - 4, fps, config: { damping: 22 } });
  const bar = spring({ frame: frame - 10, fps, config: { damping: 18 } });

  return (
    <div style={{ position: "absolute", left: 70, right: 70, bottom: 150, textAlign: "center", fontFamily: FONT }}>
      {kicker ? (
        <div
          style={{
            display: "inline-block",
            color: COLORS.orange,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: k,
            transform: `translateY(${(1 - k) * 14}px)`,
            marginBottom: 18,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px" }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - 8 - i * 3, fps, config: { damping: 20, mass: 0.7 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: "#fff",
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.18,
                letterSpacing: -1,
                opacity: s,
                transform: `translateY(${(1 - s) * 26}px)`,
                textShadow: "0 6px 30px rgba(0,0,0,0.45)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
        <div style={{ width: 120 * bar, height: 7, borderRadius: 7, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.amber})` }} />
      </div>
    </div>
  );
};
