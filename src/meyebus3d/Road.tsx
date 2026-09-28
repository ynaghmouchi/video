import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../meyebus/theme";
import { ROUTE, ROUTE_LENGTH } from "./timeline";

// Flat ribbon that follows a curve (used for the "M" road and the glowing route).
export const ribbonGeometry = (
  points: THREE.Vector3[],
  width: number,
  y: number,
  tangents?: THREE.Vector3[],
): THREE.BufferGeometry => {
  const pos: number[] = [];
  const idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tan = tangents ? tangents[i].clone() : next.clone().sub(prev);
    if (tan.lengthSq() < 1e-8) tan.set(1, 0, 0);
    tan.normalize();
    const side = new THREE.Vector3().crossVectors(tan, up).normalize().multiplyScalar(width / 2);
    pos.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z);
    if (i > 0) {
      const a = (i - 1) * 2;
      // counter-clockwise seen from above, so the face normal points up (+y)
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

export const ROAD_W = 2.3;

export const MRoad: React.FC = () => {
  const samples = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const tans: THREE.Vector3[] = [];
    for (let i = 0; i <= 300; i++) {
      pts.push(ROUTE.getPointAt(i / 300));
      tans.push(ROUTE.getTangentAt(i / 300));
    }
    return { pts, tans };
  }, []);
  const asphalt = useMemo(() => ribbonGeometry(samples.pts, ROAD_W, 0.02, samples.tans), [samples]);
  const curb = useMemo(() => ribbonGeometry(samples.pts, ROAD_W + 0.7, 0.012, samples.tans), [samples]);
  const dashes = useMemo(() => {
    const n = Math.floor(ROUTE_LENGTH / 1.1);
    return Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      const p = ROUTE.getPointAt(t);
      const tan = ROUTE.getTangentAt(t);
      return { p, yaw: Math.atan2(-tan.z, tan.x) };
    });
  }, []);
  return (
    <group>
      <mesh geometry={curb}>
        <meshLambertMaterial color="#F7F9FC" />
      </mesh>
      <mesh geometry={asphalt}>
        <meshLambertMaterial color={COLORS.navy} />
      </mesh>
      {dashes.map((d, i) => (
        <mesh key={i} position={[d.p.x, 0.035, d.p.z]} rotation={[0, d.yaw, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.12]} />
          <meshBasicMaterial color={COLORS.orange} />
        </mesh>
      ))}
    </group>
  );
};

// Straight secondary streets, white dashes.
export const Street: React.FC<{ from: [number, number]; to: [number, number] }> = ({ from, to }) => {
  const geo = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0, from[1]);
    const b = new THREE.Vector3(to[0], 0, to[1]);
    const pts = [a, a.clone().lerp(b, 0.5), b];
    return { road: ribbonGeometry(pts, 1.8, 0.015), curb: ribbonGeometry(pts, 2.4, 0.01), a, b };
  }, [from, to]);
  const len = geo.a.distanceTo(geo.b);
  const n = Math.floor(len / 1.4);
  const yaw = Math.atan2(-(geo.b.z - geo.a.z), geo.b.x - geo.a.x);
  return (
    <group>
      <mesh geometry={geo.curb}>
        <meshLambertMaterial color="#F7F9FC" />
      </mesh>
      <mesh geometry={geo.road}>
        <meshLambertMaterial color="#26456E" />
      </mesh>
      {Array.from({ length: n }, (_, i) => {
        const p = geo.a.clone().lerp(geo.b, (i + 0.5) / n);
        return (
          <mesh key={i} position={[p.x, 0.03, p.z]} rotation={[0, yaw, 0]}>
            <boxGeometry args={[0.5, 0.01, 0.1]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        );
      })}
    </group>
  );
};

// Glowing segment of the route ahead of the bus (driver scene).
export const RouteGlow: React.FC<{ t: number; length: number; opacity: number }> = ({ t, length, opacity }) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const tans: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const u = Math.min(1, t + (i / 40) * length);
      pts.push(ROUTE.getPointAt(u));
      tans.push(ROUTE.getTangentAt(u));
    }
    return ribbonGeometry(pts, 1.1, 0.05, tans);
  }, [t, length]);
  if (opacity <= 0.001) return null;
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#5AA8FF" transparent opacity={opacity * 0.85} />
      </mesh>
      {[0.35, 0.7, 1].map((k, i) => {
        const p = ROUTE.getPointAt(Math.min(1, t + length * k));
        return (
          <mesh key={i} position={[p.x, 0.45, p.z]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshBasicMaterial color={i === 2 ? COLORS.orange : "#5AA8FF"} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
};
