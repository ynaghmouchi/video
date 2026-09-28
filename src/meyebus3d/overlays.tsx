import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS, FONT } from "../meyebus/theme";
import { Icon } from "../meyebus/ui";
import { RealLogo } from "../meyebus/assets";
import { Wordmark } from "../meyebus/Logo";
import { busState, cameraPose, projectToScreen, SCENES } from "./timeline";

// ---------------------------------------------------------------- Sky
export const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const day = interpolate(frame, [SCENES.reveal.from - 30, SCENES.reveal.from + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunY = interpolate(frame, [0, SCENES.question.from + 60], [24, 12], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #3E6399 0%, #7FA0D6 12%, #F6C08C 20%, #FDE3CC 26%, #E9F0F8 40%, #E9F0F8 100%)" }} />
      <div style={{ position: "absolute", left: "38%", top: `${sunY}%`, width: 620, height: 620, marginLeft: -310, marginTop: -310, borderRadius: "50%", background: "radial-gradient(circle, #FFF1C4 0%, #FFC27A 30%, rgba(255,184,107,0) 68%)", opacity: 1 - day }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #8FC1F2 0%, #C9E2F8 45%, #E9F0F8 100%)", opacity: day }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Text
const useIn = (delay: number, cfg = { damping: 20, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: cfg });
};

const useOut = (dur: number, len = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [dur - len, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const Headline: React.FC<{ kicker?: string; title: string; dur: number; tint?: string; top?: number; light?: boolean }> = ({
  kicker,
  title,
  dur,
  tint = COLORS.orange,
  top = 170,
  light = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useIn(2);
  const out = useOut(dur);
  const words = title.split(" ");
  const color = light ? "#FFFFFF" : COLORS.navy;
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center", fontFamily: FONT, opacity: out }}>
      {kicker ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: tint, color: "#fff", fontWeight: 800, fontSize: 28, letterSpacing: 2, textTransform: "uppercase", padding: "10px 26px", borderRadius: 100, opacity: k, transform: `translateY(${(1 - k) * -16}px)`, marginBottom: 26, boxShadow: `0 14px 34px ${tint}55` }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px" }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - 6 - i * 3, fps, config: { damping: 18, mass: 0.7 } });
          return (
            <span key={i} style={{ display: "inline-block", color, fontWeight: 800, fontSize: 66, lineHeight: 1.16, letterSpacing: -1.5, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, textShadow: light ? "0 6px 30px rgba(8,18,38,0.55)" : "none" }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Cards pinned to 3D points
const Card: React.FC<{ x: number; y: number; delay: number; dur: number; life?: number; icon: Parameters<typeof Icon>[0]["name"]; tint: string; title: string; sub?: string; anchor?: "left" | "right" | "center" }> = ({
  x,
  y,
  delay,
  dur,
  life,
  icon,
  tint,
  title,
  sub,
  anchor = "left",
}) => {
  const s = useIn(delay, { damping: 14, mass: 0.7 });
  const out = useOut(life ? Math.min(dur, delay + life) : dur);
  const tx = anchor === "left" ? "0%" : anchor === "right" ? "-100%" : "-50%";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) scale(${0.6 + s * 0.4})`, opacity: s * out, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.96)", borderRadius: 26, padding: "18px 28px 18px 18px", boxShadow: "0 24px 60px rgba(8,18,38,0.28)", whiteSpace: "nowrap" }}>
        <div style={{ width: 66, height: 66, borderRadius: 20, background: tint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={36} color="#fff" strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, letterSpacing: -0.5 }}>{title}</div>
          {sub ? <div style={{ fontSize: 24, color: COLORS.textMuted, fontWeight: 600, marginTop: 4 }}>{sub}</div> : null}
        </div>
      </div>
      {/* pointer */}
      <div style={{ position: "absolute", left: anchor === "left" ? 22 : anchor === "right" ? "auto" : "50%", right: anchor === "right" ? 22 : "auto", bottom: -12, width: 26, height: 26, background: "#fff", transform: "rotate(45deg)", marginLeft: anchor === "center" ? -13 : 0 }} />
    </div>
  );
};

// World-anchored card: follows a 3D point (e.g. the bus) through the camera projection.
export const WorldCard: React.FC<{
  point: (frame: number) => THREE.Vector3;
  offset?: [number, number];
  delay: number;
  dur: number;
  life?: number;
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
  title: string;
  sub?: string;
  anchor?: "left" | "right" | "center";
  sceneFrom: number; // frame offset of the enclosing sequence, to compute absolute frames
}> = ({ point, offset = [0, -140], sceneFrom, ...rest }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const abs = frame + sceneFrom;
  const bus = busState(abs);
  const pose = cameraPose(abs, bus);
  const p = projectToScreen(point(abs), pose, width, height);
  return <Card x={p.x + offset[0]} y={p.y + offset[1]} {...rest} />;
};

export const busPoint = (f: number) => busState(f).pos.clone().add(new THREE.Vector3(0, 1.3, 0));

// ---------------------------------------------------------------- Floating "?" (question scene)
export const Questions: React.FC<{ point: THREE.Vector3; sceneFrom: number; dur: number }> = ({ point, sceneFrom, dur }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const abs = frame + sceneFrom;
  const p = projectToScreen(point, cameraPose(abs, busState(abs)), width, height);
  const out = useOut(dur);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: out, fontFamily: FONT }}>
      {[0, 1, 2].map((i) => {
        const f = (frame - i * 24 + 200) % 72;
        const o = interpolate(f, [0, 18, 58, 72], [0, 1, 0.9, 0], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: -60 + i * 70 - 70, top: -f * 3 - 40, fontSize: 120 - i * 14, fontWeight: 800, color: i === 1 ? COLORS.orange : "#fff", opacity: o, textShadow: "0 8px 28px rgba(8,18,38,0.5)", transform: `rotate(${(i - 1) * 12}deg)` }}>
            ?
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Logo lockup (reveal)
export const LogoReveal: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 34, fps, config: { damping: 12, mass: 0.9 } });
  const flash = interpolate(frame, [28, 36, 52], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = useOut(dur);
  return (
    <>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: s * out, transform: `scale(${0.7 + s * 0.3})`, fontFamily: FONT }}>
        <div style={{ background: "#fff", borderRadius: 44, padding: 26, boxShadow: "0 30px 70px rgba(8,18,38,0.4)" }}>
          <RealLogo width={170} />
        </div>
        <Wordmark size={76} color="#fff" />
      </div>
    </>
  );
};

// Small brand chip at the bottom once the product is revealed.
export const BrandFooter: React.FC = () => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(8,18,38,0.6)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 100, padding: "10px 26px 10px 12px", backdropFilter: "blur(8px)" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 4, display: "flex" }}>
          <RealLogo width={34} />
        </div>
        <Wordmark size={30} color="#fff" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Stats row (school scene)
export const Stats: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = useOut(dur);
  const items: { v: string; l: string; tint: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { v: "3", l: "bus en route", tint: COLORS.orange, icon: "bus" },
    { v: "128", l: "élèves à bord", tint: COLORS.green, icon: "user" },
    { v: "0", l: "incident", tint: COLORS.blue, icon: "shield" },
  ];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 250, display: "flex", gap: 22, justifyContent: "center", opacity: out, fontFamily: FONT }}>
      {items.map((it, i) => {
        const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 14 } });
        return (
          <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.96)", borderRadius: 30, padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 24px 60px rgba(8,18,38,0.28)", opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: it.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={it.icon} size={34} color="#fff" strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.navy, lineHeight: 1 }}>{it.v}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.textMuted, textAlign: "center" }}>{it.l}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- Outro
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logo = spring({ frame: frame - 90, fps, config: { damping: 13 } });
  const tag = spring({ frame: frame - 112, fps, config: { damping: 20 } });
  const cta = spring({ frame: frame - 130, fps, config: { damping: 15 } });
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 30%, rgba(14,42,71,0.55) 0%, rgba(8,26,48,0.92) 100%)`, opacity: dim }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, marginTop: -40 }}>
        {[0, 1, 2].map((i) => {
          const r = ((frame - i * 18 + 200) % 54) / 54;
          return <div key={i} style={{ position: "absolute", width: 420 + r * 520, height: 420 + r * 520, borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.3 * (1 - r)})`, opacity: dim }} />;
        })}
        <div style={{ opacity: logo, transform: `scale(${0.6 + logo * 0.4})`, background: "#fff", borderRadius: 64, padding: 46, boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
          <RealLogo width={280} />
        </div>
        <div style={{ marginTop: 40, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>
          <Wordmark size={92} color="#fff" />
        </div>
        <div style={{ marginTop: 18, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`, color: "rgba(255,255,255,0.9)", fontSize: 44, fontWeight: 600 }}>
          La sérénité, à chaque trajet.
        </div>
        <div style={{ marginTop: 60, opacity: cta, transform: `translateY(${(1 - cta) * 16}px) scale(${0.9 + cta * 0.1})`, display: "flex", alignItems: "center", gap: 16, background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`, color: "#fff", fontSize: 36, fontWeight: 800, padding: "28px 54px", borderRadius: 100, boxShadow: `0 20px 50px ${COLORS.orange}66` }}>
          <Icon name="navigation" size={34} color="#fff" />
          Disponible sur iOS &amp; Android
        </div>
      </AbsoluteFill>
    </>
  );
};
