import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { StatusBar, INNER_W, INNER_H } from "../PhoneFrame";
import { Avatar, Icon } from "../ui";

const W = INNER_W;
const H = INNER_H;

// Route waypoints from the school (top) down to home (bottom-left).
const ROUTE = [
  { x: 290, y: 210 },
  { x: 290, y: 380 },
  { x: 452, y: 380 },
  { x: 452, y: 600 },
  { x: 250, y: 600 },
  { x: 250, y: 840 },
  { x: 140, y: 840 },
  { x: 140, y: 1020 },
];

const segLengths = ROUTE.slice(1).map((p, i) =>
  Math.hypot(p.x - ROUTE[i].x, p.y - ROUTE[i].y),
);
const TOTAL_LEN = segLengths.reduce((a, b) => a + b, 0);
const PATH_D = ROUTE.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

function pointAtT(t: number) {
  const clamped = Math.max(0, Math.min(1, t));
  let dist = clamped * TOTAL_LEN;
  for (let i = 0; i < segLengths.length; i++) {
    if (dist <= segLengths[i] || i === segLengths.length - 1) {
      const f = segLengths[i] === 0 ? 0 : dist / segLengths[i];
      const a = ROUTE[i];
      const b = ROUTE[i + 1];
      return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
        angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
      };
    }
    dist -= segLengths[i];
  }
  return { ...ROUTE[ROUTE.length - 1], angle: 0 };
}

export const TrackingScreen: React.FC<{ arrived?: boolean }> = ({ arrived }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = arrived
    ? 1
    : interpolate(frame, [12, 150], [0.04, 0.97], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const bus = pointAtT(progress);
  const traveled = progress * TOTAL_LEN;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  const etaMin = Math.max(0, Math.round((1 - progress) * 9));

  const bannerSpring = spring({ frame: frame - 6, fps, config: { damping: 14 } });

  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.mapBg, position: "relative" }}>
      {/* ---- MAP ---- */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* parks + water */}
        <rect x="20" y="120" width="170" height="150" rx="26" fill={COLORS.mapGreen} />
        <rect x="360" y="700" width="230" height="210" rx="30" fill={COLORS.mapGreen} />
        <path d="M430 980 Q520 950 590 1010 L590 1260 L360 1260 Q380 1080 430 980 Z" fill={COLORS.mapWater} />
        {/* faint cross streets */}
        {[300, 520, 760, 960].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#fff" strokeWidth="10" opacity="0.7" />
        ))}
        {[160, 380].map((x) => (
          <line key={x} x1={x} y1="120" x2={x} y2={H} stroke="#fff" strokeWidth="10" opacity="0.7" />
        ))}

        {/* route: casing, road, line */}
        <path d={PATH_D} fill="none" stroke="#C9D4E2" strokeWidth="36" strokeLinejoin="round" strokeLinecap="round" />
        <path d={PATH_D} fill="none" stroke="#fff" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round" />
        <path d={PATH_D} fill="none" stroke={COLORS.blue} strokeWidth="9" opacity="0.22" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={PATH_D}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth="9"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={`${traveled} ${TOTAL_LEN}`}
        />

        {/* school marker (start) */}
        <g>
          <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r="26" fill="#fff" stroke={COLORS.navy} strokeWidth="4" />
          <g transform={`translate(${ROUTE[0].x - 13} ${ROUTE[0].y - 13})`}>
            <Icon name="home" size={26} color={COLORS.navy} />
          </g>
        </g>

        {/* destination pin (home) */}
        <g>
          <ellipse cx={ROUTE[ROUTE.length - 1].x} cy={ROUTE[ROUTE.length - 1].y + 6} rx={18 + pulse * 6} ry="6" fill={COLORS.orange} opacity="0.18" />
          <path
            d={`M ${ROUTE[ROUTE.length - 1].x} ${ROUTE[ROUTE.length - 1].y + 4} c -22 -26 -22 -54 0 -54 c 22 0 22 28 0 54 z`}
            fill={COLORS.orange}
          />
          <circle cx={ROUTE[ROUTE.length - 1].x} cy={ROUTE[ROUTE.length - 1].y - 28} r="10" fill="#fff" />
        </g>

        {/* GPS pulse + bus marker */}
        <circle cx={bus.x} cy={bus.y} r={26 + pulse * 26} fill={COLORS.blue} opacity={0.12 * (1 - pulse)} />
        <circle cx={bus.x} cy={bus.y} r="30" fill="#fff" stroke={COLORS.blue} strokeWidth="5" />
        <g transform={`translate(${bus.x - 16} ${bus.y - 16})`}>
          <Icon name="bus" size={32} color={COLORS.blue} />
        </g>
      </svg>

      {/* ---- OVERLAYS ---- */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <StatusBar />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(6px)",
              borderRadius: 18,
              padding: "14px 24px",
              boxShadow: "0 10px 26px rgba(14,42,71,0.14)",
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.navy,
            }}
          >
            <span style={{ width: 13, height: 13, borderRadius: 13, background: COLORS.red, opacity: 0.4 + 0.6 * pulse }} />
            Suivi GPS en temps réel
          </div>
        </div>
      </div>

      {/* arrived banner */}
      {arrived ? (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 30,
            right: 30,
            zIndex: 8,
            transform: `translateY(${(1 - bannerSpring) * -60}px)`,
            opacity: bannerSpring,
            background: COLORS.green,
            color: "#fff",
            borderRadius: 22,
            padding: "22px 26px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: `0 20px 40px ${COLORS.green}55`,
          }}
        >
          <div style={{ width: 58, height: 58, borderRadius: 18, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={34} color="#fff" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize: 27, fontWeight: 800 }}>Le bus est arrivé !</div>
            <div style={{ fontSize: 21, opacity: 0.9 }}>Aïcha est bien arrivée à destination.</div>
          </div>
        </div>
      ) : null}

      {/* FAB */}
      <div
        style={{
          position: "absolute",
          right: 30,
          bottom: 340,
          zIndex: 6,
          width: 78,
          height: 78,
          borderRadius: 26,
          background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 16px 30px ${COLORS.orange}66`,
        }}
      >
        <Icon name="navigation" size={36} color="#fff" />
      </div>

      {/* bottom child card */}
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 30,
          zIndex: 6,
          background: COLORS.white,
          borderRadius: 28,
          padding: 26,
          boxShadow: "0 -10px 40px rgba(14,42,71,0.16)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar initials="AB" size={70} bg={COLORS.orange} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: COLORS.text }}>Aïcha Benali</div>
            <div style={{ fontSize: 21, color: COLORS.textMuted, marginTop: 3 }}>Bus 12 • Ligne Salé Centre</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, color: COLORS.textMuted }}>{arrived ? "Arrivé" : "Arrivée"}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: arrived ? COLORS.green : COLORS.blue }}>
              {arrived ? "8:32" : `${etaMin} min`}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, height: 12, borderRadius: 12, background: COLORS.line, overflow: "hidden" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueSoft})` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 19, color: COLORS.textMuted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="home" size={18} color={COLORS.textMuted} /> École Al Manar
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={18} color={COLORS.orange} /> Domicile
          </span>
        </div>
      </div>
    </div>
  );
};
