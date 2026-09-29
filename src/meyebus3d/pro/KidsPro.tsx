import React from "react";
import * as THREE from "three";
import { interpolate, Easing } from "remotion";
import { STOP_POS } from "../timeline";
import { ROAD_W } from "./RoadPro";

const KIDS = [
  { shirt: "#2D6CDF", pants: "#2B2F3A", pack: "#F5821F", skin: "#F1C9A5", hair: "#3B2A20", dx: -0.2, h: 0.86 },
  { shirt: "#1FA97A", pants: "#3D4A6B", pack: "#2D6CDF", skin: "#C68642", hair: "#1B1B1B", dx: 0.55, h: 0.8 },
  { shirt: "#E2574C", pants: "#2B2F3A", pack: "#1FA97A", skin: "#F1C9A5", hair: "#8B5A2B", dx: 1.3, h: 0.9 },
];

const Limb: React.FC<{ position: [number, number, number]; rotation: number; length: number; color: string; r?: number }> = ({ position, rotation, length, color, r = 0.045 }) => (
  <group position={position} rotation={[rotation, 0, 0]}>
    <mesh position={[0, -length / 2, 0]} castShadow>
      <capsuleGeometry args={[r, length - r * 2, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  </group>
);

const Kid: React.FC<{ c: (typeof KIDS)[number]; frame: number; walk: number }> = ({ c, frame, walk }) => {
  const sw = Math.sin(frame / 2.6) * 0.7 * walk;
  return (
    <group scale={c.h}>
      {/* legs */}
      <Limb position={[-0.07, 0.42, 0]} rotation={sw} length={0.4} color={c.pants} />
      <Limb position={[0.07, 0.42, 0]} rotation={-sw} length={0.4} color={c.pants} />
      {/* torso */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.28, 4, 10]} />
        <meshStandardMaterial color={c.shirt} roughness={0.85} />
      </mesh>
      {/* arms */}
      <Limb position={[-0.17, 0.74, 0]} rotation={-sw} length={0.34} color={c.shirt} r={0.04} />
      <Limb position={[0.17, 0.74, 0]} rotation={sw} length={0.34} color={c.shirt} r={0.04} />
      {/* head */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.15, 18, 14]} />
        <meshStandardMaterial color={c.skin} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.04, -0.01]}>
        <sphereGeometry args={[0.155, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={c.hair} roughness={0.9} />
      </mesh>
      {/* backpack */}
      <mesh position={[0, 0.66, -0.17]} castShadow>
        <boxGeometry args={[0.22, 0.3, 0.13]} />
        <meshStandardMaterial color={c.pack} roughness={0.7} />
      </mesh>
    </group>
  );
};

export const KidsPro: React.FC<{ frame: number; door: THREE.Vector3; boardAt: number }> = ({ frame, door, boardAt }) => (
  <group>
    {KIDS.map((c, i) => {
      const start = boardAt + i * 34;
      const u = interpolate(frame, [start, start + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
      const inside = interpolate(frame, [start + 28, start + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const home = new THREE.Vector3(STOP_POS.x + 0.3 + c.dx, 0.1, STOP_POS.z + ROAD_W / 2 + 0.75);
      const p = home.clone().lerp(door, u);
      const idle = Math.sin(frame / 10 + i) * 0.01;
      const facing = u > 0 && u < 1 ? Math.atan2(-(door.z - home.z), door.x - home.x) + Math.PI / 2 : Math.PI;
      if (inside <= 0) return null;
      return (
        <group key={i} position={[p.x, p.y + idle + (1 - inside) * 0.4, p.z]} rotation={[0, facing, 0]} scale={inside}>
          <Kid c={c} frame={frame} walk={u > 0 && u < 1 ? 1 : 0} />
        </group>
      );
    })}
  </group>
);
