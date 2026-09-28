import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../meyebus/theme";
import { ROUTE_SAMPLES, SCHOOL_POS, HOME_POS, STOP_POS, mulberry32 } from "./timeline";

const WALLS = ["#FFFFFF", "#F3F6FA", "#E8EFF8", "#DCE6F3"];
const ROOFS = [COLORS.orange, COLORS.orangeDeep, COLORS.navy, COLORS.blue, "#E2574C"];
const TOWERS = ["#C9D6E8", "#B4C6DE", "#F2F4F7", "#9FB6D3"];
const LEAVES = ["#6FBF73", "#4EA35A", "#8CCB7A"];

export const House: React.FC<{ x: number; z: number; s?: number; roof?: string; wall?: string; rot?: number; lit?: boolean }> = ({
  x,
  z,
  s = 1,
  roof = COLORS.orange,
  wall = "#FFFFFF",
  rot = 0,
  lit,
}) => (
  <group position={[x, 0, z]} scale={s} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1.4, 1.0, 1.3]} />
      <meshLambertMaterial color={wall} />
    </mesh>
    <mesh position={[0, 1.38, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[1.12, 0.78, 4]} />
      <meshLambertMaterial color={roof} flatShading />
    </mesh>
    <mesh position={[0, 0.42, 0.66]}>
      <boxGeometry args={[0.3, 0.5, 0.04]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    <mesh position={[0.45, 0.6, 0.66]}>
      <boxGeometry args={[0.3, 0.3, 0.04]} />
      <meshBasicMaterial color={lit ? "#FFE28A" : "#BFD6F2"} />
    </mesh>
    <mesh position={[-0.45, 0.6, 0.66]}>
      <boxGeometry args={[0.3, 0.3, 0.04]} />
      <meshBasicMaterial color={lit ? "#FFE28A" : "#BFD6F2"} />
    </mesh>
  </group>
);

const Tower: React.FC<{ x: number; z: number; h: number; c: string; w?: number }> = ({ x, z, h, c, w = 1.5 }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, h / 2, 0]}>
      <boxGeometry args={[w, h, w]} />
      <meshLambertMaterial color={c} />
    </mesh>
    <mesh position={[0, h + 0.06, 0]}>
      <boxGeometry args={[w + 0.12, 0.12, w + 0.12]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    {Array.from({ length: Math.max(1, Math.floor(h / 0.7)) }, (_, i) => (
      <mesh key={i} position={[0, 0.45 + i * 0.7, w / 2 + 0.01]}>
        <boxGeometry args={[w * 0.7, 0.28, 0.02]} />
        <meshBasicMaterial color="#8FB7E6" />
      </mesh>
    ))}
  </group>
);

export const Tree: React.FC<{ x: number; z: number; s?: number; c?: string }> = ({ x, z, s = 1, c = "#6FBF73" }) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
      <meshLambertMaterial color="#8B5A2B" />
    </mesh>
    <mesh position={[0, 0.95, 0]}>
      <coneGeometry args={[0.55, 1.2, 8]} />
      <meshLambertMaterial color={c} flatShading />
    </mesh>
    <mesh position={[0, 1.55, 0]}>
      <coneGeometry args={[0.36, 0.8, 8]} />
      <meshLambertMaterial color={c} flatShading />
    </mesh>
  </group>
);

