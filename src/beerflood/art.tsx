import React from "react";
import { AbsoluteFill, Img, getStaticFiles, staticFile, useCurrentFrame } from "remotion";
import { T } from "./theme";

// Illustrations: if public/beerflood/<name>.(jpg|png|webp) exists, use the AI
// illustration; otherwise fall back to the code-drawn placeholder scene below.
const findArt = (name: string): string | null => {
  const files = getStaticFiles();
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const hit = files.find((f) => f.name === `beerflood/${name}.${ext}`);
    if (hit) return hit.name;
  }
  return null;
};

export const Illustration: React.FC<{ name: "wave" | "fox" }> = ({ name }) => {
  const file = findArt(name);
  if (file) {
    return <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return name === "wave" ? <WaveArt /> : <FoxArt />;
};

// ---------------------------------------------------------------------------
// Placeholder 1: Georgian street + bursting vat + beer wave (SVG, animated).
// ---------------------------------------------------------------------------
const WINDOWS = Array.from({ length: 24 }, (_, i) => ({ x: 70 + (i % 6) * 160, y: 520 + Math.floor(i / 6) * 150 }));

const WaveArt: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 9) * 14;
  const foamY = Math.sin(frame / 6) * 8;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0F3A3F 0%, #1A4D3A 55%, ${T.bgDeep} 100%)` }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* moon */}
        <circle cx="880" cy="250" r="90" fill="#F6EFC9" opacity="0.9" />
        {/* buildings */}
        <rect x="0" y="420" width="1080" height="900" fill="#5A3A2E" stroke={T.ink} strokeWidth="10" />
        <rect x="0" y="420" width="1080" height="36" fill="#3B2419" />
        {WINDOWS.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width="80" height="110" rx="6" fill={i % 3 === 0 ? "#F6D27A" : "#20323A"} stroke={T.ink} strokeWidth="8" />
        ))}
        {/* brewery vat on the roof */}
        <g transform="translate(540 300)">
          <ellipse cx="0" cy="130" rx="250" ry="40" fill="#4A2A1A" stroke={T.ink} strokeWidth="10" />
          <rect x="-250" y="-110" width="500" height="240" fill="#8A5A3A" stroke={T.ink} strokeWidth="10" />
          <ellipse cx="0" cy="-110" rx="250" ry="40" fill="#A8734A" stroke={T.ink} strokeWidth="10" />
          {[-60, 20, 90].map((y) => (
            <rect key={y} x="-256" y={y} width="512" height="18" fill="#555" stroke={T.ink} strokeWidth="6" />
          ))}
          {/* cracks */}
          <path d="M 60 -80 L 40 0 L 90 40 L 60 120" stroke={T.ink} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M -120 -40 L -90 30 L -140 110" stroke={T.ink} strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* beer bursting out */}
          <path d={`M 40 0 C 160 ${-40 + sway} 330 60 420 260 L 250 260 C 200 160 140 110 60 90 Z`} fill={T.amber} stroke={T.ink} strokeWidth="10" />
        </g>
        {/* street */}
        <rect x="0" y="1320" width="1080" height="600" fill="#2A2A2E" />
        {/* wave: back, mid, front */}
        <path
          d={`M -50 ${1260 + sway} C 150 ${1120 + sway} 330 ${1340 - sway} 520 ${1200 + sway} C 720 ${1050 + sway} 900 ${1300} 1130 ${1180 + sway} L 1130 1920 L -50 1920 Z`}
          fill={T.amberDeep}
          stroke={T.ink}
          strokeWidth="12"
        />
        <path
          d={`M -50 ${1420 - sway} C 200 ${1300 - sway} 380 ${1520 + sway} 560 ${1390 - sway} C 760 ${1250 - sway} 920 ${1480} 1130 ${1360 - sway} L 1130 1920 L -50 1920 Z`}
          fill={T.amber}
          stroke={T.ink}
          strokeWidth="12"
        />
        {/* foam */}
        {[60, 230, 420, 560, 700, 860, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1330 + (i % 2) * 70 + foamY * (i % 2 ? -1 : 1)} r={38 + (i % 3) * 14} fill={T.foam} stroke={T.ink} strokeWidth="8" />
        ))}
        {/* running silhouettes */}
        {[140, 900].map((x, i) => {
          const leg = Math.sin(frame / 3 + i) * 18;
          return (
            <g key={i} transform={`translate(${x} 1520) scale(${i === 0 ? -1 : 1} 1)`}>
              <circle cx="0" cy="-130" r="32" fill={T.ink} />
              <rect x="-26" y="-100" width="52" height="110" rx="14" fill={T.ink} />
              <path d={`M -10 10 L ${-40 + leg} 90 M 10 10 L ${40 - leg} 90`} stroke={T.ink} strokeWidth="22" strokeLinecap="round" />
              <rect x="-46" y="-150" width="92" height="22" rx="6" fill={T.ink} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Placeholder 2: fox narrator in a black suit on the flat green canvas.
// ---------------------------------------------------------------------------
const FoxArt: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 20) * 6;
  const blink = frame % 90 > 84 ? 0.1 : 1;
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* shadow */}
        <ellipse cx="540" cy="1660" rx="300" ry="40" fill="rgba(0,0,0,0.35)" />
        {/* barrel */}
        <g transform="translate(820 1400)">
          <rect x="-110" y="-150" width="220" height="300" rx="40" fill="#8A5A3A" stroke={T.ink} strokeWidth="10" />
          {[-90, 0, 90].map((y) => (
            <rect key={y} x="-116" y={y - 10} width="232" height="20" fill="#555" stroke={T.ink} strokeWidth="6" />
          ))}
          <ellipse cx="0" cy="-150" rx="110" ry="26" fill="#A8734A" stroke={T.ink} strokeWidth="10" />
        </g>
        <g transform={`translate(0 ${breathe})`}>
          {/* legs */}
          <rect x="430" y="1300" width="90" height="330" rx="30" fill={T.ink} />
          <rect x="560" y="1300" width="90" height="330" rx="30" fill={T.ink} />
          <ellipse cx="465" cy="1640" rx="80" ry="30" fill="#5A3A2E" stroke={T.ink} strokeWidth="8" />
          <ellipse cx="615" cy="1640" rx="80" ry="30" fill="#5A3A2E" stroke={T.ink} strokeWidth="8" />
          {/* suit */}
          <path d="M 330 900 L 750 900 L 800 1330 L 280 1330 Z" fill={T.ink} />
          <path d="M 470 900 L 610 900 L 580 1180 L 500 1180 Z" fill={T.white} />
          <path d="M 540 930 L 575 980 L 548 1180 L 532 1180 L 505 980 Z" fill={T.red} stroke={T.ink} strokeWidth="6" />
          {/* arms */}
          <path d="M 340 940 C 230 1000 240 1180 300 1260" stroke={T.ink} strokeWidth="70" fill="none" strokeLinecap="round" />
          <path d="M 740 940 C 870 960 900 1120 860 1200" stroke={T.ink} strokeWidth="70" fill="none" strokeLinecap="round" />
          {/* parchment in left hand */}
          <g transform="translate(250 1180) rotate(-12)">
            <rect x="-90" y="-120" width="190" height="240" rx="10" fill={T.paper} stroke={T.ink} strokeWidth="8" />
            {[-70, -30, 10, 50].map((y) => (
              <rect key={y} x="-60" y={y} width={y === 50 ? 70 : 130} height="12" rx="6" fill="#9A8A6A" />
            ))}
            <circle cx="55" cy="85" r="24" fill={T.red} stroke={T.ink} strokeWidth="6" />
          </g>
          <circle cx="300" cy="1260" r="40" fill="#E58A3A" stroke={T.ink} strokeWidth="8" />
          <circle cx="860" cy="1200" r="40" fill="#E58A3A" stroke={T.ink} strokeWidth="8" />
          {/* head */}
          <path d="M 400 560 L 350 380 L 470 520 Z" fill="#E58A3A" stroke={T.ink} strokeWidth="10" strokeLinejoin="round" />
          <path d="M 680 560 L 730 380 L 610 520 Z" fill="#E58A3A" stroke={T.ink} strokeWidth="10" strokeLinejoin="round" />
          <ellipse cx="540" cy="680" rx="200" ry="190" fill="#E58A3A" stroke={T.ink} strokeWidth="10" />
          <ellipse cx="540" cy="760" rx="135" ry="100" fill={T.foam} stroke={T.ink} strokeWidth="8" />
          <ellipse cx="540" cy="730" rx="34" ry="24" fill={T.ink} />
          {/* eyes (smug) */}
          <g transform={`scale(1 ${blink})`} style={{ transformOrigin: "540px 640px", transformBox: "view-box" }}>
            <ellipse cx="470" cy="640" rx="44" ry="34" fill={T.white} stroke={T.ink} strokeWidth="8" />
            <ellipse cx="610" cy="640" rx="44" ry="34" fill={T.white} stroke={T.ink} strokeWidth="8" />
            <circle cx="482" cy="646" r="14" fill={T.ink} />
            <circle cx="622" cy="646" r="14" fill={T.ink} />
          </g>
          <path d="M 420 600 L 500 618" stroke={T.ink} strokeWidth="12" strokeLinecap="round" />
          <path d="M 660 590 L 585 618" stroke={T.ink} strokeWidth="12" strokeLinecap="round" />
          {/* grin */}
          <path d="M 460 800 Q 540 850 630 790" stroke={T.ink} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 560 815 L 575 835 L 592 808" fill={T.white} stroke={T.ink} strokeWidth="5" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
