import React from "react";
import { COLORS, FONT } from "./theme";

// The M'EyeBus mark: an eye whose iris is a little bus.
export const LogoMark: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* orange brow accent */}
      <path
        d="M26 74 C 66 44, 134 44, 174 74"
        stroke={COLORS.orange}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      {/* eye almond */}
      <path
        d="M16 102 C 52 50, 148 50, 184 102 C 148 154, 52 154, 16 102 Z"
        fill={COLORS.white}
        stroke={COLORS.navy}
        strokeWidth={12}
        strokeLinejoin="round"
      />
      {/* iris */}
      <circle cx="100" cy="102" r="44" fill={COLORS.blue} />
      <circle
        cx="100"
        cy="102"
        r="44"
        fill="none"
        stroke={COLORS.navy}
        strokeWidth={5}
      />
      {/* bus inside iris */}
      <rect x="76" y="88" width="48" height="30" rx="8" fill={COLORS.white} />
      <rect x="81" y="93" width="13" height="11" rx="2.5" fill={COLORS.blue} />
      <rect x="106" y="93" width="13" height="11" rx="2.5" fill={COLORS.blue} />
      <circle cx="86" cy="120" r="5.5" fill={COLORS.navy} />
      <circle cx="114" cy="120" r="5.5" fill={COLORS.navy} />
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
      letterSpacing: -1,
      display: "flex",
      alignItems: "baseline",
      lineHeight: 1,
    }}
  >
    <span>M’</span>
    <span style={{ color: COLORS.blue }}>Eye</span>
    <span>Bus</span>
  </div>
);
