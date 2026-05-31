import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { CinematicBackground } from "./Stage";
import { Phone3D } from "./Phone3D";
import { RealLogo } from "./assets";
import { Wordmark } from "./Logo";
import { Subtitle, PersonaTag } from "./Subtitles";
import { BrowserFrame } from "./web-dashboard";
import { Icon } from "./ui";

const ColdBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const d = interpolate(Math.sin(frame / 90), [-1, 1], [0, 60]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 0%, #2A3340 0%, #1B222C 55%, #12161C 100%)" }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "rgba(90,110,130,0.18)", filter: "blur(120px)", left: -160 + d, top: 120 }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 360px rgba(0,0,0,0.7)" }} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Problem
export const ProblemScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <ColdBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -120, fontFamily: FONT }}>
        <div style={{ opacity: inn, transform: `scale(${0.8 + inn * 0.2})` }}>
          <svg width="420" height="420" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="86" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.5)" strokeWidth="5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={100 + Math.sin(a) * 74} y1={100 - Math.cos(a) * 74} x2={100 + Math.sin(a) * 82} y2={100 - Math.cos(a) * 82} stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />;
            })}
            <line x1="100" y1="100" x2={100 + Math.sin((frame * 0.6) / 10) * 44} y2={100 - Math.cos((frame * 0.6) / 10) * 44} stroke="#fff" strokeWidth="6" strokeLinecap="round" transform={`rotate(${frame * 3} 100 100)`} />
            <line x1="100" y1="100" x2="100" y2="42" stroke={COLORS.orange} strokeWidth="4" strokeLinecap="round" transform={`rotate(${frame * 24} 100 100)`} />
            <circle cx="100" cy="100" r="8" fill="#fff" />
          </svg>
        </div>
        {[0, 1, 2].map((i) => {
          const f = (frame - i * 20) % 70;
          const o = interpolate(f, [0, 20, 60], [0, 0.5, 0], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ position: "absolute", left: `${20 + i * 26}%`, top: `${22 + (i % 2) * 8}%`, fontSize: 90, fontWeight: 800, color: "rgba(255,160,120,0.5)", opacity: o, transform: `translateY(${-f}px)` }}>?</div>
          );
        })}
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Anxiety
export const AnxietyScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards: { icon: Parameters<typeof Icon>[0]["name"]; label: string }[] = [
    { icon: "user", label: "Parents" },
    { icon: "home", label: "École" },
    { icon: "bus", label: "Chauffeurs" },
    { icon: "clock", label: "Retards" },
  ];
  return (
    <AbsoluteFill>
      <ColdBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", marginTop: -100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, width: "100%" }}>
          {cards.map((c, i) => {
            const s = spring({ frame: frame - 4 - i * 6, fps, config: { damping: 14 } });
            const shake = Math.sin(frame / 4 + i) * 3;
            return (
              <div key={i} style={{ opacity: s, transform: `scale(${s}) translateX(${shake}px)`, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(226,87,76,0.5)", borderRadius: 28, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, fontFamily: FONT }}>
                <div style={{ width: 110, height: 110, borderRadius: 32, background: "rgba(226,87,76,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={c.icon} size={56} color="#E2574C" />
                </div>
                <span style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{c.label}</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 22 }}>aucune info partagée</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Reveal (3D)
export const RevealScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const logo = spring({ frame: frame - 44, fps, config: { damping: 14 } });
  const flash = interpolate(frame, [42, 50, 64], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <AbsoluteFill style={{ transform: "scale(0.62)", transformOrigin: "center 44%" }}>
        <Phone3D width={width} height={height} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -60, fontFamily: FONT }}>
        <div style={{ opacity: logo, transform: `scale(${0.6 + logo * 0.4})`, background: "#fff", borderRadius: 56, padding: 40, boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
          <RealLogo width={210} />
        </div>
        <div style={{ marginTop: 30, opacity: logo, transform: `translateY(${(1 - logo) * 16}px)` }}>
          <Wordmark size={78} color="#fff" />
        </div>
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Persona phone scene
export const StoryPhoneScene: React.FC<{
  screen: React.ReactNode;
  persona: string;
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
  subtitle: string;
  screenBg?: string;
  notch?: boolean;
}> = ({ screen, persona, icon, tint, subtitle, screenBg, notch }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9 } });
  const floatY = Math.sin(frame / 26) * 8;
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <PersonaTag label={persona} icon={icon} tint={tint} />
      <div style={{ position: "absolute", left: "50%", top: 300, transform: `translateX(-50%) translateY(${(1 - enter) * 150 + floatY}px) scale(${0.92 + enter * 0.08})`, opacity: enter }}>
        <div style={{ position: "absolute", inset: "auto 40px -40px 40px", height: 120, background: tint, filter: "blur(70px)", opacity: 0.4, borderRadius: "50%" }} />
        <PhoneFrame screenBg={screenBg} notch={notch}>{screen}</PhoneFrame>
      </div>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Web dashboard scene
export const StoryWebScene: React.FC<{
  content: React.ReactNode;
  persona: string;
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
  subtitle: string;
}> = ({ content, persona, icon, tint, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9 } });
  const floatY = Math.sin(frame / 26) * 7;
  const W = 1010;
  const H = 700;
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <PersonaTag label={persona} icon={icon} tint={tint} />
      <div style={{ position: "absolute", left: "50%", top: 420, transform: `translateX(-50%) translateY(${(1 - enter) * 120 + floatY}px) scale(${0.94 + enter * 0.06})`, opacity: enter }}>
        <div style={{ position: "absolute", inset: "auto 60px -50px 60px", height: 130, background: tint, filter: "blur(80px)", opacity: 0.4, borderRadius: "50%" }} />
        <BrowserFrame width={W} height={H}>{content}</BrowserFrame>
      </div>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- Outro
export const OutroStory: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14 } });
  const cta = spring({ frame: frame - 26, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -40, fontFamily: FONT }}>
        <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: logo, background: "#fff", borderRadius: 60, padding: 46, boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
          <RealLogo width={250} />
        </div>
        <div style={{ marginTop: 40, opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`, display: "flex", alignItems: "center", gap: 16, background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`, color: "#fff", fontSize: 34, fontWeight: 800, padding: "26px 50px", borderRadius: 100, boxShadow: `0 20px 50px ${COLORS.orange}66` }}>
          <Icon name="navigation" size={32} color="#fff" />
          Disponible sur iOS &amp; Android
        </div>
      </AbsoluteFill>
      <Subtitle text={subtitle} />
    </AbsoluteFill>
  );
};
