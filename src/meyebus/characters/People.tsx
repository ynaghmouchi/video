import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

// ---------------------------------------------------------------------------
// Refined flat-vector characters, fully drawn in SVG → crisp at any resolution
// (1080p → 4K, never pixelated) and animated by code. Proportions, hands,
// faces and soft shading are hand-tuned. Each character has a light idle rig
// (breathing, blink) plus mood-specific motion.
// ---------------------------------------------------------------------------

const useBlink = (period = 84) => {
  const frame = useCurrentFrame();
  const t = frame % period;
  return t > period - 5 ? 0.1 : 1;
};
const useBreath = (speed = 38, amp = 0.01) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amp;
};

const skin = { light: "#FBD3B0", mid: "#F3BE96", shadow: "#E3A074" };

// ============================================================ CHILD (waiting)
// Child proportions: oversized head, short body & limbs, chunky boots.
export const Child: React.FC<{ cold?: boolean; happy?: boolean }> = ({ cold = false, happy = false }) => {
  const frame = useCurrentFrame();
  const blink = useBlink();
  const breath = useBreath(34, 0.012);
  const shiver = cold ? Math.sin(frame / 2) * 1.3 : 0;
  const look = happy ? 0 : Math.sin(frame / 50) * 7; // scanning for the bus
  const bounce = happy ? Math.abs(Math.sin(frame / 9)) * -10 : 0; // little happy hop

  return (
    <svg width={360} height={560} viewBox="0 0 360 560" style={{ transform: `translate(${shiver}px, ${bounce}px)`, overflow: "visible" }}>
      <defs>
        <linearGradient id="c_coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFCB57" />
          <stop offset="1" stopColor={COLORS.orange} />
        </linearGradient>
        <linearGradient id="c_pack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.blueSoft} />
          <stop offset="1" stopColor={COLORS.blueDark} />
        </linearGradient>
        <radialGradient id="c_cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(232,110,90,0.55)" />
          <stop offset="1" stopColor="rgba(232,110,90,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="540" rx="105" ry="17" fill="rgba(0,0,0,0.20)" />

      <g transform={`translate(180 300) scale(${breath}) translate(-180 -300)`}>
        {/* legs */}
        <rect x="150" y="430" width="26" height="78" rx="13" fill="#2C3A53" />
        <rect x="186" y="430" width="26" height="78" rx="13" fill="#243248" />
        {/* boots */}
        <path d="M144 498h38v14c0 6-5 11-11 11h-16c-6 0-11-5-11-11z" fill="#16233A" />
        <path d="M184 498h38v14c0 6-5 11-11 11h-16c-6 0-11-5-11-11z" fill="#101B2E" />

        {/* backpack */}
        <rect x="206" y="298" width="56" height="104" rx="22" fill="url(#c_pack)" />
        <rect x="214" y="318" width="40" height="30" rx="10" fill="rgba(255,255,255,0.18)" />

        {/* raincoat body */}
        <path d="M126 318c0-40 24-66 54-66s54 26 54 66v118c0 12-10 22-23 22h-62c-13 0-23-10-23-22z" fill="url(#c_coat)" />
        <path d="M180 256v178" stroke="rgba(120,60,10,0.25)" strokeWidth="3" />
        <circle cx="180" cy="330" r="4.5" fill="rgba(120,60,10,0.3)" />
        <circle cx="180" cy="366" r="4.5" fill="rgba(120,60,10,0.3)" />
        <circle cx="180" cy="402" r="4.5" fill="rgba(120,60,10,0.3)" />
        {/* coat shading */}
        <path d="M180 252c30 0 54 26 54 66v118c0 12-10 22-23 22h-10c13 0 21-10 21-22V318c0-34-17-58-42-64z" fill="rgba(120,60,10,0.10)" />

        {/* arms + mittened hands */}
        <g>
          <rect x="116" y="320" width="24" height="96" rx="12" fill="#F2A431" />
          <circle cx="128" cy="424" r="16" fill={skin.mid} />
        </g>
        <g>
          <rect x="220" y="320" width="24" height="96" rx="12" fill="#E07B16" />
          <circle cx="232" cy="424" r="16" fill={skin.shadow} />
        </g>

        {/* head */}
        <g transform={`rotate(${look} 180 188)`}>
          {/* hood behind */}
          <path d="M122 198a58 58 0 0 1 116 0c0 9-7 14-16 14H138c-9 0-16-5-16-14z" fill="#E07B16" />
          {/* neck */}
          <rect x="168" y="216" width="24" height="22" rx="10" fill={skin.shadow} />
          {/* face */}
          <ellipse cx="180" cy="180" rx="54" ry="56" fill={skin.light} />
          <path d="M180 124c30 0 54 25 54 56s-24 56-54 56c30-6 44-30 44-56s-14-50-44-56z" fill={skin.mid} opacity="0.5" />
          {/* hair */}
          <path d="M128 172c0-30 24-54 52-54s52 24 52 54c-8-10-18-12-26-6-7-9-16-9-26-2-8-7-18-7-26 2-8-6-18-4-26 6z" fill="#5A3A23" />
          <path d="M128 172c4-7 10-10 16-8-3 4-5 9-5 14z" fill="#4A2F1C" />
          {/* ears */}
          <circle cx="128" cy="184" r="10" fill={skin.mid} />
          <circle cx="232" cy="184" r="10" fill={skin.shadow} />
          {/* eyebrows (worried unless happy) */}
          {happy ? (
            <>
              <path d="M150 158q12 -4 22 0" stroke="#4A2F1C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M188 158q12 -4 22 0" stroke="#4A2F1C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M152 156q10 -6 20 -1" stroke="#4A2F1C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M188 155q10 -5 20 1" stroke="#4A2F1C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          )}
          {/* eyes */}
          <g transform={`scaleY(${blink})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="161" cy="178" rx="7" ry="8" fill="#1B2A40" />
            <ellipse cx="199" cy="178" rx="7" ry="8" fill="#1B2A40" />
            <circle cx="163" cy="175" r="2.2" fill="#fff" />
            <circle cx="201" cy="175" r="2.2" fill="#fff" />
          </g>
          {/* nose */}
          <path d="M178 186q4 6 0 10" stroke={skin.shadow} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* cheeks */}
          {cold && (<>
            <ellipse cx="150" cy="198" rx="13" ry="10" fill="url(#c_cheek)" />
            <ellipse cx="210" cy="198" rx="13" ry="10" fill="url(#c_cheek)" />
          </>)}
          {/* mouth */}
          {happy ? (
            <path d="M164 204q16 16 32 0" stroke="#9A4A2E" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M168 208q12 -7 24 0" stroke="#9A4A2E" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
};

// ============================================================ PARENT (anxious)
export const Parent: React.FC<{ anxious?: boolean }> = ({ anxious = true }) => {
  const frame = useCurrentFrame();
  const blink = useBlink(96);
  const breath = useBreath(30, 0.014);
  const tilt = anxious ? Math.sin(frame / 16) * 3 : Math.sin(frame / 40) * 1.5;
  const tap = anxious ? Math.sin(frame / 5) * 4 : 0;

  return (
    <svg width={420} height={620} viewBox="0 0 420 620" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="p_shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.blueSoft} />
          <stop offset="1" stopColor={COLORS.blue} />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="598" rx="120" ry="18" fill="rgba(0,0,0,0.2)" />

      <g transform={`translate(210 330) scale(${breath}) translate(-210 -330)`}>
        {/* legs */}
        <rect x="176" y="452" width="30" height="118" rx="15" fill="#33415C" />
        <rect x="214" y="452" width="30" height="118" rx="15" fill="#2A3750" />
        <path d="M170 560h42v12c0 6-5 10-11 10h-20c-6 0-11-4-11-10z" fill="#16233A" />
        <path d="M212 560h42v12c0 6-5 10-11 10h-20c-6 0-11-4-11-10z" fill="#101B2E" />

        {/* torso */}
        <path d="M146 332c0-44 28-74 64-74s64 30 64 74v122c0 13-11 23-24 23H170c-13 0-24-10-24-23z" fill="url(#p_shirt)" />
        <path d="M210 258c36 0 64 30 64 74v122c0 13-11 23-24 23h-12c13 0 24-10 24-23V332c0-40-22-68-52-74z" fill="rgba(0,0,0,0.10)" />
        {/* collar */}
        <path d="M192 264l18 22 18-22c-6-4-12-6-18-6s-12 2-18 6z" fill="rgba(255,255,255,0.18)" />

        {/* left arm relaxed + hand */}
        <rect x="132" y="334" width="26" height="120" rx="13" fill={COLORS.blueDark} />
        <circle cx="145" cy="460" r="15" fill={skin.mid} />

        {/* right arm holding phone */}
        <g transform={`translate(${tap} 0)`}>
          <rect x="262" y="318" width="26" height="110" rx="13" fill={COLORS.blueDark} transform="rotate(-32 275 372)" />
          <g transform="rotate(-12 320 300)">
            <circle cx="316" cy="276" r="15" fill={skin.shadow} />{/* hand */}
            <rect x="298" y="250" width="52" height="92" rx="12" fill="#16233A" />
            <rect x="303" y="258" width="42" height="76" rx="6" fill="#0E2A47" />
            {/* empty screen: a faint loading clock, no info */}
            <circle cx="324" cy="296" r="11" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="3" />
            <path d="M324 290v6l4 3" stroke="rgba(255,255,255,0.42)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* head */}
        <g transform={`rotate(${tilt} 210 196)`}>
          <rect x="198" y="222" width="24" height="20" rx="9" fill={skin.shadow} />{/* neck */}
          <ellipse cx="210" cy="188" rx="52" ry="55" fill={skin.light} />
          <path d="M210 133c29 0 52 24 52 55s-23 55-52 55c28-6 41-29 41-55s-13-49-41-55z" fill={skin.mid} opacity="0.5" />
          {/* hair */}
          <path d="M160 184c0-30 22-54 50-54s50 24 50 54c-6-22-26-38-50-38s-44 16-50 38z" fill="#2B2118" />
          <circle cx="160" cy="190" r="9" fill={skin.mid} />
          <circle cx="260" cy="190" r="9" fill={skin.shadow} />
          {/* worried brows */}
          <path d="M184 168q12 -9 22 -2" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M214 166q12 -7 22 2" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* eyes */}
          <g transform={`scaleY(${blink})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="193" cy="190" rx="6.5" ry="7.5" fill="#1B2A40" />
            <ellipse cx="227" cy="190" rx="6.5" ry="7.5" fill="#1B2A40" />
            <circle cx="195" cy="187" r="2" fill="#fff" />
            <circle cx="229" cy="187" r="2" fill="#fff" />
          </g>
          <path d="M208 196q4 7 0 12" stroke={skin.shadow} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* mouth */}
          <path d="M196 218q14 -9 28 0" stroke="#9A5A3E" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* sweat */}
          {anxious && <path d="M256 174c6 8 10 14 10 19a10 10 0 0 1-20 0c0-5 4-11 10-19z" fill="#7FC8F0" opacity={interpolate(frame % 100, [0, 25, 70, 100], [0, 0.9, 0.9, 0])} />}
        </g>
      </g>
    </svg>
  );
};

// ============================================================ SECRETARY (overwhelmed)
export const Secretary: React.FC<{ overwhelmed?: boolean; calm?: boolean }> = ({ overwhelmed = true, calm = false }) => {
  const frame = useCurrentFrame();
  const blink = useBlink(72);
  const tilt = overwhelmed ? Math.sin(frame / 7) * 4 : Math.sin(frame / 45) * 1.5;
  const handWave = overwhelmed ? Math.sin(frame / 4) * 14 : 0;

  return (
    <svg width={440} height={520} viewBox="0 0 440 520" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="s_top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3FBF92" />
          <stop offset="1" stopColor={COLORS.green} />
        </linearGradient>
      </defs>

      {/* desk */}
      <rect x="40" y="430" width="360" height="60" rx="10" fill="#C9A06A" />
      <rect x="40" y="430" width="360" height="14" rx="7" fill="#DDB985" />

      <g transform={`translate(220 300)`}>
        {/* torso behind desk */}
        <path d="M-66 30c0-40 28-66 66-66s66 26 66 66v110H-66z" fill="url(#s_top)" />
        {/* left arm on desk */}
        <rect x="-92" y="44" width="24" height="92" rx="12" fill="#2BA277" transform="rotate(24 -80 90)" />
        <circle cx="-58" cy="128" r="14" fill={skin.mid} />
        {/* right arm raised (overwhelmed) holding a phone to ear */}
        <g transform={`rotate(${handWave} 70 60)`}>
          <rect x="64" y="-20" width="24" height="96" rx="12" fill="#239A70" transform="rotate(-40 76 30)" />
          <circle cx="44" cy="-30" r="14" fill={skin.shadow} />
          <rect x="30" y="-52" width="34" height="56" rx="10" fill="#16233A" transform="rotate(-18 47 -24)" />
        </g>

        {/* head */}
        <g transform={`rotate(${tilt} 0 -60)`}>
          <rect x="-12" y="-30" width="24" height="20" rx="9" fill={skin.shadow} />
          <ellipse cx="0" cy="-66" rx="50" ry="53" fill={skin.light} />
          {/* hair bun */}
          <path d="M-50 -70c0-30 22-52 50-52s50 22 50 52c-6-22-26-36-50-36s-44 14-50 36z" fill="#3A2A1E" />
          <circle cx="0" cy="-120" r="16" fill="#3A2A1E" />
          <circle cx="-50" cy="-62" r="9" fill={skin.mid} />
          <circle cx="50" cy="-62" r="9" fill={skin.shadow} />
          {/* brows */}
          {calm ? (
            <>
              <path d="M-26 -84q12 -3 20 1" stroke="#3A2A1E" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M6 -83q12 -4 20 -1" stroke="#3A2A1E" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-26 -86q11 -8 20 -2" stroke="#3A2A1E" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M6 -88q11 -6 20 2" stroke="#3A2A1E" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          )}
          {/* eyes */}
          <g transform={`scaleY(${blink})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="-17" cy="-62" rx="6.5" ry="7.5" fill="#1B2A40" />
            <ellipse cx="17" cy="-62" rx="6.5" ry="7.5" fill="#1B2A40" />
            <circle cx="-15" cy="-65" r="2" fill="#fff" />
            <circle cx="19" cy="-65" r="2" fill="#fff" />
          </g>
          <path d="M-2 -58q4 7 0 12" stroke={skin.shadow} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* mouth */}
          {calm ? (
            <path d="M-14 -38q14 10 28 0" stroke="#9A5A3E" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <ellipse cx="0" cy="-38" rx="9" ry="11" fill="#7A3A2E" />
          )}
        </g>
      </g>
    </svg>
  );
};
