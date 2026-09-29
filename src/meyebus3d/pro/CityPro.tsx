import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../../meyebus/theme";
import { ROUTE, ROUTE_LENGTH, ROUTE_SAMPLES, SCHOOL_POS, HOME_POS, STOP_POS, mulberry32 } from "../timeline";
import { getAssets, facadeBox, roundedBody } from "./assets";
import { ROAD_W } from "./RoadPro";

// ------------------------------------------------------------------ Ground
export const GroundPro: React.FC = () => {
  const A = getAssets();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[420, 420]} />
      <meshStandardMaterial map={A.grass} roughness={1} />
    </mesh>
  );
};

// ------------------------------------------------------------------ Trees
export const TreePro: React.FC<{ x: number; z: number; s?: number; seed?: number }> = ({ x, z, s = 1, seed = 1 }) => {
  const rng = mulberry32(seed);
  const greens = ["#4F7A3A", "#5E8C44", "#6F9A4E", "#46702F"];
  const blobs = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        p: [(rng() - 0.5) * 0.7, 1.35 + i * 0.28 + rng() * 0.2, (rng() - 0.5) * 0.7] as [number, number, number],
        r: 0.55 + rng() * 0.25,
        c: greens[Math.floor(rng() * greens.length)],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 1.3, 8]} />
        <meshStandardMaterial color="#5C4230" roughness={0.95} />
      </mesh>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.p} castShadow>
          <icosahedronGeometry args={[b.r, 1]} />
          <meshStandardMaterial color={b.c} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ Houses
const Window: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; w?: number; h?: number; lit?: number }> = ({ position, rotation = [0, 0, 0], w = 0.34, h = 0.38, lit = 0 }) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[w + 0.06, h + 0.06, 0.03]} />
      <meshStandardMaterial color="#F4F1EA" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0, 0.012]}>
      <boxGeometry args={[w, h, 0.02]} />
      <meshStandardMaterial color="#2C4A66" metalness={0.8} roughness={0.1} envMapIntensity={1.4} emissive="#FFD08A" emissiveIntensity={lit * 1.6} />
    </mesh>
  </group>
);

export const HousePro: React.FC<{ x: number; z: number; s?: number; rot?: number; roof?: "red" | "grey" | "navy"; warm?: boolean; lit?: number }> = ({ x, z, s = 1, rot = 0, roof = "red", warm, lit = 0 }) => {
  const A = getAssets();
  const roofTex = roof === "red" ? A.roofRed : roof === "grey" ? A.roofGrey : A.roofNavy;
  const W = 1.7;
  const D = 1.5;
  const H = 1.05;
  const roofGeo = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-W / 2 - 0.15, 0);
    sh.lineTo(W / 2 + 0.15, 0);
    sh.lineTo(0, 0.62);
    sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: D + 0.3, bevelEnabled: false });
    g.translate(0, 0, -(D + 0.3) / 2);
    return g;
  }, []);
  return (
    <group position={[x, 0, z]} scale={s} rotation={[0, rot, 0]}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial map={warm ? A.plasterWarm : A.plaster} roughness={0.9} />
      </mesh>
      <mesh geometry={roofGeo} position={[0, H, 0]} castShadow>
        <meshStandardMaterial attach="material-0" map={warm ? A.plasterWarm : A.plaster} roughness={0.9} />
        <meshStandardMaterial attach="material-1" map={roofTex} roughness={0.85} />
      </mesh>
      {/* chimney */}
      <mesh position={[W * 0.3, H + 0.5, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#8E5A44" roughness={0.9} />
      </mesh>
      {/* door + step */}
      <mesh position={[0, 0.4, D / 2 + 0.01]}>
        <boxGeometry args={[0.36, 0.78, 0.03]} />
        <meshStandardMaterial color="#4B3426" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.03, D / 2 + 0.2]} receiveShadow>
        <boxGeometry args={[0.6, 0.06, 0.36]} />
        <meshStandardMaterial map={A.concrete} roughness={0.9} />
      </mesh>
      <Window position={[-0.5, 0.6, D / 2 + 0.01]} lit={lit} />
      <Window position={[0.5, 0.6, D / 2 + 0.01]} lit={lit} />
      <Window position={[W / 2 + 0.01, 0.6, 0.3]} rotation={[0, Math.PI / 2, 0]} lit={lit * 0.6} />
      <Window position={[-W / 2 - 0.01, 0.6, -0.3]} rotation={[0, -Math.PI / 2, 0]} lit={0} />
    </group>
  );
};

