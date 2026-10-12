import { Easing } from "remotion";

// Look of the "Mr Coyote" reference: flat dark-green canvas, yellow comic captions,
// red glowing labels, amber beer highlights.
export const T = {
  bg: "#1F4D2E",
  bgDeep: "#143320",
  ink: "#141414",
  caption: "#FFE23A",
  red: "#E0392F",
  redGlow: "rgba(224,57,47,0.75)",
  amber: "#F2A93B",
  amberDeep: "#C9781C",
  foam: "#FFF6DC",
  paper: "#F3E9D2",
  white: "#FFFFFF",
  green: "#3DD68C",
} as const;

export const FONT_DISPLAY = '"Luckiest Guy", "Bangers", Impact, sans-serif';
export const FONT_COMIC = '"Bangers", "Luckiest Guy", Impact, sans-serif';
export const FONT_UI = '"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif';

export const EASE = {
  out: Easing.bezier(0.33, 1, 0.68, 1),
  in: Easing.bezier(0.32, 0, 0.67, 0),
  inOut: Easing.bezier(0.37, 0, 0.63, 1),
} as const;

export const SPRING = {
  pop: { damping: 12, stiffness: 180, mass: 0.8 },
  slam: { damping: 16, stiffness: 260, mass: 1 },
  smooth: { damping: 20, stiffness: 120 },
} as const;
