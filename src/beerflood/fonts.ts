import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled woff2 files (from @fontsource) so rendering needs no network.
// loadFont() delays the render until the font is ready. Exported so the import
// survives webpack's sideEffects pruning (see package.json "sideEffects").
export const FONTS_READY = Promise.all([
  loadFont({ family: "Luckiest Guy", url: staticFile("fonts/luckiest-guy-latin-400-normal.woff2"), weight: "400" }),
  loadFont({ family: "Luckiest Guy", url: staticFile("fonts/luckiest-guy-latin-ext-400-normal.woff2"), weight: "400" }),
  loadFont({ family: "Bangers", url: staticFile("fonts/bangers-latin-400-normal.woff2"), weight: "400" }),
  loadFont({ family: "Bangers", url: staticFile("fonts/bangers-latin-ext-400-normal.woff2"), weight: "400" }),
]);
