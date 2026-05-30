import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT } from "./theme";
import { LogoMark } from "./Logo";
import { PhoneFrame } from "./PhoneFrame";
import { CinematicBackground, BrandChip, Caption } from "./Stage";
import { Icon } from "./ui";

// ---------------------------------------------------------------- Intro
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140, mass: 0.9 } });
  const scale = interpolate(pop, [0, 1], [0.4, 1]);
  const tag = spring({ frame: frame - 24, fps, config: { damping: 22 } });

  return (
    <AbsoluteFill>
      <CinematicBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        {/* pulsing rings */}
        {[0, 1, 2].map((i) => {
          const r = interpolate((frame - i * 14) % 56, [0, 56], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 340 + r * 380,
                height: 340 + r * 380,
                borderRadius: "50%",
                border: `2px solid rgba(255,255,255,${0.22 * (1 - r)})`,
              }}
            />
          );
        })}
        <div style={{ transform: `scale(${scale})`, filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))" }}>
          <LogoMark size={320} />
        </div>
        <div
          style={{
            marginTop: 44,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 18}px)`,
            color: "rgba(255,255,255,0.86)",
            fontSize: 40,
            fontWeight: 600,
          }}
        >
          Le bus scolaire de votre enfant.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Hook
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ["Où est-il maintenant ?", "À quelle heure arrive-t-il ?", "Est-il bien arrivé ?"];
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <BrandChip />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: "0 90px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34, width: "100%" }}>
          {lines.map((l, i) => {
            const s = spring({ frame: frame - 8 - i * 16, fps, config: { damping: 20 } });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateX(${(1 - s) * -40}px)`,
                  color: "#fff",
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: -1,
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <span style={{ color: COLORS.orange }}>—</span>
                {l}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Caption title="Désormais, vous savez." />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Phone scene
export const PhoneScene: React.FC<{
  screen: React.ReactNode;
  kicker: string;
  title: string;
  screenBg?: string;
}> = ({ screen, kicker, title, screenBg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9 } });
  const floatY = Math.sin(frame / 26) * 8;
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <BrandChip />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 250,
          transform: `translateX(-50%) translateY(${(1 - enter) * 150 + floatY}px) scale(${0.92 + enter * 0.08})`,
          opacity: enter,
        }}
      >
        {/* glow under phone */}
        <div style={{ position: "absolute", inset: "auto 40px -40px 40px", height: 120, background: COLORS.blue, filter: "blur(70px)", opacity: 0.4, borderRadius: "50%" }} />
        <PhoneFrame screenBg={screenBg}>{screen}</PhoneFrame>
      </div>
      <Caption kicker={kicker} title={title} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Outro
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14 } });
  const tag = spring({ frame: frame - 18, fps, config: { damping: 22 } });
  const cta = spring({ frame: frame - 30, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill>
      <CinematicBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: logo, filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))" }}>
          <LogoMark size={270} />
        </div>
        <div style={{ marginTop: 40, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`, color: "rgba(255,255,255,0.88)", fontSize: 42, fontWeight: 600 }}>
          La sérénité, à chaque trajet.
        </div>
        <div
          style={{
            marginTop: 56,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 16}px) scale(${0.9 + cta * 0.1})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`,
            color: "#fff",
            fontSize: 34,
            fontWeight: 800,
            padding: "26px 50px",
            borderRadius: 100,
            boxShadow: `0 20px 50px ${COLORS.orange}66`,
          }}
        >
          <Icon name="navigation" size={32} color="#fff" />
          Disponible sur iOS &amp; Android
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
