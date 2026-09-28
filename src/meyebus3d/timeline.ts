import * as THREE from "three";
import { Easing, interpolate } from "remotion";

// ---------------------------------------------------------------- Scenes
// One continuous 3D world; the camera flies from one scene to the next.
export const SCENES = {
  dawn: { from: 0, dur: 150 },
  question: { from: 150, dur: 150 },
  reveal: { from: 300, dur: 150 },
  parents: { from: 450, dur: 180 },
  students: { from: 630, dur: 180 },
  driver: { from: 810, dur: 150 },
  school: { from: 960, dur: 180 },
  outro: { from: 1140, dur: 300 },
} as const;
export const SPOT_FRAMES = SCENES.outro.from + SCENES.outro.dur; // 1440 = 48s @ 30fps

// ---------------------------------------------------------------- Route
// The bus route draws an "M", like the road on the M'EyeBus badge.
// x: left → right, z: far (negative) → near (positive).
const M_POINTS: [number, number][] = [
  [-10, 9],
  [-10, 2],
  [-10, -5],
  [-8.6, -8.4],
  [-6.6, -6.8],
  [-4.4, -2],
  [-2.4, 3],
  [0, 4.6],
  [2.4, 3],
  [4.4, -2],
  [6.6, -6.8],
  [8.6, -8.4],
  [10, -5],
  [10, 2],
  [10, 9],
];
export const ROUTE = new THREE.CatmullRomCurve3(
  M_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  false,
  "centripetal",
);
export const ROUTE_LENGTH = ROUTE.getLength();
export const ROUTE_SAMPLES = ROUTE.getSpacedPoints(240);

export const STOP_T = 0.5; // the bus stop sits at the middle of the "M"
export const STOP_POS = ROUTE.getPointAt(STOP_T);
export const SCHOOL_POS = new THREE.Vector3(10, 0, 12.6);
export const HOME_POS = new THREE.Vector3(-13.6, 0, 5.4);
export const BUS_START = ROUTE.getPointAt(0);

