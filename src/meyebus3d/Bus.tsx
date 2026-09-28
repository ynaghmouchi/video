import React from "react";
import * as THREE from "three";
import { COLORS } from "../meyebus/theme";

const WHEEL_R = 0.28;

// Low-poly orange school bus. Forward axis is +X.
export const Bus: React.FC<{
  position: THREE.Vector3;
  yaw: number;
  dist: number; // distance travelled, drives the wheel rotation
  frame: number;
}> = ({ position, yaw, dist, frame }) => {
  const wheelRot = -dist / WHEEL_R;
  const bob = Math.sin(frame / 3) * 0.006;
  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, yaw, 0]}>
      {/* blob shadow */}
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 1.5]} />
        <meshBasicMaterial color="#0A1626" transparent opacity={0.22} />
      </mesh>
      <group position={[0, bob, 0]}>
        {/* body */}
        <mesh position={[0, 0.78, 0]}>
          <boxGeometry args={[2.6, 0.9, 1.1]} />
          <meshLambertMaterial color={COLORS.orange} />
        </mesh>
        {/* hood */}
        <mesh position={[1.45, 0.62, 0]}>
          <boxGeometry args={[0.36, 0.56, 1.0]} />
          <meshLambertMaterial color={COLORS.orange} />
        </mesh>
        {/* roof */}
        <mesh position={[0, 1.27, 0]}>
          <boxGeometry args={[2.5, 0.1, 1.02]} />
          <meshLambertMaterial color={COLORS.orangeDeep} />
        </mesh>
        {/* window band */}
        <mesh position={[-0.15, 0.95, 0]}>
          <boxGeometry args={[2.0, 0.36, 1.13]} />
          <meshLambertMaterial color="#F4F8FC" />
        </mesh>
        {[-0.85, -0.35, 0.15, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0.95, 0]}>
            <boxGeometry args={[0.05, 0.38, 1.15]} />
            <meshLambertMaterial color={COLORS.navy} />
          </mesh>
        ))}
        {/* windshield */}
        <mesh position={[1.31, 0.95, 0]}>
          <boxGeometry args={[0.06, 0.4, 0.9]} />
          <meshLambertMaterial color="#DDEBFA" />
        </mesh>
        {/* navy stripe */}
        <mesh position={[0, 0.56, 0]}>
          <boxGeometry args={[2.62, 0.08, 1.12]} />
          <meshLambertMaterial color={COLORS.navy} />
        </mesh>
        {/* headlights + tail lights */}
        {[-0.35, 0.35].map((z, i) => (
          <mesh key={i} position={[1.64, 0.5, z]}>
            <boxGeometry args={[0.04, 0.14, 0.18]} />
            <meshBasicMaterial color="#FFF3B0" />
          </mesh>
        ))}
        {[-0.4, 0.4].map((z, i) => (
          <mesh key={i} position={[-1.31, 0.5, z]}>
            <boxGeometry args={[0.03, 0.12, 0.14]} />
            <meshBasicMaterial color="#E2574C" />
          </mesh>
        ))}
        {/* door (right side, +z) */}
        <mesh position={[0.95, 0.62, 0.552]}>
          <boxGeometry args={[0.36, 0.6, 0.02]} />
          <meshLambertMaterial color="#F4F8FC" />
        </mesh>
        {/* wheels */}
        {[
          [0.85, 0.5],
          [0.85, -0.5],
          [-0.85, 0.5],
          [-0.85, -0.5],
        ].map(([x, z], i) => (
          <group key={i} position={[x, WHEEL_R, z]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh rotation={[0, wheelRot, 0]}>
              <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.22, 16]} />
              <meshLambertMaterial color="#13223A" />
            </mesh>
            <mesh rotation={[0, wheelRot, 0]} position={[0, z > 0 ? 0.12 : -0.12, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 12]} />
              <meshLambertMaterial color="#DDE3EA" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// Orange location pin hovering above the bus + pulse rings on the ground.
export const Pin: React.FC<{
  position: THREE.Vector3;
  frame: number;
  drop: number; // 0 = far above, 1 = landed
  scale?: number;
  color?: string;
}> = ({ position, frame, drop, scale = 1, color = COLORS.orange }) => {
  const bob = Math.sin(frame / 14) * 0.08;
  const y = 2.25 + (1 - drop) * 12 + bob;
  if (drop < 0.005) return null;
  return (
    <group position={[position.x, position.y, position.z]}>
      <group position={[0, y, 0]} scale={scale}>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.42, 20, 16]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.32, 0.9, 20]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.55, 0.3]}>
          <sphereGeometry args={[0.17, 14, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
      {drop >= 1
        ? [0, 1].map((i) => {
            const p = ((frame + i * 22) % 44) / 44;
            return (
              <mesh key={i} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.6 + p * 2.6}>
                <ringGeometry args={[0.8, 0.95, 48]} />
                <meshBasicMaterial color={color} transparent opacity={(1 - p) * 0.7} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};
