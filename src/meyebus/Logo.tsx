import React from "react";
import { COLORS, FONT } from "./theme";

// Faithful vector reproduction of the real M'EyeBus badge:
// a crest with a thick navy outer border + thin orange inner liseré,
// the "M'EyeBus" wordmark (the apostrophe is an orange location pin),
// and an orange school bus driving up a navy "M"-shaped road with
// orange dashed lane markings.

const SHIELD =
  "M64 30 Q150 15 236 30 Q257 35 257 64 L257 152 Q257 256 150 324 Q43 256 43 152 L43 64 Q43 35 64 30 Z";
const ROAD =
  "M112 280 C 114 240 118 206 134 184 C 144 202 148 232 150 246 C 152 232 156 202 166 184 C 182 206 186 240 188 280";

const CX = 150;
const CY = 178;
const scaleAbout = (s: number) =>
  `translate(${CX * (1 - s)} ${CY * (1 - s)}) scale(${s})`;

// Orange location pin used as the apostrophe of M'EyeBus.
const Pin: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={(w * 32) / 24} viewBox="0 0 24 32" fill="none" style={{ display: "block" }}>
    <path d="M12 0.5 C5.4 0.5 0.5 5.4 0.5 12 C0.5 20 12 31.5 12 31.5 C12 31.5 23.5 20 23.5 12 C23.5 5.4 18.6 0.5 12 0.5 Z" fill={COLORS.orange} />
    <circle cx="12" cy="12" r="4.6" fill="#FFFFFF" />
  </svg>
);

export const LogoMark: React.FC<{ size?: number; showText?: boolean }> = ({
  size = 200,
  showText = true,
}) => {
  const h = (size * 340) / 300;
  return (
    <svg width={size} height={h} viewBox="0 0 300 340" fill="none">
      {/* shield: navy outer border -> white gap -> orange liseré -> white field */}
      <path d={SHIELD} fill={COLORS.navy} />
      <path d={SHIELD} fill={COLORS.white} transform={scaleAbout(0.92)} />
      <path d={SHIELD} fill={COLORS.orange} transform={scaleAbout(0.895)} />
      <path d={SHIELD} fill={COLORS.white} transform={scaleAbout(0.875)} />

      {/* wordmark with pin apostrophe */}
      {showText ? (
        <>
          <text x="76" y="84" textAnchor="start" fontFamily={FONT} fontWeight={800} fontSize="30" letterSpacing="-1.5" fill={COLORS.navy}>
            M
          </text>
          <g transform="translate(104 56)">
            <Pin w={14} />
          </g>
          <text x="121" y="84" textAnchor="start" fontFamily={FONT} fontWeight={800} fontSize="30" letterSpacing="-1.5" fill={COLORS.navy}>
            EyeBus
          </text>
        </>
      ) : null}

      {/* navy "M" road with orange dashes */}
      <path d={ROAD} fill="none" stroke={COLORS.navy} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ROAD} fill="none" stroke={COLORS.orange} strokeWidth="5" strokeLinecap="round" strokeDasharray="5 14" />

      {/* orange school bus driving up the right ramp */}
      <g transform="translate(176 166) rotate(-20)">
        <rect x="-30" y="-17" width="60" height="33" rx="8" fill={COLORS.orange} stroke={COLORS.navy} strokeWidth="3.5" />
        <rect x="-23" y="-10" width="38" height="12" rx="3" fill="#FFFFFF" />
        <line x1="-10" y1="-10" x2="-10" y2="2" stroke={COLORS.navy} strokeWidth="2.5" />
        <line x1="3" y1="-10" x2="3" y2="2" stroke={COLORS.navy} strokeWidth="2.5" />
        <rect x="19" y="-6" width="7" height="8" rx="2" fill="#FFFFFF" />
        <circle cx="-15" cy="16" r="6" fill={COLORS.navy} />
        <circle cx="15" cy="16" r="6" fill={COLORS.navy} />
      </g>
    </svg>
  );
};

export const Wordmark: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = COLORS.navy,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      color,
      letterSpacing: -2,
      display: "flex",
      alignItems: "flex-start",
      lineHeight: 1,
    }}
  >
    <span>M</span>
    <span style={{ margin: `${size * 0.02}px ${size * 0.01}px 0`, alignSelf: "flex-start" }}>
      <Pin w={size * 0.34} />
    </span>
    <span>EyeBus</span>
  </div>
);
