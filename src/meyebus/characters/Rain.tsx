import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Code-driven rain: deterministic per-drop streaks falling on a loop.
export const Rain: React.FC<{ count?: number; opacity?: number }> = ({ count = 90, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        {Array.from({ length: count }).map((_, i) => {
          const x = random(`x${i}`) * 1080;
          const speed = 220 + random(`s${i}`) * 180;
          const len = 28 + random(`l${i}`) * 30;
          const phase = random(`p${i}`) * 1920;
          const y = (frame * speed + phase) % 2000;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - 7}
              y2={y + len}
              stroke="rgba(190,215,240,1)"
              strokeWidth={2.2}
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