// Progress of the bus along the route, 0..1, over the whole spot.
export const busProgress = (frame: number): number =>
  interpolate(
    frame,
    [0, 150, 300, 450, 630, 790, 960, 1140, 1290, SPOT_FRAMES],
    [0, 0.015, 0.04, 0.2, STOP_T, STOP_T, 0.7, 0.86, 1, 1],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

export type BusState = {
  t: number;
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  yaw: number;
  dist: number;
};

export const busState = (frame: number): BusState => {
  const t = busProgress(frame);
  const pos = ROUTE.getPointAt(t);
  const tangent = ROUTE.getTangentAt(t).normalize();
  return { t, pos, tangent, yaw: Math.atan2(-tangent.z, tangent.x), dist: t * ROUTE_LENGTH };
};

// ---------------------------------------------------------------- Camera
export type Pose = { pos: THREE.Vector3; look: THREE.Vector3; fov: number };
type PoseFn = (bus: BusState, frame: number) => Pose;
type Key = { f: number; pose: PoseFn; easing?: (t: number) => number };

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const abs =
  (pos: [number, number, number], look: [number, number, number], fov = 40): PoseFn =>
  () => ({ pos: v(...pos), look: v(...look), fov });
const rel =
  (off: [number, number, number], lookOff: [number, number, number] = [0, 0.6, 0], fov = 40): PoseFn =>
  (bus) => ({ pos: bus.pos.clone().add(v(...off)), look: bus.pos.clone().add(v(...lookOff)), fov });
// Behind the bus, looking down the road (driver's point of view).
const chase =
  (back: number, height: number, ahead: number, fov = 46): PoseFn =>
  (bus) => ({
    pos: bus.pos.clone().sub(bus.tangent.clone().multiplyScalar(back)).add(v(0, height, 0)),
    look: bus.pos.clone().add(bus.tangent.clone().multiplyScalar(ahead)).add(v(0, 0.5, 0)),
    fov,
  });
const orbit =
  (radius: number, height: number, a0: number, a1: number, fov = 40): PoseFn =>
  (bus, frame) => {
    const u = interpolate(frame, [SCENES.reveal.from, SCENES.reveal.from + SCENES.reveal.dur], [a0, a1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      pos: bus.pos.clone().add(v(Math.sin(u) * radius, height, Math.cos(u) * radius)),
      look: bus.pos.clone().add(v(0, 0.2, 0)),
      fov,
    };
  };

const smooth = Easing.inOut(Easing.cubic);
const KEYS: Key[] = [
  // Dawn: wide establishing shot, slow push-in.
  { f: 0, pose: abs([-24, 16, 30], [-4, 5, -8], 42), easing: Easing.out(Easing.quad) },
  { f: 150, pose: abs([-20, 13, 24], [-6, 3, -2], 42), easing: smooth },
  // Question: drift towards the family's house.
  { f: 230, pose: abs([-21.5, 8.5, 16.5], [-13.2, 0.8, 5.2], 40), easing: Easing.inOut(Easing.quad) },
  { f: 300, pose: abs([-21, 8, 15.5], [-13.4, 0.8, 5.4], 40), easing: smooth },
  // Reveal: orbit around the bus while the pin drops.
  { f: 360, pose: orbit(8, 3.8, 1.0, -0.4), easing: smooth },
  { f: 450, pose: orbit(8, 3.8, 1.0, -0.4), easing: smooth },
  // Parents: follow from the side / above.
  { f: 520, pose: rel([1.5, 6, 9.5], [0, 0.5, 0], 40), easing: smooth },
  { f: 630, pose: rel([1.5, 6, 9.5], [0, 0.5, 0], 40), easing: smooth },
  // Students: settle at the bus stop.
  { f: 690, pose: abs([6.5, 4.6, 11.5], [1.0, 0.1, 5.8], 42), easing: smooth },
  { f: 810, pose: abs([5.8, 4.2, 10.8], [0.8, 0.1, 5.8], 42), easing: smooth },
  // Driver: chase cam.
  { f: 870, pose: chase(7, 3.8, 7), easing: smooth },
  { f: 960, pose: chase(7, 3.8, 7), easing: smooth },
  // School: crane up to a high overview.
  { f: 1060, pose: abs([0, 30, 22], [0, 0, -1], 44), easing: smooth },
  { f: 1140, pose: abs([0, 30, 22], [0, 0, -1], 44), easing: smooth },
  // Outro: top-down, the "M" road reads like the logo.
  { f: 1230, pose: abs([0, 44, 0.5], [0, 0, 0], 42), easing: smooth },
  { f: SPOT_FRAMES, pose: abs([0, 40, 0.5], [0, 0, 0], 42) },
];

export const cameraPose = (frame: number, bus: BusState): Pose => {
  const f = Math.max(0, Math.min(frame, SPOT_FRAMES));
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].f <= f) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const raw = (f - a.f) / Math.max(1, b.f - a.f);
  const u = (a.easing ?? smooth)(Math.max(0, Math.min(1, raw)));
  const pa = a.pose(bus, f);
  const pb = b.pose(bus, f);
  return {
    pos: pa.pos.lerp(pb.pos, u),
    look: pa.look.lerp(pb.look, u),
    fov: pa.fov + (pb.fov - pa.fov) * u,
  };
};

// Project a world point to 2D pixel coordinates for the given camera pose,
// so DOM overlays can be pinned to 3D objects.
const projCam = new THREE.PerspectiveCamera();
export const projectToScreen = (
  point: THREE.Vector3,
  pose: Pose,
  width: number,
  height: number,
): { x: number; y: number; visible: boolean } => {
  projCam.fov = pose.fov;
  projCam.aspect = width / height;
  projCam.near = 0.1;
  projCam.far = 200;
  projCam.position.copy(pose.pos);
  projCam.lookAt(pose.look);
  projCam.updateMatrixWorld(true);
  projCam.updateProjectionMatrix();
  const p = point.clone().project(projCam);
  return { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height, visible: p.z < 1 };
};

// ---------------------------------------------------------------- Deterministic RNG
export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
