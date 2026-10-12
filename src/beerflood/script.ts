// Narration + beat sheet for "L'inondation de bière de Londres (1814)".
// Times are seconds on the global timeline. Word timings come from vo.gen.ts
// (estimated by default, exact once scripts/tts-edge.py has run).

export const FPS = 30;

export type Line = { id: string; text: string; start: number; end: number };

// ~2.7 words / second, with slack before the next line (make-short rule).
export const LINES: Line[] = [
  { id: "hook", text: "Londres, 1814. Une vague de bière déferle en pleine ville.", start: 0.2, end: 3.6 },
  { id: "vat", text: "Une cuve géante de brasserie vient d'éclater.", start: 3.9, end: 6.4 },
  { id: "litres", text: "Plus d'un million de litres se déversent d'un seul coup.", start: 6.7, end: 10.0 },
  { id: "walls", text: "La vague défonce des murs et inonde des caves.", start: 10.3, end: 13.3 },
  { id: "dead", text: "Huit personnes y perdent la vie.", start: 13.6, end: 15.8 },
  { id: "party", text: "Non, ce n'était pas une fête géante.", start: 16.2, end: 18.6 },
  { id: "accident", text: "C'était un véritable accident industriel.", start: 19.0, end: 21.6 },
];

export const TOTAL_SECONDS = 23.5;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

// Scene boundaries (seconds). Each scene = one illustration + its overlays.
export const SCENES = [
  { id: "hook", from: 0, to: 3.8, art: "wave" as const },
  { id: "vat", from: 3.8, to: 6.6, art: "wave" as const },
  { id: "litres", from: 6.6, to: 10.2, art: "wave" as const },
  { id: "walls", from: 10.2, to: 13.5, art: "wave" as const },
  { id: "dead", from: 13.5, to: 16.0, art: "wave" as const },
  { id: "party", from: 16.0, to: 18.8, art: "fox" as const },
  { id: "accident", from: 18.8, to: TOTAL_SECONDS, art: "fox" as const },
];
