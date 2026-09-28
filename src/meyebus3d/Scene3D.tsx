import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../meyebus/theme";
import { Bus, Pin } from "./Bus";
import { MRoad, Street, RouteGlow } from "./Road";
import { Ground, CityLots, House, Tree, School, BusStop, FleetBus } from "./City";
import { Kids } from "./Kids";
import { busState, cameraPose, SCENES, HOME_POS, SCHOOL_POS, type Pose } from "./timeline";

const CameraRig: React.FC<{ pose: Pose }> = ({ pose }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.copy(pose.pos);
    camera.lookAt(pose.look);
    camera.fov = pose.fov;
    camera.near = 0.5;
    camera.far = 160;
    camera.updateProjectionMatrix();
  });
  return null;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bus = busState(frame);
  const pose = cameraPose(frame, bus);

  // Pin drops onto the bus during the reveal scene.
  const drop = spring({ frame: frame - (SCENES.reveal.from + 20), fps, config: { damping: 13, mass: 0.9 } });
  const glow = interpolate(frame, [SCENES.driver.from + 10, SCENES.driver.from + 40, SCENES.school.from + 20, SCENES.school.from + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fleet = interpolate(frame, [SCENES.school.from + 30, SCENES.school.from + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pinScale = interpolate(frame, [SCENES.driver.from, SCENES.driver.from + 30, SCENES.school.from, SCENES.school.from + 40], [1, 0.65, 0.65, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dawn = interpolate(frame, [SCENES.reveal.from - 20, SCENES.reveal.from + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Door of the bus in world space (right side, near the front).
  const fwd = bus.tangent.clone();
  const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
  const door = bus.pos.clone().add(fwd.multiplyScalar(0.95)).add(right.multiplyScalar(0.75));

  return (
    <>
      <CameraRig pose={pose} />
      <fog attach="fog" args={["#DCE8F5", 30, 90]} />
      <hemisphereLight args={["#FFFFFF", "#9FB4CC", 1.1]} />
      <ambientLight intensity={0.35 + dawn * 0.1} />
      <directionalLight position={[8, 16, 6]} intensity={2.4} color={dawn > 0.5 ? "#FFE1C2" : "#FFF6EA"} />
      <directionalLight position={[-10, 8, -6]} intensity={0.6} color="#BFD6F2" />

      <Ground />
      <MRoad />
      <Street from={[-14, -18]} to={[-14, 18]} />
      <Street from={[14, -18]} to={[14, 18]} />
      <Street from={[-20, -13]} to={[20, -13]} />
      <Street from={[-20, 12]} to={[20, 12]} />
      <CityLots />

      {/* the family's house */}
      <House x={HOME_POS.x} z={HOME_POS.z} s={1.25} roof={COLORS.orange} wall="#FFFFFF" rot={Math.PI / 2 + 0.35} lit={dawn > 0.4} />
      <Tree x={HOME_POS.x - 1.6} z={HOME_POS.z + 1.4} s={0.9} />
      <Tree x={HOME_POS.x + 1.4} z={HOME_POS.z - 1.6} s={1.1} c="#4EA35A" />

      <School frame={frame} />
      <BusStop />
      <Kids frame={frame} door={door} boardAt={SCENES.students.from + 30} />

      <RouteGlow t={bus.t} length={0.16} opacity={glow} />
      <Bus position={bus.pos} yaw={bus.yaw} dist={bus.dist} frame={frame} />
      <Pin position={bus.pos} frame={frame} drop={drop} scale={pinScale} />

      {/* fleet overview: two more tracked buses on the side streets */}
      {fleet > 0 ? (
        <>
          <FleetBus from={[-14, 16]} to={[-14, -16]} frame={frame} speed={0.0013} offset={0.15}>
            {(p, yaw) => (
              <>
                <Bus position={p} yaw={yaw} dist={frame * 0.05} frame={frame} />
                <Pin position={p} frame={frame + 9} drop={1} scale={fleet} color={COLORS.blue} />
              </>
            )}
          </FleetBus>
          <FleetBus from={[20, -13]} to={[-20, -13]} frame={frame} speed={0.0011} offset={0.6}>
            {(p, yaw) => (
              <>
                <Bus position={p} yaw={yaw} dist={frame * 0.05} frame={frame} />
                <Pin position={p} frame={frame + 17} drop={1} scale={fleet} color={COLORS.green} />
              </>
            )}
          </FleetBus>
          {/* data beacon above the school */}
          <mesh position={[SCHOOL_POS.x, 6 + fleet * 2, SCHOOL_POS.z]} scale={[1, fleet, 1]}>
            <cylinderGeometry args={[0.5, 1.6, 12, 24, 1, true]} />
            <meshBasicMaterial color="#5AA8FF" transparent opacity={0.18 * fleet} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      ) : null}
    </>
  );
};

export const Scene3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} dpr={1} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 20, 30], fov: 40, near: 0.5, far: 160 }}>
      <World />
    </ThreeCanvas>
  );
};
