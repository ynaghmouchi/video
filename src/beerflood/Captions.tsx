import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY, SPRING, T } from "./theme";
import { WORDS } from "./vo.gen";

// One word at a time, yellow comic lettering with a thick black outline,
// popping in with a spring and a slight tilt (reference: "CAISSE", "MALUS"...).
const HOLD = 0.18; // seconds a word stays after its end if the next hasn't started
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < WORDS.length; i++) {
    const w = WORDS[i];
    const next = WORDS[i + 1];
    const until = next ? Math.min(w.end + HOLD, next.start) : w.end + HOLD;
    if (t >= w.start && t < until) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return null;
  const w = WORDS[idx];
  const startFrame = Math.round(w.start * fps);
  const s = spring({ frame: frame - startFrame, fps, config: SPRING.pop });
  const tilt = idx % 2 === 0 ? -4 : 3;
  const clean = w.text.replace(/[.,!?;:]+$/g, "").toUpperCase();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1270, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 118,
          lineHeight: 1,
          color: T.caption,
          WebkitTextStroke: `9px ${T.ink}`,
          paintOrder: "stroke fill",
          letterSpacing: 3,
          textShadow: `0 10px 0 ${T.ink}, 0 18px 30px rgba(0,0,0,0.55)`,
          transform: `rotate(${tilt}deg) scale(${0.55 + s * 0.45})`,
          opacity: Math.min(1, s * 2),
          padding: "0 40px",
        }}
      >
        {clean}
      </div>
    </div>
  );
};
