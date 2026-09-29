import * as THREE from "three";
import { asphaltTexture, grassTexture, concreteTexture, plasterTexture, roofTilesTexture, facadeTexture, cloudTexture, type Facade } from "./textures";

// Built once per render worker (module-level cache), shared by all meshes.
type Assets = {
  asphalt: THREE.Texture;
  grass: THREE.Texture;
  concrete: THREE.Texture;
  plaster: THREE.Texture;
  plasterWarm: THREE.Texture;
  roofRed: THREE.Texture;
  roofGrey: THREE.Texture;
  roofNavy: THREE.Texture;
  facades: Facade[];
  school: Facade;
  cloud: THREE.Texture;
};

let cache: Assets | null = null;
export const getAssets = (): Assets => {
  if (cache) return cache;
  const asphalt = asphaltTexture();
  const grass = grassTexture();
  grass.repeat.set(140, 140);
  const concrete = concreteTexture();
  const plaster = plasterTexture("#EEE8DC");
  const plasterWarm = plasterTexture("#E9DCC8");
  const roofRed = roofTilesTexture("#B5552F");
  const roofGrey = roofTilesTexture("#5B6068");
  const roofNavy = roofTilesTexture("#2C3E5C");
  const facades = [
    facadeTexture(101, "#D9D4CC", "#6F93B4", 0.35),
    facadeTexture(102, "#B9C3CF", "#5C7F9E", 0.3),
    facadeTexture(103, "#E7E1D6", "#7A9BB8", 0.4),
    facadeTexture(104, "#9AA5B3", "#4E6E8C", 0.25),
    facadeTexture(105, "#C7B8A5", "#6F93B4", 0.35),
  ];
  const school = facadeTexture(200, "#F1EEE7", "#7FA6C6", 0.55);
  const cloud = cloudTexture();
  cache = { asphalt, grass, concrete, plaster, plasterWarm, roofRed, roofGrey, roofNavy, facades, school, cloud };
  return cache;
};

// Box geometry whose side faces have UVs scaled so a facade tile (4 bays x 3
// floors) keeps a constant real-world size whatever the building size.
export const facadeBox = (w: number, h: number, d: number, tileW = 3.6, tileH = 2.4): THREE.BoxGeometry => {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.getAttribute("uv") as THREE.BufferAttribute;
  // face order: +x, -x, +y, -y, +z, -z ; 4 vertices each
  const faceW = [d, d, w, w, w, w];
  for (let f = 0; f < 6; f++) {
    if (f === 2 || f === 3) continue;
    const sx = faceW[f] / tileW;
    const sy = h / tileH;
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
    }
  }
  uv.needsUpdate = true;
  return g;
};

export const roundedRectShape = (w: number, h: number, r: number): THREE.Shape => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

// Rounded box extruded along +x (length), cross-section w (z) x h (y).
export const roundedBody = (length: number, w: number, h: number, r: number): THREE.ExtrudeGeometry => {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), { depth: length, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 6 });
  g.translate(0, 0, -length / 2);
  g.rotateY(Math.PI / 2);
  g.computeVertexNormals();
  return g;
};
