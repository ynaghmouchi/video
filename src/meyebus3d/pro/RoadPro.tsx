import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../../meyebus/theme";
import { ROUTE, ROUTE_LENGTH, STOP_POS, STOP_T } from "../timeline";
import { ribbonGeometry } from "../Road";
import { getAssets } from "./assets";

export const ROAD_W = 2.6;
const WALK_W = 1.5;

const routeSamples = () => {
  const pts: THREE.Vector3[] = [];
  const tans: THREE.Vector3[] = [];
  for (let i = 0; i <= 320; i++) {
    pts.push(ROUTE.getPointAt(i / 320));
    tans.push(ROUTE.getTangentAt(i / 320));
  }
  return { pts, tans };
};

// Asphalt road with painted lines, raised concrete sidewalks on both sides.
export const MRoadPro: React.FC = () => {
  const A = getAssets();
  const g = useMemo(() => {
    const { pts, tans } = routeSamples();
    return {
      asphalt: ribbonGeometry(pts, ROAD_W, 0.02, tans, 0, 4),
      gutterL: ribbonGeometry(pts, 0.18, 0.03, tans, ROAD_W / 2 - 0.09),
      gutterR: ribbonGeometry(pts, 0.18, 0.03, tans, -ROAD_W / 2 + 0.09),
      walkL: ribbonGeometry(pts, WALK_W, 0.1, tans, ROAD_W / 2 + WALK_W / 2, 2),
      walkR: ribbonGeometry(pts, WALK_W, 0.1, tans, -ROAD_W / 2 - WALK_W / 2, 2),
      curbL: ribbonGeometry(pts, 0.12, 0.105, tans, ROAD_W / 2 + 0.06),
      curbR: ribbonGeometry(pts, 0.12, 0.105, tans, -ROAD_W / 2 - 0.06),
      lineL: ribbonGeometry(pts, 0.07, 0.032, tans, ROAD_W / 2 - 0.28),
      lineR: ribbonGeometry(pts, 0.07, 0.032, tans, -ROAD_W / 2 + 0.28),
    };
  }, []);
  const dashes = useMemo(() => {
    const n = Math.floor(ROUTE_LENGTH / 1.3);
    return Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      const p = ROUTE.getPointAt(t);
      const tan = ROUTE.getTangentAt(t);
      return { p, yaw: Math.atan2(-tan.z, tan.x) };
    });
  }, []);
  // crosswalk right after the bus stop
  const cw = useMemo(() => {
    const t = STOP_T + 3.2 / ROUTE_LENGTH;
    const p = ROUTE.getPointAt(t);
    const tan = ROUTE.getTangentAt(t);
    return { p, yaw: Math.atan2(-tan.z, tan.x) };
  }, []);
  return (
    <group>
      <mesh geometry={g.walkL} receiveShadow>
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={g.walkR} receiveShadow>
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={g.curbL} receiveShadow>
        <meshStandardMaterial color="#9E9C96" roughness={0.9} />
      </mesh>
      <mesh geometry={g.curbR} receiveShadow>
        <meshStandardMaterial color="#9E9C96" roughness={0.9} />
      </mesh>
      <mesh geometry={g.asphalt} receiveShadow>
        <meshStandardMaterial map={A.asphalt} roughness={0.92} />
      </mesh>
      <mesh geometry={g.gutterL}>
        <meshStandardMaterial color="#2A2C30" roughness={0.9} />
      </mesh>
      <mesh geometry={g.gutterR}>
        <meshStandardMaterial color="#2A2C30" roughness={0.9} />
      </mesh>
      <mesh geometry={g.lineL}>
        <meshStandardMaterial color="#E8E6DE" roughness={0.7} />
      </mesh>
      <mesh geometry={g.lineR}>
        <meshStandardMaterial color="#E8E6DE" roughness={0.7} />
      </mesh>
      {dashes.map((d, i) => (
        <mesh key={i} position={[d.p.x, 0.033, d.p.z]} rotation={[0, d.yaw, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.12]} />
          <meshStandardMaterial color={COLORS.orange} roughness={0.6} />
        </mesh>
      ))}
      <group position={[cw.p.x, 0.034, cw.p.z]} rotation={[0, cw.yaw, 0]}>
        {[-0.9, -0.55, -0.2, 0.15, 0.5, 0.85].map((z, i) => (
          <mesh key={i} position={[0, 0, z]}>
            <boxGeometry args={[0.9, 0.01, 0.22]} />
            <meshStandardMaterial color="#ECEAE2" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const StreetPro: React.FC<{ from: [number, number]; to: [number, number] }> = ({ from, to }) => {
  const A = getAssets();
  const geo = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0, from[1]);
    const b = new THREE.Vector3(to[0], 0, to[1]);
    const pts = [a, a.clone().lerp(b, 0.5), b];
    return {
      road: ribbonGeometry(pts, 2.2, 0.015, undefined, 0, 4),
      walkL: ribbonGeometry(pts, 1.2, 0.09, undefined, 1.7, 2),
      walkR: ribbonGeometry(pts, 1.2, 0.09, undefined, -1.7, 2),
      a,
      b,
    };
  }, [from, to]);
  const len = geo.a.distanceTo(geo.b);
  const n = Math.floor(len / 1.6);
  const yaw = Math.atan2(-(geo.b.z - geo.a.z), geo.b.x - geo.a.x);
  return (
    <group>
      <mesh geometry={geo.walkL} receiveShadow>
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={geo.walkR} receiveShadow>
        <meshStandardMaterial map={A.concrete} roughness={0.95} />
      </mesh>
      <mesh geometry={geo.road} receiveShadow>
        <meshStandardMaterial map={A.asphalt} roughness={0.92} />
      </mesh>
      {Array.from({ length: n }, (_, i) => {
        const p = geo.a.clone().lerp(geo.b, (i + 0.5) / n);
        return (
          <mesh key={i} position={[p.x, 0.03, p.z]} rotation={[0, yaw, 0]}>
            <boxGeometry args={[0.6, 0.01, 0.1]} />
            <meshStandardMaterial color="#E8E6DE" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};

export const stopSidewalkPoint = () => new THREE.Vector3(STOP_POS.x, 0.1, STOP_POS.z + ROAD_W / 2 + 0.7);
