import * as THREE from "three";
import { mulberry32 } from "../timeline";

// Procedural textures drawn on a 2D canvas: deterministic (seeded), no assets
// to load, and cheap enough to build once per render worker.

type Draw = (ctx: CanvasRenderingContext2D, size: number, rng: () => number) => void;

export const makeTexture = (size: number, seed: number, draw: Draw, srgb = true): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  draw(ctx, size, mulberry32(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
};

const speckle = (ctx: CanvasRenderingContext2D, size: number, rng: () => number, n: number, colors: string[], maxR = 1.6) => {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
    ctx.globalAlpha = 0.25 + rng() * 0.5;
    const r = 0.5 + rng() * maxR;
    ctx.fillRect(rng() * size, rng() * size, r, r);
  }
  ctx.globalAlpha = 1;
};

export const asphaltTexture = () =>
  makeTexture(512, 11, (ctx, s, rng) => {
    ctx.fillStyle = "#3A3D42";
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, rng, 26000, ["#2A2D31", "#4A4D53", "#55585E", "#222428"], 2.2);
    // a few hairline cracks
    ctx.strokeStyle = "rgba(20,22,25,0.5)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      let x = rng() * s;
      let y = rng() * s;
      ctx.moveTo(x, y);
      for (let k = 0; k < 8; k++) {
        x += (rng() - 0.5) * 60;
        y += (rng() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });

export const grassTexture = () =>
  makeTexture(512, 12, (ctx, s, rng) => {
    ctx.fillStyle = "#85966A";
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, rng, 30000, ["#76895C", "#96A778", "#6A7C52", "#A2B184"], 2.4);
    ctx.strokeStyle = "rgba(60,90,40,0.35)";
    for (let i = 0; i < 4000; i++) {
      const x = rng() * s;
      const y = rng() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rng() - 0.5) * 3, y - 3 - rng() * 4);
      ctx.stroke();
    }
  });

export const concreteTexture = () =>
  makeTexture(512, 13, (ctx, s, rng) => {
    ctx.fillStyle = "#CBC9C2";
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, rng, 18000, ["#BDBBB4", "#D8D6CF", "#B2B0A9"], 2);
    ctx.strokeStyle = "rgba(90,88,84,0.45)";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 2; i++) {
      const p = (i * s) / 2;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, s);
      ctx.moveTo(0, p);
      ctx.lineTo(s, p);
      ctx.stroke();
    }
  });

export const plasterTexture = (base = "#EEE8DC") =>
  makeTexture(256, 14, (ctx, s, rng) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, rng, 6000, ["#E2DCD0", "#F6F1E8", "#D9D2C5"], 1.8);
  });

export const roofTilesTexture = (base = "#B5552F") =>
  makeTexture(256, 15, (ctx, s, rng) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    const cols = 6;
    const h = s / rows;
    const w = s / cols;
    for (let r = 0; r < rows; r++) {
      for (let c = -1; c <= cols; c++) {
        const x = c * w + (r % 2 ? w / 2 : 0);
        const y = r * h;
        ctx.fillStyle = `rgba(0,0,0,${0.08 + rng() * 0.14})`;
        ctx.fillRect(x, y + h - 4, w, 4);
        ctx.fillStyle = `rgba(255,255,255,${0.04 + rng() * 0.08})`;
        ctx.fillRect(x + 1, y + 1, w - 2, 3);
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(x, y, 2, h);
      }
    }
  });

// Facade tile = 4 window bays x 3 floors. Returns colour map + emissive map
// (only lit windows glow, so the same texture works at dawn and by day).
export type Facade = { map: THREE.CanvasTexture; emissive: THREE.CanvasTexture; bays: number; floors: number };
export const facadeTexture = (seed: number, wall: string, glass: string, litRatio: number): Facade => {
  const bays = 4;
  const floors = 3;
  const size = 512;
  const lit: boolean[] = [];
  const rngLit = mulberry32(seed * 7 + 1);
  for (let i = 0; i < bays * floors; i++) lit.push(rngLit() < litRatio);
  const bw = size / bays;
  const fh = size / floors;
  const win = (ctx: CanvasRenderingContext2D, x: number, y: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.fillRect(x + bw * 0.22, y + fh * 0.2, bw * 0.56, fh * 0.55);
  };
  const map = makeTexture(size, seed, (ctx, s, rng) => {
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, rng, 5000, ["rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)"], 1.5);
    for (let f = 0; f < floors; f++) {
      for (let b = 0; b < bays; b++) {
        const x = b * bw;
        const y = f * fh;
        // frame
        ctx.fillStyle = "#2E3238";
        ctx.fillRect(x + bw * 0.19, y + fh * 0.17, bw * 0.62, fh * 0.61);
        const g = ctx.createLinearGradient(x, y, x + bw, y + fh);
        g.addColorStop(0, glass);
        g.addColorStop(1, "#8FB2CC");
        win(ctx, x, y, lit[f * bays + b] ? "#F6DFA8" : (g as unknown as string));
        // sill + floor slab shadow
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(x, y + fh * 0.78, bw, 4);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(x + bw * 0.18, y + fh * 0.75, bw * 0.64, 3);
      }
    }
  });
  const emissive = makeTexture(size, seed, (ctx, s) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, s, s);
    for (let f = 0; f < floors; f++) for (let b = 0; b < bays; b++) if (lit[f * bays + b]) win(ctx, b * bw, f * fh, "#FFD08A");
  });
  return { map, emissive, bays, floors };
};

export const cloudTexture = () =>
  makeTexture(512, 16, (ctx, s, rng) => {
    ctx.clearRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      const x = s * 0.5 + (rng() - 0.5) * s * 0.7;
      const y = s * 0.55 + (rng() - 0.5) * s * 0.35;
      const r = 40 + rng() * 90;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });

// Clone a texture with its own repeat (shares the image data).
export const withRepeat = (t: THREE.Texture, rx: number, ry: number) => {
  const c = t.clone();
  c.repeat.set(rx, ry);
  c.needsUpdate = true;
  return c;
};
