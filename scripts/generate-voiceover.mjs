// Generate the M'EyeBus voice-over with ElevenLabs.
//
// Run LOCALLY (where the network is open):
//   ELEVENLABS_API_KEY=sk_xxx node scripts/generate-voiceover.mjs
//
// It writes one MP3 per line into public/audio/. The key is read from the
// environment — never hard-code it in this file or commit it.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY env var.");
  process.exit(1);
}

// "Eric - Dynamic and Energetic" (ElevenLabs default voice).
// If the id ever changes, list voices via GET /v1/voices and pick Eric's id.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "cjVigY5qzO86Huf0OWal";
const MODEL_ID = "eleven_multilingual_v2"; // best for French

// Keys must match the audio file names referenced in the Remotion scenes.
const LINES = {
  "01-enfant": "7h42. Le bus aurait dû être là.",
  "02-parent": "Un embouteillage. Un simple retard. Mais personne n'est prévenu.",
  "03-ecole": "À l'école, c'est la même question, dix fois par minute.",
  "04-bascule": "Et si tout le monde voyait la même chose, en même temps ?",
  "05-reveal": "M'EyeBus. Le trajet en temps réel, pour tout le monde.",
  "06-apaisement": "Chacun sait. Chacun est rassuré.",
  "07-parents": "Le bus en direct, et une alerte à chaque étape.",
  "08-eleves": "Un trajet plus sûr. Chaque montée et descente, confirmée.",
  "09-chauffeurs": "Itinéraire, arrêts et élèves. La route, sans distraction.",
  "10-ecole": "Toute la flotte, centralisée et supervisée en direct.",
  "11-outro": "M'EyeBus. La sérénité, à chaque trajet.",
};

const outDir = path.join(process.cwd(), "public", "audio");
await mkdir(outDir, { recursive: true });

for (const [name, text] of Object.entries(LINES)) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
      }),
    },
  );
  if (!res.ok) {
    console.error(`✗ ${name}: HTTP ${res.status} ${await res.text()}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(outDir, `${name}.mp3`);
  await writeFile(file, buf);
  console.log(`✓ ${name}.mp3 (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone. MP3s are in public/audio/. Commit them (they are part of the video).");
