import React from "react";
import { COLORS, FONT } from "./theme";
import { SignalBars, Battery } from "./ui";

export const PHONE_W = 600;
export const PHONE_H = 1280;
export const BEZEL = 15;
export const INNER_W = PHONE_W - BEZEL * 2; // 570
export const INNER_H = PHONE_H - BEZEL * 2; // 1250

export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? COLORS.white : COLORS.navy;
  return (
    <div
      style={{
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        fontFamily: FONT,
        color: c,
        fontWeight: 700,
        fontSize: 22,
        position: "relative",
        zIndex: 20,
      }}
    >
      <span>8:24</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <SignalBars color={c} />
        <span style={{ fontSize: 17, fontWeight: 800 }}>5G</span>
        <Battery color={c} />
      </div>
    </div>
  );
};

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  screenBg?: string;
  notch?: boolean;
}> = ({ children, screenBg = COLORS.bg, notch = true }) => (
  <div
    style={{
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: 60,
      background: "#0A1626",
      padding: BEZEL,
      boxShadow:
        "0 50px 110px rgba(4,14,32,0.55), 0 14px 34px rgba(4,14,32,0.40), inset 0 0 0 2px rgba(255,255,255,0.06)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 46,
        overflow: "hidden",
        background: screenBg,
        position: "relative",
        fontFamily: FONT,
      }}
    >
      {/* dynamic island / notch */}
      {notch ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 132,
            height: 28,
            borderRadius: 16,
            background: "#0A1626",
            zIndex: 30,
          }}
        />
      ) : null}
      {children}
    </div>
  </div>
);
