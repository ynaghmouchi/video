import React from "react";
import { Audio, staticFile } from "remotion";

// Flip to true AFTER you have generated the MP3s into public/audio/
// (run: ELEVENLABS_API_KEY=... node scripts/generate-voiceover.mjs).
// While false, the video plays with animated subtitles only.
export const VOICEOVER_ENABLED = false;

// Plays one voice-over clip, aligned to the start of the surrounding sequence.
export const VoiceOver: React.FC<{ name: string; volume?: number }> = ({ name, volume = 1 }) => {
  if (!VOICEOVER_ENABLED) return null;
  return <Audio src={staticFile(`audio/${name}.mp3`)} volume={volume} />;
};