// School: wide white block, navy roof, orange entrance, flag and clock.
export const School: React.FC<{ frame: number }> = ({ frame }) => (
  <group position={[SCHOOL_POS.x, 0, SCHOOL_POS.z]}>
    <mesh position={[0, 0.9, 0]}>
      <boxGeometry args={[6.4, 1.8, 3.2]} />
      <meshLambertMaterial color="#FFFFFF" />
    </mesh>
    <mesh position={[0, 1.88, 0]}>
      <boxGeometry args={[6.7, 0.16, 3.5]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    <mesh position={[0, 2.5, 0]}>
      <boxGeometry args={[2.2, 1.1, 2.2]} />
      <meshLambertMaterial color="#F3F6FA" />
    </mesh>
    <mesh position={[0, 3.12, 0]}>
      <boxGeometry args={[2.4, 0.14, 2.4]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    {/* clock */}
    <mesh position={[0, 2.5, -1.12]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
    <mesh position={[0, 2.5, -1.16]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.46, 0.46, 0.04, 24]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    {/* entrance */}
    <mesh position={[0, 0.6, -1.62]}>
      <boxGeometry args={[1.4, 1.2, 0.08]} />
      <meshLambertMaterial color={COLORS.orange} />
    </mesh>
    {[-2.2, -1.2, 1.2, 2.2].map((x, i) => (
      <mesh key={i} position={[x, 1.05, -1.62]}>
        <boxGeometry args={[0.6, 0.6, 0.04]} />
        <meshBasicMaterial color="#8FB7E6" />
      </mesh>
    ))}
    {/* flag */}
    <mesh position={[3.9, 1.6, -1.2]}>
      <cylinderGeometry args={[0.04, 0.04, 3.2, 8]} />
      <meshLambertMaterial color="#C9D2DE" />
    </mesh>
    <mesh position={[4.3 + Math.sin(frame / 9) * 0.03, 2.95, -1.2]} rotation={[0, 0, Math.sin(frame / 7) * 0.06]}>
      <boxGeometry args={[0.8, 0.45, 0.03]} />
      <meshLambertMaterial color={COLORS.orange} />
    </mesh>
    {/* playground strip */}
    <mesh position={[0, 0.006, -3.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 2.2]} />
      <meshLambertMaterial color={COLORS.mapGreen} />
    </mesh>
  </group>
);

// Bus stop: pole + orange sign + shelter, on the right-hand side of the road.
export const BusStop: React.FC = () => (
  <group position={[STOP_POS.x - 1.4, 0, STOP_POS.z + 2.6]}>
    <mesh position={[1.4, 0.02, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6.4, 2.6]} />
      <meshLambertMaterial color="#F7F9FC" />
    </mesh>
    <mesh position={[3.7, 1.1, -0.3]}>
      <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
      <meshLambertMaterial color="#C9D2DE" />
    </mesh>
    <mesh position={[3.7, 2.05, -0.3]}>
      <boxGeometry args={[0.5, 0.5, 0.05]} />
      <meshLambertMaterial color={COLORS.orange} />
    </mesh>
    <mesh position={[3.7, 2.05, -0.27]}>
      <boxGeometry args={[0.28, 0.16, 0.02]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
    {/* shelter */}
    <mesh position={[0.6, 1.62, 0.2]}>
      <boxGeometry args={[2.0, 0.08, 1.0]} />
      <meshLambertMaterial color={COLORS.navy} />
    </mesh>
    {[-0.35, 1.55].map((x, i) => (
      <mesh key={i} position={[x, 0.8, 0.65]}>
        <boxGeometry args={[0.06, 1.6, 0.06]} />
        <meshLambertMaterial color={COLORS.navy} />
      </mesh>
    ))}
    <mesh position={[0.6, 0.45, 0.62]}>
      <boxGeometry args={[1.6, 0.06, 0.3]} />
      <meshLambertMaterial color="#DCE6F3" />
    </mesh>
  </group>
);

type Lot = { kind: "house" | "tower" | "tree"; x: number; z: number; a: number; b: number; c: string; d: string };

const distToRoute = (x: number, z: number) => {
  let best = Infinity;
  for (const p of ROUTE_SAMPLES) {
    const dx = p.x - x;
    const dz = p.z - z;
    const d = dx * dx + dz * dz;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
};

export const useCityLots = (): Lot[] =>
  useMemo(() => {
    const rng = mulberry32(20240917);
    const lots: Lot[] = [];
    for (let gx = -16; gx <= 16; gx += 2.7) {
      for (let gz = -15; gz <= 15; gz += 2.7) {
        const x = gx + (rng() - 0.5) * 0.9;
        const z = gz + (rng() - 0.5) * 0.9;
        if (distToRoute(x, z) < 2.6) continue;
        if (Math.abs(x - SCHOOL_POS.x) < 5 && Math.abs(z - SCHOOL_POS.z) < 4) continue;
        if (Math.abs(x - HOME_POS.x) < 2.2 && Math.abs(z - HOME_POS.z) < 2.2) continue;
        if (Math.abs(x - STOP_POS.x - 0.5) < 4.2 && Math.abs(z - STOP_POS.z - 2.5) < 2.8) continue;
        if (Math.abs(Math.abs(x) - 14) < 1.5 || Math.abs(z + 13) < 1.4 || Math.abs(z - 12) < 1.4) continue; // streets
        const r = rng();
        const c = rng();
        const d = rng();
        if (r < 0.45) lots.push({ kind: "house", x, z, a: 0.85 + rng() * 0.35, b: Math.floor(rng() * 4) * (Math.PI / 2), c: ROOFS[Math.floor(c * ROOFS.length)], d: WALLS[Math.floor(d * WALLS.length)] });
        else if (r < 0.72) lots.push({ kind: "tower", x, z, a: 1.6 + rng() * 3.2, b: 1.2 + rng() * 0.8, c: TOWERS[Math.floor(c * TOWERS.length)], d: "" });
        else lots.push({ kind: "tree", x, z, a: 0.8 + rng() * 0.6, b: 0, c: LEAVES[Math.floor(c * LEAVES.length)], d: "" });
      }
    }
    return lots;
  }, []);

export const CityLots: React.FC = () => {
  const lots = useCityLots();
  return (
    <group>
      {lots.map((l, i) =>
        l.kind === "house" ? (
          <House key={i} x={l.x} z={l.z} s={l.a} rot={l.b} roof={l.c} wall={l.d} />
        ) : l.kind === "tower" ? (
          <Tower key={i} x={l.x} z={l.z} h={l.a} w={l.b} c={l.c} />
        ) : (
          <Tree key={i} x={l.x} z={l.z} s={l.a} c={l.c} />
        ),
      )}
    </group>
  );
};

export const Ground: React.FC = () => (
  <group>
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[140, 140]} />
      <meshLambertMaterial color={COLORS.mapBg} />
    </mesh>
    {[
      [-6, -11, 5],
      [7, 6, 4.5],
      [-15, -2, 4],
      [15, -10, 4],
      [-3, 12, 4],
    ].map(([x, z, r], i) => (
      <mesh key={i} position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r, 28]} />
        <meshLambertMaterial color={COLORS.mapGreen} />
      </mesh>
    ))}
    <mesh position={[-19, 0.003, 9]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5, 28]} />
      <meshLambertMaterial color={COLORS.mapWater} />
    </mesh>
  </group>
);

// Extra buses on the side streets (fleet overview).
export const FleetBus: React.FC<{ from: [number, number]; to: [number, number]; frame: number; speed: number; offset: number; children: (p: THREE.Vector3, yaw: number) => React.ReactNode }> = ({
  from,
  to,
  frame,
  speed,
  offset,
  children,
}) => {
  const a = new THREE.Vector3(from[0], 0, from[1]);
  const b = new THREE.Vector3(to[0], 0, to[1]);
  const u = ((frame * speed + offset) % 1 + 1) % 1;
  const p = a.clone().lerp(b, u);
  const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
  return <>{children(p, yaw)}</>;
};
