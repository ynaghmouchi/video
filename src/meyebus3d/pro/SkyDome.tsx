import React, { useMemo } from "react";
import * as THREE from "three";

const vert = `
varying vec3 vDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vDir = normalize(wp.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const frag = `
varying vec3 vDir;
uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; uniform vec3 sunDir; uniform vec3 sunColor;
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, -1.0, 1.0);
  vec3 col = mix(horizon, top, pow(max(h, 0.0), 0.5));
  col = mix(ground, col, smoothstep(-0.06, 0.01, h));
  float s = max(dot(d, normalize(sunDir)), 0.0);
  col += sunColor * (pow(s, 900.0) * 1.4 + pow(s, 14.0) * 0.45 + pow(s, 3.0) * 0.12);
  gl_FragColor = vec4(col, 1.0);
}`;

export const skyUniforms = {
  top: { value: new THREE.Color() },
  horizon: { value: new THREE.Color() },
  ground: { value: new THREE.Color("#C9D3DC") },
  sunDir: { value: new THREE.Vector3(0, 1, 0) },
  sunColor: { value: new THREE.Color() },
};

// Gradient sky dome with a sun; colours blend from dawn to day.
export const SkyDome: React.FC<{ dawn: number; sunDir: THREE.Vector3; ground: THREE.Color }> = ({ dawn, sunDir, ground }) => {
  const uniforms = useMemo(() => THREE.UniformsUtils.clone(skyUniforms), []);
  const top = new THREE.Color("#4C90D9").lerp(new THREE.Color("#2B4A80"), dawn);
  const horizon = new THREE.Color("#D6E6F4").lerp(new THREE.Color("#F5B98E"), dawn);
  const sunColor = new THREE.Color("#FFF4DC").lerp(new THREE.Color("#FFB36B"), dawn);
  return (
    <mesh renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[300, 32, 16]} />
      <shaderMaterial
        args={[{ uniforms, vertexShader: vert, fragmentShader: frag }]}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms-top-value={top}
        uniforms-horizon-value={horizon}
        uniforms-sunColor-value={sunColor}
        uniforms-sunDir-value={sunDir}
        uniforms-ground-value={ground}
      />
    </mesh>
  );
};
