import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../theme";

// ---------------------------------------------------------------------------
// Flat-vector characters, fully drawn in SVG so they stay crisp at any
// resolution (1080p, 4K…) and animate by code. Style: rounded, modern,
// brand-consistent. Each character exposes a light idle animation (breathing,
// blink, subtle motion) driven by the current frame.
// ---------------------------------------------------------------------------

const useBlink = () => {
  const frame = useCurrentFrame();
  // Blink for ~4 frames every ~80 frames.
  const t = frame % 80;
  return t > 76 ? 0.12 : 1;
};

const useBreath = (speed = 40, amp = 0.012) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amp;
};

// --------------------------------------------------------------- Child (waiting)
export const Child: React.FC<{ cold?: boolean }> = ({ cold = false }) => {
  const frame = useCurrentFrame();
  const blink = useBlink();
  const breath = useBreath();
  // A cold shiver: tiny high-frequency horizontal jitter when `cold`.
  const shiver = cold ? Math.sin(frame / 2.2) * 1.4 : 0;
  // Head turns slowly left/right looking for the bus.
  const look = Math.sin(frame / 45) * 6;

  return (
    <svg width={420} height={620} viewBox="0 0 420 620" style={{ transform: `translateX(${shiver}px)` }}>
      <defs>
        <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC24B" />
          <stop offset="1" stopColor={COLORS.orange} />
        </linearGradient>
        <linearGradient id="pack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.blueSoft} />
          <stop offset="1" stopColor={COLORS.blueDark} />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="210" cy="585" rx="120" ry="20" fill="rgba(0,0,0,0.18)" />

      <g transform={`translate(210 320) scale(${breath}) translate(-210 -320)`}>
        {/* legs */}
        <rect x="172" y="470" width="28" height="86" rx="14" fill="#2B3A52" />
        <rect x="220" y="470" width="28" height="86" rx="14" fill="#22304A" />
        {/* boots */}
        <rect x="164" y="548" width="46" height="26" rx="12" fill="#16233A" />
        <rect x="212" y="548" width="46" height="26" rx="12" fill="#16233A" />

        {/* backpack peeking */}
        <rect x="250" y="300" width="60" height="120" rx="26" fill="url(#pack)" />

        {/* body / raincoat */}
        <path
          d="M150 320c0-44 26-72 60-72s60 28 60 72v150c0 14-12 24-26 24h-68c-14 0-26-10-26-24z"
          fill="url(#coat)"
        />
        {/* coat seam + buttons */}
        <path d="M210 252v240" stroke="rgba(0,0,0,0.10)" strokeWidth="4" />
        <circle cx="210" cy="360" r="5" fill="rgba(0,0,0,0.14)" />
        <circle cx="210" cy="400" r="5" fill="rgba(0,0,0,0.14)" />
        {/* arms */}
        <rect x="138" y="320" width="26" height="120" rx="13" fill="#F1A23B" />
        <rect x="256" y="320" width="26" height="120" rx="13" fill="#E07B16" />

        {/* head */}
        <g transform={`rotate(${look} 210 200)`}>
          {/* hood */}
          <path d="M156 196a54 54 0 0 1 108 0c0 8-6 12-14 12H170c-8 0-14-4-14-12z" fill="#E07B16" />
          {/* face */}
          <circle cx="210" cy="186" r="50" fill="#F8C9A4" />
          {/* hair fringe */}
          <path d="M162 176a48 48 0 0 1 96 0c-10-6-20-6-26 2-8-8-16-8-22 0-8-8-16-8-22-2-8-4-16-4-26 0z" fill="#5A3A23" />
          {/* eyes */}
          <g transform={`scaleY(${blink})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="194" cy="188" r="6" fill="#1B2A40" />
            <circle cx="226" cy="188" r="6" fill="#1B2A40" />
          </g>
          {/* rosy cold cheeks */}
          {cold && (
            <>
              <circle cx="184" cy="202" r="9" fill="rgba(226,87,76,0.32)" />
              <circle cx="236" cy="202" r="9" fill="rgba(226,87,76,0.32)" />
            </>
          )}
          {/* small worried mouth */}
          <path d="M198 210q12 -8 24 0" stroke="#7A4A2E" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

// --------------------------------------------------------------- Parent (anxious)
export const Parent: React.FC<{ anxious?: boolean }> = ({ anxious = true }) => {
  const frame = useCurrentFrame();
  const blink = useBlink();
  const breath = useBreath(34, 0.014);
  // Anxious: phone hand taps, head tilts.
  const tilt = anxious ? Math.sin(frame / 18) * 3 : 0;
  const tap = anxious ? Math.sin(frame / 6) * 4 : 0;

  return (
    <svg width={440} height={640} viewBox="0 0 440 640">
      <defs>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.blueSoft} />
          <stop offset="1" stopColor={COLORS.blue} />
        </linearGradient>
      </defs>

      <ellipse cx="220" cy="600" rx="130" ry="20" fill="rgba(0,0,0,0.18)" />

      <g transform={`translate(220 330) scale(${breath}) translate(-220 -330)`}>
        {/* legs */}
        <rect x="182" y="470" width="32" height="110" rx="16" fill="#33415C" />
        <rect x="226" y="470" width="32" height="110" rx="16" fill="#2A3750" />
        <rect x="176" y="572" width="48" height="24" rx="11" fill="#16233A" />
        <rect x="222" y="572" width="48" height="24" rx="11" fill="#16233A" />

        {/* torso */}
        <path d="M150 330c0-46 30-78 70-78s70 32 70 78v140c0 14-12 24-26 24H176c-14 0-26-10-26-24z" fill="url(#shirt)" />

        {/* left arm relaxed */}
        <rect x="138" y="332" width="28" height="130" rx="14" fill={COLORS.blueDark} />

        {/* right arm holding phone, up near face */}
        <g transform={`translate(${tap} 0)`}>
          <rect x="270" y="300" width="28" height="120" rx="14" fill={COLORS.blueDark} transform="rotate(-28 284 360)" />
          {/* phone */}
          <g transform="rotate(-10 320 300)">
            <rect x="300" y="262" width="54" height="92" rx="12" fill="#16233A" />
            <rect x="306" y="270" width="42" height="76" rx="6" fill="#0E2A47" />
            {/* blank/empty screen — no info */}
            <circle cx="327" cy="308" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
            <path d="M327 304v5l3 2" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* head */}
        <g transform={`rotate(${tilt} 220 196)`}>
          <circle cx="220" cy="190" r="52" fill="#E9B690" />
          {/* hair */}
          <path d="M168 182a52 52 0 0 1 104 0c-8-22-28-36-52-36s-44 14-52 36z" fill="#2B2118" />
          {/* eyebrows raised (worry) */}
          <path d="M196 168q10 -8 20 -2" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M224 166q10 -6 20 2" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* eyes */}
          <g transform={`scaleY(${blink})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="204" cy="190" r="6" fill="#1B2A40" />
            <circle cx="236" cy="190" r="6" fill="#1B2A40" />
          </g>
          {/* worried mouth */}
          <path d="M206 218q14 -10 28 0" stroke="#9A5A3E" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* sweat drop when anxious */}
          {anxious && <path d="M266 176c6 8 10 14 10 19a10 10 0 0 1-20 0c0-5 4-11 10-19z" fill="#7FC8F0" opacity={interpolate(frame % 90, [0, 30, 60, 90], [0, 1, 1, 0])} />}
        </g>
      </g>
    </svg>
  );
};
