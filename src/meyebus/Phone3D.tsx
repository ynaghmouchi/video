import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// A rotating 3D phone (body + glowing screen). No textures, so it renders
// reliably with software WebGL (--gl=swangle). Brand content is overlaid in
// 2D by the scene on top of this canvas.
export const Phone3D: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = spring({ frame, fps, config: { damping: 20, mass: 1.4 } });
  const rotY = interpolate(spin, [0, 1], [Math.PI * 0.92, -0.32]);
  const float = Math.sin(frame / 30) * 0.07;

  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 6.2], fov: 42 }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 9, 7]} intensity={2.6} />
      <pointLight position={[-5, -2, 5]} intensity={70} color="#2D6CDF" />
      <pointLight position={[5, 3, 4]} intensity={40} color="#F5821F" />
      <group rotation={[0.07, rotY, float * 0.25]} position={[0, float, 0]}>
        <mesh>
          <boxGeometry args={[2.15, 4.35, 0.24]} />
          <meshStandardMaterial color="#0A1626" metalness={0.65} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.125]}>
          <boxGeometry args={[1.95, 4.15, 0.02]} />
          <meshStandardMaterial color="#10305c" emissive="#2D6CDF" emissiveIntensity={0.7} roughness={0.18} metalness={0.1} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
