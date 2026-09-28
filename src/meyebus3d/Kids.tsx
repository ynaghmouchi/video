import React from "react";
import * as THREE from "three";
import { interpolate, Easing } from "remotion";
import { STOP_POS } from "./timeline";

const KIDS = [
  { shirt: "#2D6CDF", pack: "#F5821F", skin: "#F1C9A5", hair: "#3B2A20", dx: -0.3 },
  { shirt: "#1FA97A", pack: "#2D6CDF", skin: "#C68642", hair: "#1B1B1B", dx: 0.45 },
  { shirt: "#E2574C", pack: "#1FA97A", skin: "#F1C9A5", hair: "#8B5A2B", dx: 1.2 },
];

const Kid: React.FC<{ c: (typeof KIDS)[number]; frame: number; walk: number }> = ({ c, frame, walk }) => {
  const step = Math.sin(frame / 3) * walk;
  return (
    <group>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.36, 10]} />
        <meshLambertMaterial color={c.shirt} />
      </mesh>
      {[-0.07, 0.07].map((x, i) => (
        <mesh key={i} position={[x, 0.09, (i === 0 ? step : -step) * 0.08]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshLambertMaterial color="#0E2A47" />
        </mesh>
      ))}
      <mesh position={[0, 0.68, 0]}>
        <sphereGeometry args={[0.17, 14, 12]} />
        <meshLambertMaterial color={c.skin} />
      </mesh>
      <mesh position={[0, 0.76, -0.02]}>
        <sphereGeometry args={[0.175, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={c.hair} />
      </mesh>
      <mesh position={[0, 0.4, -0.18]}>
        <boxGeometry args={[0.22, 0.28, 0.12]} />
        <meshLambertMaterial color={c.pack} />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#0A1626" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Kids wait at the stop, then walk to the bus door one after another and hop in.
// `door` is the world position of the bus door; `boardAt` the frame the first kid starts.
export const Kids: React.FC<{ frame: number; door: THREE.Vector3; boardAt: number }> = ({ frame, door, boardAt }) => (
  <group>
    {KIDS.map((c, i) => {
      const start = boardAt + i * 34;
      const u = interpolate(frame, [start, start + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
      const inside = interpolate(frame, [start + 28, start + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const home = new THREE.Vector3(STOP_POS.x + 0.4 + c.dx, 0, STOP_POS.z + 2.0);
      const p = home.lerp(door, u);
      const idle = Math.sin(frame / 10 + i) * 0.01;
      const facing = u > 0 && u < 1 ? Math.atan2(-(door.z - home.z), door.x - home.x) + Math.PI / 2 : Math.PI;
      if (inside <= 0) return null;
      return (
        <group key={i} position={[p.x, idle + (1 - inside) * 0.4, p.z]} rotation={[0, facing, 0]} scale={inside}>
          <Kid c={c} frame={frame} walk={u > 0 && u < 1 ? 1 : 0} />
        </group>
      );
    })}
  </group>
);
