import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../../meyebus/theme";
import { roundedBody } from "./assets";

const WHEEL_R = 0.3;

const Paint: React.FC<{ color?: string }> = ({ color = "#F07F1C" }) => <meshStandardMaterial color={color} metalness={0.3} roughness={0.32} envMapIntensity={1.3} />;
const Glass: React.FC = () => <meshStandardMaterial color="#132638" metalness={0.9} roughness={0.06} envMapIntensity={1.8} transparent opacity={0.88} />;
const Trim: React.FC = () => <meshStandardMaterial color="#15181C" roughness={0.65} metalness={0.2} />;
const Chrome: React.FC = () => <meshStandardMaterial color="#D9DEE4" roughness={0.18} metalness={1} envMapIntensity={1.5} />;

const Wheel: React.FC<{ x: number; z: number; rot: number }> = ({ x, z, rot }) => (
  <group position={[x, WHEEL_R, z]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh rotation={[0, rot, 0]} castShadow>
      <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.26, 24]} />
      <meshStandardMaterial color="#1B1D20" roughness={0.95} />
    </mesh>
    <mesh rotation={[0, rot, 0]} position={[0, z > 0 ? 0.135 : -0.135, 0]}>
      <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
      <meshStandardMaterial color="#B8BEC6" roughness={0.3} metalness={0.9} envMapIntensity={1.2} />
    </mesh>
    <mesh rotation={[0, rot, 0]} position={[0, z > 0 ? 0.15 : -0.15, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
      <Trim />
    </mesh>
  </group>
);

// Detailed school bus. Forward axis is +X, door on the right side (+Z).
export const BusPro: React.FC<{
  position: THREE.Vector3;
  yaw: number;
  dist: number;
  frame: number;
  stopArm?: number; // 0 folded .. 1 deployed
  lights?: number; // headlights / markers intensity
}> = ({ position, yaw, dist, frame, stopArm = 0, lights = 1 }) => {
  const body = useMemo(() => roundedBody(2.7, 1.1, 1.0, 0.14), []);
  const hood = useMemo(() => roundedBody(0.55, 1.0, 0.56, 0.1), []);
  const wheelRot = -dist / WHEEL_R;
  const bob = Math.sin(frame / 3) * 0.004;
  const blink = Math.sin(frame / 4) > 0 ? 1 : 0.15;
  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, yaw, 0]}>
      <group position={[0, bob, 0]}>
        <mesh geometry={body} position={[0, 0.9, 0]} castShadow>
          <Paint />
        </mesh>
        <mesh geometry={hood} position={[1.6, 0.66, 0]} castShadow>
          <Paint />
        </mesh>
        {/* underbody */}
        <mesh position={[0.1, 0.36, 0]}>
          <boxGeometry args={[2.9, 0.16, 0.9]} />
          <Trim />
        </mesh>
        {/* side windows */}
        <mesh position={[-0.2, 1.1, 0]}>
          <boxGeometry args={[2.05, 0.4, 1.17]} />
          <Glass />
        </mesh>
        {[-1.2, -0.72, -0.24, 0.24, 0.72].map((x, i) => (
          <mesh key={i} position={[x, 1.1, 0]}>
            <boxGeometry args={[0.035, 0.42, 1.18]} />
            <Trim />
          </mesh>
        ))}
        <mesh position={[-0.2, 1.31, 0]}>
          <boxGeometry args={[2.05, 0.03, 1.18]} />
          <Trim />
        </mesh>
        <mesh position={[-0.2, 0.89, 0]}>
          <boxGeometry args={[2.05, 0.03, 1.18]} />
          <Trim />
        </mesh>
        {/* rub rails */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[2.66, 0.05, 1.17]} />
          <Trim />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.66, 0.04, 1.17]} />
          <Trim />
        </mesh>
        {/* windshield + wipers */}
        <mesh position={[1.385, 1.1, 0]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.06, 0.46, 0.98]} />
          <Glass />
        </mesh>
        {[-0.25, 0.2].map((z, i) => (
          <mesh key={i} position={[1.42, 0.9, z]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.02, 0.3, 0.02]} />
            <Trim />
          </mesh>
        ))}
        {/* grille, bumper, lights */}
        <mesh position={[1.885, 0.62, 0]}>
          <boxGeometry args={[0.03, 0.26, 0.62]} />
          <Trim />
        </mesh>
        {[-0.06, 0, 0.06].map((y, i) => (
          <mesh key={i} position={[1.9, 0.62 + y, 0]}>
            <boxGeometry args={[0.01, 0.015, 0.6]} />
            <Chrome />
          </mesh>
        ))}
        <mesh position={[1.9, 0.42, 0]} castShadow>
          <boxGeometry args={[0.1, 0.14, 1.14]} />
          <meshStandardMaterial color="#3A3D42" roughness={0.6} metalness={0.4} />
        </mesh>
        {[-0.42, 0.42].map((z, i) => (
          <group key={i} position={[1.89, 0.72, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 20]} />
              <Chrome />
            </mesh>
            <mesh position={[0.02, 0, 0]}>
              <sphereGeometry args={[0.075, 16, 12]} />
              <meshStandardMaterial color="#FFFBEA" emissive="#FFF2C0" emissiveIntensity={2.2 * lights} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {[-0.5, 0.5].map((z, i) => (
          <mesh key={i} position={[1.86, 0.55, z]}>
            <boxGeometry args={[0.02, 0.06, 0.1]} />
            <meshStandardMaterial color="#FFB000" emissive="#FF9F00" emissiveIntensity={blink * stopArm * 3} />
          </mesh>
        ))}
        {/* roof marker lights */}
        {[-1.3, 1.3].map((x) =>
          [-0.35, 0.35].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 1.435, z]}>
              <boxGeometry args={[0.08, 0.05, 0.1]} />
              <meshStandardMaterial color={x > 0 ? "#FFB000" : "#E2261D"} emissive={x > 0 ? "#FF9F00" : "#E2261D"} emissiveIntensity={1.2 * lights} />
            </mesh>
          )),
        )}
        {/* tail lights */}
        {[-0.42, 0.42].map((z, i) => (
          <mesh key={i} position={[-1.39, 0.62, z]}>
            <boxGeometry args={[0.03, 0.16, 0.16]} />
            <meshStandardMaterial color="#B3120C" emissive="#E2261D" emissiveIntensity={1.4 * lights} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[-1.39, 1.05, 0]}>
          <boxGeometry args={[0.03, 0.36, 0.6]} />
          <Glass />
        </mesh>
        {/* mirrors */}
        {[-0.7, 0.7].map((z, i) => (
          <group key={i} position={[1.45, 1.15, z]}>
            <mesh position={[0, 0, z > 0 ? -0.08 : 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
              <Trim />
            </mesh>
            <mesh>
              <boxGeometry args={[0.04, 0.22, 0.12]} />
              <Trim />
            </mesh>
          </group>
        ))}
        {/* door (right side) */}
        <group position={[0.95, 0.7, 0.59]}>
          <mesh>
            <boxGeometry args={[0.44, 0.7, 0.02]} />
            <Trim />
          </mesh>
          {[-0.11, 0.11].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0.005]}>
              <boxGeometry args={[0.17, 0.42, 0.02]} />
              <Glass />
            </mesh>
          ))}
        </group>
        {/* stop arm (left side) */}
        <group position={[0.85, 0.95, -0.6]} rotation={[0, (stopArm * Math.PI) / 2, 0]}>
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.02]} />
            <Trim />
          </mesh>
          <group position={[-0.44, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.22, 0.22, 0.02, 8]} />
              <meshStandardMaterial color="#C8102E" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.005, 8]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.016, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.005, 8]} />
              <meshStandardMaterial color="#C8102E" roughness={0.4} />
            </mesh>
          </group>
        </group>
        {/* exhaust */}
        <mesh position={[-1.3, 0.3, -0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.2, 10]} />
          <Chrome />
        </mesh>
        <Wheel x={0.95} z={0.5} rot={wheelRot} />
        <Wheel x={0.95} z={-0.5} rot={wheelRot} />
        <Wheel x={-0.85} z={0.5} rot={wheelRot} />
        <Wheel x={-0.85} z={-0.5} rot={wheelRot} />
      </group>
    </group>
  );
};

export const PinPro: React.FC<{ position: THREE.Vector3; frame: number; drop: number; scale?: number; color?: string }> = ({ position, frame, drop, scale = 1, color = COLORS.orange }) => {
  const bob = Math.sin(frame / 14) * 0.08;
  const y = 2.3 + (1 - drop) * 12 + bob;
  if (drop < 0.005) return null;
  return (
    <group position={[position.x, position.y, position.z]}>
      <group position={[0, y, 0]} scale={scale}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.42, 28, 20]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} envMapIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.32, 0.9, 28]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} envMapIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0.3]}>
          <sphereGeometry args={[0.17, 18, 14]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} roughness={0.4} />
        </mesh>
      </group>
      {drop >= 1
        ? [0, 1].map((i) => {
            const p = ((frame + i * 22) % 44) / 44;
            return (
              <mesh key={i} position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.6 + p * 2.6}>
                <ringGeometry args={[0.8, 0.95, 48]} />
                <meshBasicMaterial color={color} transparent opacity={(1 - p) * 0.7} depthWrite={false} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};
