import React from "react";
import { COLORS } from "./theme";

// Minimal Feather-style line icons so nothing depends on emoji fonts
// (color emoji is not reliably available in the headless render browser).
type IconName =
  | "bus"
  | "pin"
  | "bell"
  | "check"
  | "clock"
  | "home"
  | "history"
  | "user"
  | "navigation"
  | "shield"
  | "lock"
  | "mail"
  | "chevron";

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size = 24, color = COLORS.navy, strokeWidth = 2 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "bus":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="14" rx="3" />
          <path d="M4 10h16" />
          <path d="M8 17v2M16 17v2" />
          <circle cx="8" cy="14" r="1.2" fill={color} stroke="none" />
          <circle cx="16" cy="14" r="1.2" fill={color} stroke="none" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 21v-7h6v7" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 4v4h4" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      );
    case "navigation":
      return (
        <svg {...common}>
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
  }
};

// A circular avatar with initials.
export const Avatar: React.FC<{
  initials: string;
  size?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
}> = ({ initials, size = 64, bg = COLORS.blue, color = "#fff", fontSize }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: bg,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: fontSize ?? size * 0.42,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

// Status / signal helpers for the phone status bar.
export const SignalBars: React.FC<{ color: string }> = ({ color }) => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill={color}>
    <rect x="0" y="11" width="4" height="7" rx="1" />
    <rect x="7" y="7" width="4" height="11" rx="1" />
    <rect x="14" y="3" width="4" height="15" rx="1" />
    <rect x="21" y="0" width="4" height="18" rx="1" opacity="0.35" />
  </svg>
);

export const Battery: React.FC<{ color: string }> = ({ color }) => (
  <svg width="30" height="16" viewBox="0 0 30 16" fill="none">
    <rect
      x="1"
      y="1"
      width="24"
      height="14"
      rx="4"
      stroke={color}
      strokeWidth="2"
      opacity="0.5"
    />
    <rect x="3.5" y="3.5" width="16" height="9" rx="2" fill={color} />
    <rect x="27" y="5" width="3" height="6" rx="1.5" fill={color} />
  </svg>
);
