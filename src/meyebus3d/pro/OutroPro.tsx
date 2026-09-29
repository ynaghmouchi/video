import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS, FONT } from "../../meyebus/theme";
import { SHIELD, scaleAbout, Pin, LogoBus, Wordmark } from "../../meyebus/Logo";
import { Icon } from "../../meyebus/ui";
import { ROUTE, outroPose, projectToScreen } from "../timeline";
import { ROAD_W } from "./RoadPro";

// ------------------------------------------------------------------ geometry
// The badge's road ("M") as 4 cubic Béziers, in the 300x340 logo space.
const LOGO_ROAD: [number, number][][] = [
  [[112, 280], [114, 240], [118, 206], [134, 184]],
  [[134, 184], [144, 202], [148, 232], [150, 246]],
  [[150, 246], [152, 232], [156, 202], [166, 184]],
  [[166, 184], [182, 206], [186, 240], [188, 280]],
];
const cubic = (p: [number, number][], t: number): [number, number] => {
  const it = 1 - t;
  const a = it * it * it;
  const b = 3 * it * it * t;
  const c = 3 * it * t * t;
  const d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
};
// N points spaced by arc length along the badge road.
const logoRoadPoints = (n: number): [number, number][] => {
  const dense: [number, number][] = [];
  for (const seg of LOGO_ROAD) for (let i = 0; i <= 120; i++) dense.push(cubic(seg, i / 120));
  const cum = [0];
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = cum[cum.length - 1];
  const out: [number, number][] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (j < cum.length - 2 && cum[j + 1] < target) j++;
    const span = cum[j + 1] - cum[j] || 1;
    const t = (target - cum[j]) / span;
    out.push([dense[j][0] + (dense[j + 1][0] - dense[j][0]) * t, dense[j][1] + (dense[j + 1][1] - dense[j][1]) * t]);
  }
  return out;
};