// ------------------------------------------------------------------ Towers
export const TowerPro: React.FC<{ x: number; z: number; w: number; d: number; h: number; variant: number; dawn: number }> = ({ x, z, w, d, h, variant, dawn }) => {
  const A = getAssets();
  const f = A.facades[variant % A.facades.length];
  const geo = useMemo(() => facadeBox(w, h, d), [w, h, d]);
  const side = <meshStandardMaterial map={f.map} emissiveMap={f.emissive} emissive="#FFC98A" emissiveIntensity={0.2 + dawn * 1.4} roughness={0.85} />;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[w + 1.4, 0.06, d + 1.4]} />
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={geo} position={[0, h / 2 + 0.06, 0]} castShadow receiveShadow>
        {React.cloneElement(side, { attach: "material-0" })}
        {React.cloneElement(side, { attach: "material-1" })}
        <meshStandardMaterial attach="material-2" color="#6B6E73" roughness={0.95} />
        <meshStandardMaterial attach="material-3" color="#6B6E73" roughness={0.95} />
        {React.cloneElement(side, { attach: "material-4" })}
        {React.cloneElement(side, { attach: "material-5" })}
      </mesh>
      {/* parapet + rooftop units */}
      <mesh position={[0, h + 0.12, 0]}>
        <boxGeometry args={[w + 0.1, 0.12, d + 0.1]} />
        <meshStandardMaterial color="#8A8D92" roughness={0.9} />
      </mesh>
      <mesh position={[w * 0.2, h + 0.35, -d * 0.15]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#B9BDC3" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ Street furniture
export const Lamp: React.FC<{ position: [number, number, number]; yaw: number; on: number }> = ({ position, yaw, on }) => (
  <group position={position} rotation={[0, yaw, 0]}>
    <mesh position={[0, 1.7, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.05, 3.4, 8]} />
      <meshStandardMaterial color="#3E4348" roughness={0.6} metalness={0.5} />
    </mesh>
    <mesh position={[0.45, 3.35, 0]} rotation={[0, 0, 0.15]}>
      <boxGeometry args={[0.95, 0.05, 0.05]} />
      <meshStandardMaterial color="#3E4348" roughness={0.6} metalness={0.5} />
    </mesh>
    <mesh position={[0.9, 3.3, 0]}>
      <boxGeometry args={[0.3, 0.08, 0.16]} />
      <meshStandardMaterial color="#FFF3D6" emissive="#FFD79A" emissiveIntensity={2.5 * on} />
    </mesh>
  </group>
);

export const CarPro: React.FC<{ position: THREE.Vector3; yaw: number; color: string; dist?: number }> = ({ position, yaw, color, dist = 0 }) => {
  const body = useMemo(() => roundedBody(1.9, 0.9, 0.5, 0.1), []);
  const cabin = useMemo(() => roundedBody(0.95, 0.82, 0.38, 0.12), []);
  const rot = -dist / 0.18;
  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, yaw, 0]}>
      <mesh geometry={body} position={[0, 0.42, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} envMapIntensity={1.4} />
      </mesh>
      <mesh geometry={cabin} position={[-0.15, 0.82, 0]} castShadow>
        <meshStandardMaterial color="#1A2B3C" metalness={0.9} roughness={0.08} envMapIntensity={1.8} />
      </mesh>
      {[-0.4, 0.4].map((z, i) => (
        <mesh key={i} position={[0.96, 0.4, z]}>
          <boxGeometry args={[0.02, 0.08, 0.16]} />
          <meshStandardMaterial color="#FFF7DD" emissive="#FFF2C0" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {[
        [0.6, 0.46],
        [0.6, -0.46],
        [-0.6, 0.46],
        [-0.6, -0.46],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} rotation={[Math.PI / 2, rot, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.16, 18]} />
          <meshStandardMaterial color="#1B1D20" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ School
export const SchoolPro: React.FC<{ frame: number; dawn: number }> = ({ frame, dawn }) => {
  const A = getAssets();
  const W = 7;
  const D = 3.4;
  const H = 2.4;
  const geo = useMemo(() => facadeBox(W, H, D, 3.2, 2.4), []);
  const side = <meshStandardMaterial map={A.school.map} emissiveMap={A.school.emissive} emissive="#FFD9A6" emissiveIntensity={0.2 + dawn * 1.2} roughness={0.85} />;
  return (
    <group position={[SCHOOL_POS.x, 0, SCHOOL_POS.z]}>
      <mesh position={[0, 0.03, -1]} receiveShadow>
        <boxGeometry args={[12, 0.06, 8]} />
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={geo} position={[0, H / 2 + 0.06, 0]} castShadow receiveShadow>
        {React.cloneElement(side, { attach: "material-0" })}
        {React.cloneElement(side, { attach: "material-1" })}
        <meshStandardMaterial attach="material-2" color="#6B6E73" roughness={0.95} />
        <meshStandardMaterial attach="material-3" color="#6B6E73" roughness={0.95} />
        {React.cloneElement(side, { attach: "material-4" })}
        {React.cloneElement(side, { attach: "material-5" })}
      </mesh>
      <mesh position={[0, H + 0.14, 0]}>
        <boxGeometry args={[W + 0.15, 0.16, D + 0.15]} />
        <meshStandardMaterial color={COLORS.navy} roughness={0.8} />
      </mesh>
      {/* entrance canopy + doors (facing the road, -z) */}
      <group position={[0, 0, -D / 2]}>
        <mesh position={[0, 1.5, -0.7]} castShadow>
          <boxGeometry args={[2.4, 0.1, 1.5]} />
          <meshStandardMaterial color={COLORS.orange} roughness={0.5} metalness={0.3} />
        </mesh>
        {[-1, 1].map((x, i) => (
          <mesh key={i} position={[x, 0.75, -1.35]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 10]} />
            <meshStandardMaterial color="#DDE1E6" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.62, -0.02]}>
          <boxGeometry args={[1.4, 1.2, 0.04]} />
          <meshStandardMaterial color="#1E3A5C" metalness={0.8} roughness={0.1} envMapIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.06, -0.6]} receiveShadow>
          <boxGeometry args={[2.6, 0.12, 1.2]} />
          <meshStandardMaterial map={A.concrete} roughness={0.9} />
        </mesh>
      </group>
      {/* flag */}
      <mesh position={[4.4, 2, -2.4]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 4, 8]} />
        <meshStandardMaterial color="#C9D2DE" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[4.85 + Math.sin(frame / 9) * 0.03, 3.72, -2.4]} rotation={[0, 0, Math.sin(frame / 7) * 0.06]}>
        <boxGeometry args={[0.85, 0.5, 0.02]} />
        <meshStandardMaterial color={COLORS.orange} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* hedges */}
      {[-3.2, 3.2].map((x, i) => (
        <mesh key={i} position={[x, 0.3, -2.6]} castShadow>
          <boxGeometry args={[3, 0.5, 0.5]} />
          <meshStandardMaterial color="#4E7A3A" roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ Bus stop
export const BusStopPro: React.FC = () => {
  const A = getAssets();
  const base = new THREE.Vector3(STOP_POS.x - 1.6, 0.1, STOP_POS.z + ROAD_W / 2 + 0.75);
  return (
    <group position={[base.x, base.y, base.z]}>
      {/* shelter */}
      <group position={[0, 0, 0.3]}>
        {[-1.05, 1.05].map((x, i) => (
          <mesh key={i} position={[x, 1.1, 0]} castShadow>
            <boxGeometry args={[0.06, 2.2, 0.06]} />
            <meshStandardMaterial color="#3E4348" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 2.2, -0.35]} castShadow>
          <boxGeometry args={[2.3, 0.05, 1.05]} />
          <meshStandardMaterial color="#8A9096" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.15, 0.02]}>
          <boxGeometry args={[2.1, 1.9, 0.02]} />
          <meshStandardMaterial color="#8FB1C9" metalness={0.9} roughness={0.05} transparent opacity={0.35} envMapIntensity={1.6} />
        </mesh>
        <mesh position={[0, 0.5, -0.25]} castShadow>
          <boxGeometry args={[1.8, 0.06, 0.4]} />
          <meshStandardMaterial color="#6B4A2E" roughness={0.8} />
        </mesh>
        <mesh position={[1.1, 1.75, 0.03]}>
          <boxGeometry args={[0.02, 0.5, 0.5]} />
          <meshStandardMaterial color={COLORS.orange} roughness={0.5} />
        </mesh>
      </group>
      {/* sign pole */}
      <group position={[3.4, 0, -0.1]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
          <meshStandardMaterial color="#9AA1A8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.25, 0]}>
          <boxGeometry args={[0.46, 0.46, 0.03]} />
          <meshStandardMaterial color={COLORS.orange} roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.25, 0.02]}>
          <boxGeometry args={[0.26, 0.14, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
        </mesh>
      </group>
      {/* bin */}
      <mesh position={[2.4, 0.35, 0.5]} castShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.7, 12]} />
        <meshStandardMaterial color="#3E4A3E" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.09, 0.2]} receiveShadow>
        <boxGeometry args={[7, 0.02, 2.6]} />
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ Lots
type Lot = { kind: "house" | "tower" | "tree"; x: number; z: number; a: number; b: number; c: number; rot: number };

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

const useLots = (): Lot[] =>
  useMemo(() => {
    const rng = mulberry32(777);
    const lots: Lot[] = [];
    for (let gx = -19; gx <= 19; gx += 3.1) {
      for (let gz = -18; gz <= 17; gz += 3.1) {
        const x = gx + (rng() - 0.5) * 1.0;
        const z = gz + (rng() - 0.5) * 1.0;
        if (distToRoute(x, z) < 3.3) continue;
        if (Math.abs(x - SCHOOL_POS.x) < 7 && Math.abs(z - SCHOOL_POS.z) < 5.5) continue;
        if (Math.abs(x - HOME_POS.x) < 2.6 && Math.abs(z - HOME_POS.z) < 2.6) continue;
        if (Math.abs(x - STOP_POS.x - 0.5) < 4.6 && Math.abs(z - STOP_POS.z - 2.8) < 3) continue;
        if (Math.abs(Math.abs(x) - 14) < 2.2 || Math.abs(z + 13) < 2.2 || Math.abs(z - 12) < 2.2) continue;
        const r = rng();
        const a = rng();
        const b = rng();
        const c = rng();
        const rot = Math.floor(rng() * 4) * (Math.PI / 2) + (rng() - 0.5) * 0.2;
        if (r < 0.42) lots.push({ kind: "house", x, z, a: 0.9 + a * 0.3, b, c, rot });
        else if (r < 0.7) lots.push({ kind: "tower", x, z, a: 2.2 + a * 4.2, b: 1.6 + b * 1.2, c, rot: 0 });
        else lots.push({ kind: "tree", x, z, a: 0.8 + a * 0.6, b, c, rot });
      }
    }
    return lots;
  }, []);

export const LotsPro: React.FC<{ dawn: number }> = ({ dawn }) => {
  const lots = useLots();
  return (
    <group>
      {lots.map((l, i) =>
        l.kind === "house" ? (
          <HousePro key={i} x={l.x} z={l.z} s={l.a} rot={l.rot} roof={l.b < 0.45 ? "red" : l.b < 0.75 ? "grey" : "navy"} warm={l.c > 0.5} lit={l.c > 0.4 ? dawn : 0} />
        ) : l.kind === "tower" ? (
          <TowerPro key={i} x={l.x} z={l.z} w={l.b} d={1.4 + l.c * 1.2} h={l.a} variant={Math.floor(l.c * 5)} dawn={dawn} />
        ) : (
          <TreePro key={i} x={l.x} z={l.z} s={l.a} seed={i + 3} />
        ),
      )}
    </group>
  );
};

// Lamps along the M road, alternating sides.
export const LampsPro: React.FC<{ on: number }> = ({ on }) => {
  const lamps = useMemo(() => {
    const n = Math.floor(ROUTE_LENGTH / 7);
    return Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      const p = ROUTE.getPointAt(t);
      const tan = ROUTE.getTangentAt(t);
      const side = new THREE.Vector3(-tan.z, 0, tan.x).multiplyScalar((i % 2 ? 1 : -1) * (ROAD_W / 2 + 1.2));
      const pos = p.clone().add(side);
      const yaw = Math.atan2(-tan.z, tan.x) + (i % 2 ? Math.PI / 2 : -Math.PI / 2);
      return { pos, yaw };
    });
  }, []);
  return (
    <group>
      {lamps.map((l, i) => (
        <Lamp key={i} position={[l.pos.x, 0.1, l.pos.z]} yaw={l.yaw} on={on} />
      ))}
    </group>
  );
};

// Parked + moving cars on the side streets.
const CAR_COLORS = ["#B8BEC6", "#2E3B4E", "#8A1C1C", "#DDE1E6", "#3D5A80", "#1F2933"];
export const CarsPro: React.FC<{ frame: number }> = ({ frame }) => {
  const parked = useMemo(() => {
    const rng = mulberry32(4242);
    const out: { p: THREE.Vector3; yaw: number; c: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const alongX = rng() < 0.5;
      const s = (rng() - 0.5) * 30;
      out.push(
        alongX
          ? { p: new THREE.Vector3(s, 0, (rng() < 0.5 ? -13 : 12) + (rng() < 0.5 ? 1.45 : -1.45)), yaw: 0, c: CAR_COLORS[i % CAR_COLORS.length] }
          : { p: new THREE.Vector3((rng() < 0.5 ? -14 : 14) + (rng() < 0.5 ? 1.45 : -1.45), 0, s), yaw: Math.PI / 2, c: CAR_COLORS[(i + 2) % CAR_COLORS.length] },
      );
    }
    return out;
  }, []);
  const moving = [
    { a: new THREE.Vector3(-30, 0, 12.55), b: new THREE.Vector3(30, 0, 12.55), speed: 0.0009, off: 0.2, c: "#8A1C1C" },
    { a: new THREE.Vector3(14.55, 0, 20), b: new THREE.Vector3(14.55, 0, -20), speed: 0.0011, off: 0.7, c: "#DDE1E6" },
    { a: new THREE.Vector3(30, 0, -13.55), b: new THREE.Vector3(-30, 0, -13.55), speed: 0.0008, off: 0.45, c: "#3D5A80" },
  ];
  return (
    <group>
      {parked.map((c, i) => (
        <CarPro key={i} position={c.p} yaw={c.yaw} color={c.c} />
      ))}
      {moving.map((m, i) => {
        const u = ((frame * m.speed + m.off) % 1 + 1) % 1;
        const p = m.a.clone().lerp(m.b, u);
        const yaw = Math.atan2(-(m.b.z - m.a.z), m.b.x - m.a.x);
        return <CarPro key={`m${i}`} position={p} yaw={yaw} color={m.c} dist={u * m.a.distanceTo(m.b)} />;
      })}
    </group>
  );
};

export const CloudsPro: React.FC<{ frame: number }> = ({ frame }) => {
  const A = getAssets();
  const clouds = useMemo(() => {
    const rng = mulberry32(99);
    return Array.from({ length: 7 }, () => ({ x: (rng() - 0.5) * 220, z: (rng() - 0.5) * 220, y: 70 + rng() * 25, s: 40 + rng() * 40, rot: rng() * Math.PI, sp: 0.01 + rng() * 0.01 }));
  }, []);
  return (
    <group>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x + frame * c.sp, c.y, c.z]} rotation={[-Math.PI / 2, 0, c.rot]} renderOrder={-5}>
          <planeGeometry args={[c.s, c.s]} />
          <meshBasicMaterial map={A.cloud} transparent depthWrite={false} opacity={0.85} side={THREE.DoubleSide} fog={false} />
        </mesh>
      ))}
    </group>
  );
};
