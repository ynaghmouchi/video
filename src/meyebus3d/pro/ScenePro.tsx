import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ThreeCanvas } from "@remotion/three";
import { useThree, type RootState } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../../meyebus/theme";
import { busState, cameraPose, SCENES, HOME_POS, SCHOOL_POS, type Pose } from "../timeline";
import { RouteGlow } from "../Road";
import { BusPro, PinPro } from "./BusPro";
import { MRoadPro, StreetPro } from "./RoadPro";
import { GroundPro, LotsPro, HousePro, TreePro, SchoolPro, BusStopPro, LampsPro, CarsPro, CloudsPro } from "./CityPro";
import { KidsPro } from "./KidsPro";
import { SkyDome } from "./SkyDome";

// Sun direction: low and warm at dawn, high by day.
export const sunDirection = (dawn: number): THREE.Vector3 => {
  const el = THREE.MathUtils.lerp(0.95, 0.2, dawn);
  const az = THREE.MathUtils.lerp(0.9, 0.35, dawn);
  return new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.sin(el), -Math.cos(el) * Math.sin(az)).normalize();
};

export const dawnAmount = (frame: number) =>
  interpolate(frame, [SCENES.reveal.from - 30, SCENES.reveal.from + 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const CameraRig: React.FC<{ pose: Pose; frame: number }> = ({ pose, frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    // subtle hand-held drift, damped in the top-down shots
    const topDown = interpolate(frame, [SCENES.school.from + 60, SCENES.outro.from], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const amp = 0.035 * (1 - topDown);
    const dx = Math.sin(frame / 17) * amp + Math.sin(frame / 41) * amp;
    const dy = Math.cos(frame / 23) * amp * 0.6;
    camera.position.copy(pose.pos).add(new THREE.Vector3(dx, dy, dx * 0.5));
    camera.lookAt(pose.look.clone().add(new THREE.Vector3(dx * 0.4, dy * 0.4, 0)));
    camera.fov = pose.fov;
    camera.near = 0.3;
    camera.far = 700;
    camera.updateProjectionMatrix();
  });
  return null;
};

const Sun: React.FC<{ dawn: number; look: THREE.Vector3; camHeight: number }> = ({ dawn, look, camHeight }) => {
  const ref = useRef<THREE.DirectionalLight>(null);
  const dir = sunDirection(dawn);
  const half = THREE.MathUtils.clamp(camHeight * 0.85, 12, 42);
  useLayoutEffect(() => {
    const l = ref.current;
    if (!l) return;
    l.position.copy(look).add(dir.clone().multiplyScalar(70));
    l.target.position.copy(look);
    l.target.updateMatrixWorld();
    const c = l.shadow.camera;
    c.left = -half;
    c.right = half;
    c.top = half;
    c.bottom = -half;
    c.near = 10;
    c.far = 160;
    c.updateProjectionMatrix();
  });
  const color = new THREE.Color("#FFF4E6").lerp(new THREE.Color("#FFB070"), dawn);
  return (
    <>
      <directionalLight ref={ref} castShadow intensity={2.6 + dawn * 0.6} color={color} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0006} shadow-normalBias={0.03} shadow-radius={3} />
      {ref.current ? <primitive object={ref.current.target} /> : null}
    </>
  );
};

const WorldPro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bus = busState(frame);
  const pose = cameraPose(frame, bus);
  const dawn = dawnAmount(frame);

  const drop = spring({ frame: frame - (SCENES.reveal.from + 20), fps, config: { damping: 13, mass: 0.9 } });
  const glow = interpolate(frame, [SCENES.driver.from + 10, SCENES.driver.from + 40, SCENES.school.from + 20, SCENES.school.from + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fleet = interpolate(frame, [SCENES.school.from + 30, SCENES.school.from + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pinScale = interpolate(frame, [SCENES.driver.from, SCENES.driver.from + 30, SCENES.school.from, SCENES.school.from + 40], [1, 0.65, 0.65, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stopArm = interpolate(frame, [SCENES.students.from + 8, SCENES.students.from + 30, SCENES.students.from + 150, SCENES.students.from + 172], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fwd = bus.tangent.clone();
  const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
  const door = bus.pos.clone().add(fwd.multiplyScalar(0.95)).add(right.multiplyScalar(0.8));

  const fogColor = useMemo(() => new THREE.Color("#D8E4EE").lerp(new THREE.Color("#E8C7AE"), dawn), [dawn]);
  const sunDir = sunDirection(dawn);

  return (
    <>
      <CameraRig pose={pose} frame={frame} />
      <fog attach="fog" args={[fogColor, 45, 170]} />
      <SkyDome dawn={dawn} sunDir={sunDir} ground={fogColor} />
      <CloudsPro frame={frame} />
      <hemisphereLight args={["#DCE9F7", "#7A8B6E", 0.55 + (1 - dawn) * 0.25]} />
      <ambientLight intensity={0.12} />
      <Sun dawn={dawn} look={pose.look} camHeight={pose.pos.y} />
      <directionalLight position={[-20, 12, -10]} intensity={0.35} color="#C9DDF2" />

      <GroundPro />
      <MRoadPro />
      <StreetPro from={[-14, -24]} to={[-14, 24]} />
      <StreetPro from={[14, -24]} to={[14, 24]} />
      <StreetPro from={[-26, -13]} to={[26, -13]} />
      <StreetPro from={[-26, 12]} to={[26, 12]} />
      <LotsPro dawn={dawn} />
      <LampsPro on={dawn} />
      <CarsPro frame={frame} />

      {/* the family's house */}
      <HousePro x={HOME_POS.x} z={HOME_POS.z} s={1.3} rot={Math.PI / 2 + 0.35} roof="red" lit={dawn} />
      <TreePro x={HOME_POS.x - 1.9} z={HOME_POS.z + 1.6} s={0.95} seed={51} />
      <TreePro x={HOME_POS.x + 1.6} z={HOME_POS.z - 1.9} s={1.15} seed={52} />

      <SchoolPro frame={frame} dawn={dawn} />
      <BusStopPro />
      <group>
        <KidsPro frame={frame} door={door} boardAt={SCENES.students.from + 30} />
      </group>

      <RouteGlow t={bus.t} length={0.16} opacity={glow} />
      <BusPro position={bus.pos} yaw={bus.yaw} dist={bus.dist} frame={frame} stopArm={stopArm} lights={0.6 + dawn * 0.6} />
      <PinPro position={bus.pos} frame={frame} drop={drop} scale={pinScale} />

      {fleet > 0 ? (
        <>
          {[
            { a: new THREE.Vector3(-14.55, 0, 20), b: new THREE.Vector3(-14.55, 0, -20), speed: 0.0013, off: 0.15, color: COLORS.blue, k: 9 },
            { a: new THREE.Vector3(26, 0, -12.45), b: new THREE.Vector3(-26, 0, -12.45), speed: 0.0011, off: 0.6, color: COLORS.green, k: 17 },
          ].map((m, i) => {
            const u = ((frame * m.speed + m.off) % 1 + 1) % 1;
            const p = m.a.clone().lerp(m.b, u);
            const yaw = Math.atan2(-(m.b.z - m.a.z), m.b.x - m.a.x);
            return (
              <group key={i}>
                <BusPro position={p} yaw={yaw} dist={u * m.a.distanceTo(m.b)} frame={frame} lights={0.6} />
                <PinPro position={p} frame={frame + m.k} drop={1} scale={fleet} color={m.color} />
              </group>
            );
          })}
          <mesh position={[SCHOOL_POS.x, 6 + fleet * 2, SCHOOL_POS.z]} scale={[1, fleet, 1]}>
            <cylinderGeometry args={[0.5, 1.8, 12, 24, 1, true]} />
            <meshBasicMaterial color="#5AA8FF" transparent opacity={0.16 * fleet} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      ) : null}
    </>
  );
};

const onCreated = (state: RootState) => {
  const { gl, scene } = state;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.02;
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(gl);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
};

export const ScenePro: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} dpr={1} shadows gl={{ antialias: true, alpha: true }} onCreated={onCreated} camera={{ position: [0, 20, 30], fov: 40, near: 0.3, far: 700 }}>
      <WorldPro />
    </ThreeCanvas>
  );
};