const N = 90;
const LOGO_W = 300; // final badge width in px
const K = LOGO_W / 300;
const LOGO_H = 340 * K;
const CARD_PAD = 44;
const CARD_CX = 540;
const CARD_CY = 700;
const OX = CARD_CX - LOGO_W / 2;
const OY = CARD_CY - LOGO_H / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ramp = (f: number, a: number, b: number, easing?: (t: number) => number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ------------------------------------------------------------------ outro
// The top-down "M" road morphs into the badge's road, the shield draws itself
// around it, then the drawing hands over to the real logo.
export const OutroPro: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const geo = useMemo(() => {
    const pose = outroPose();
    const road: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const p = projectToScreen(ROUTE.getPointAt(i / (N - 1)), pose, width, height);
      road.push([p.x, p.y]);
    }
    const o = projectToScreen(new THREE.Vector3(0, 0, 0), pose, width, height);
    const w = projectToScreen(new THREE.Vector3(ROAD_W, 0, 0), pose, width, height);
    const ppu = Math.hypot(w.x - o.x, w.y - o.y) / ROAD_W; // pixels per world unit
    const logo = logoRoadPoints(N).map(([x, y]) => [OX + x * K, OY + y * K] as [number, number]);
    return { road, ppu, logo };
  }, [width, height]);

  const wash = ramp(f, 105, 145, Easing.inOut(Easing.quad));
  const svgIn = ramp(f, 108, 126);
  const u = ramp(f, 132, 196, Easing.inOut(Easing.cubic));
  const shieldDraw = ramp(f, 150, 202, Easing.out(Easing.cubic));
  const shieldFill = ramp(f, 190, 212);
  const wordIn = ramp(f, 178, 200);
  const busIn = ramp(f, 186, 206);
  const toReal = ramp(f, 208, 230);
  const navyIn = ramp(f, 212, 242, Easing.inOut(Easing.quad));
  const wm = spring({ frame: f - 232, fps, config: { damping: 18 } });
  const tag = spring({ frame: f - 244, fps, config: { damping: 20 } });
  const cta = spring({ frame: f - 256, fps, config: { damping: 15 } });

  // morphing road
  const pts = geo.road.map(([x, y], i) => [lerp(x, geo.logo[i][0], u), lerp(y, geo.logo[i][1], u)]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const roadW = lerp(ROAD_W * geo.ppu, 24 * K, u);
  const dashW = lerp(0.12 * geo.ppu, 5 * K, u);
  const dashOn = lerp(0.6 * geo.ppu, 5 * K, u);
  const dashOff = lerp(0.7 * geo.ppu, 14 * K, u);
  const vectorOpacity = svgIn * (1 - toReal);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* white wash over the 3D world */}
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: wash }} />
      {/* navy brand background closing in, the white card remains */}
      <AbsoluteFill style={{ background: `radial-gradient(130% 100% at 50% -10%, #11365F 0%, ${COLORS.navy} 45%, ${COLORS.navyDeep} 100%)`, opacity: navyIn }} />
      {[0, 1, 2].map((i) => {
        const r = ((f - i * 18 + 400) % 54) / 54;
        return <div key={i} style={{ position: "absolute", left: CARD_CX, top: CARD_CY, width: 460 + r * 560, height: 460 + r * 560, marginLeft: -(230 + r * 280), marginTop: -(230 + r * 280), borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.3 * (1 - r)})`, opacity: navyIn }} />;
      })}
      <div style={{ position: "absolute", left: OX - CARD_PAD, top: OY - CARD_PAD, width: LOGO_W + CARD_PAD * 2, height: LOGO_H + CARD_PAD * 2, borderRadius: 60, background: "#FFFFFF", boxShadow: `0 40px 90px rgba(0,0,0,${0.5 * navyIn})`, opacity: wash }} />

      {/* vector drawing: morphing road + shield + wordmark + bus */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: vectorOpacity }}>
        <g transform={`translate(${OX} ${OY}) scale(${K})`}>
          {/* shield outline draws itself, then fills in */}
          <g opacity={shieldFill}>
            <path d={SHIELD} fill={COLORS.navy} />
            <path d={SHIELD} fill={COLORS.white} transform={scaleAbout(0.92)} />
            <path d={SHIELD} fill={COLORS.orange} transform={scaleAbout(0.895)} />
            <path d={SHIELD} fill={COLORS.white} transform={scaleAbout(0.875)} />
          </g>
          <path d={SHIELD} fill="none" stroke={COLORS.navy} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - shieldDraw} opacity={1 - shieldFill} strokeLinecap="round" />
          <path d={SHIELD} fill="none" stroke={COLORS.orange} strokeWidth={2.5} transform={scaleAbout(0.895)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(shieldDraw * 1.15 - 0.1)} opacity={1 - shieldFill} strokeLinecap="round" />
        </g>
        <path d={d} fill="none" stroke={COLORS.navy} strokeWidth={roadW} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={COLORS.orange} strokeWidth={dashW} strokeLinecap="round" strokeDasharray={`${dashOn} ${dashOff}`} />
        <g transform={`translate(${OX} ${OY}) scale(${K})`}>
          <g opacity={wordIn} transform={`translate(0 ${(1 - wordIn) * 10})`}>
            <text x="76" y="84" fontFamily={FONT} fontWeight={800} fontSize="30" letterSpacing="-1.5" fill={COLORS.navy}>
              M
            </text>
            <g transform="translate(104 56)">
              <foreignObject width="14" height="20">
                <Pin w={14} />
              </foreignObject>
            </g>
            <text x="121" y="84" fontFamily={FONT} fontWeight={800} fontSize="30" letterSpacing="-1.5" fill={COLORS.navy}>
              EyeBus
            </text>
          </g>
          <LogoBus opacity={busIn} />
        </g>
      </svg>

      {/* the real badge takes over */}
      <div style={{ position: "absolute", left: OX, top: OY, width: LOGO_W, opacity: toReal }}>
        <Img src={staticFile("logo.png")} style={{ width: LOGO_W, height: LOGO_H, display: "block" }} />
      </div>

      {/* wordmark, tagline, CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, top: OY + LOGO_H + CARD_PAD + 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ opacity: wm, transform: `translateY(${(1 - wm) * 16}px)` }}>
          <Wordmark size={92} color="#fff" />
        </div>
        <div style={{ opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`, color: "rgba(255,255,255,0.9)", fontSize: 44, fontWeight: 600 }}>La sérénité, à chaque trajet.</div>
        <div style={{ marginTop: 34, opacity: cta, transform: `translateY(${(1 - cta) * 16}px) scale(${0.9 + cta * 0.1})`, display: "flex", alignItems: "center", gap: 16, background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`, color: "#fff", fontSize: 36, fontWeight: 800, padding: "28px 54px", borderRadius: 100, boxShadow: `0 20px 50px ${COLORS.orange}66` }}>
          <Icon name="navigation" size={34} color="#fff" />
          Disponible sur iOS &amp; Android
        </div>
      </div>
    </AbsoluteFill>
  );
};
