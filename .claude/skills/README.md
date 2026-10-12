# Skills installés (vidéo animée / storytelling 9:16)

Skills Claude Code copiés tels quels depuis leurs dépôts d'origine, pour produire des vidéos
Remotion verticales (1080×1920) de vulgarisation.

| Dossier | Source | Commit | Licence | Rôle |
|---|---|---|---|---|
| `remotion-*` (12 skills) | https://github.com/remotion-dev/skills | `32b241b` (2026-10-07) | voir dépôt Remotion | Bonnes pratiques officielles : création, markup, captions, rendu, studio, 3D/maps, upgrade. Point d'entrée : `remotion-best-practices`. |
| `remotion-motion-graphics` | https://github.com/haidrrrry/claude-remotion-skill | `1dcbe5e` (2026-08-12) | MIT | Règles de motion design (spring, stagger, grain, vignette, Ken Burns), workflow rendu → extraction de frames → vérification. |
| `make-short` | https://github.com/hassancs91/claude-faceless-shorts-creator | `773054b` (2026-08-18) | MIT | Grammaire narrative d'un short vulgarisé : HOOK → SETUP → QUIZ → REVEAL → TWIST → LOOP, règles de voix-off et sous-titres mot à mot. Les scripts Python (`gen_voice.py`, `mix_sfx.py`) et la voix ElevenLabs sont dans le dépôt d'origine, pas ici. |
| `vidtsx-2d-generator` | idem | `773054b` | MIT | Règles anti-crash pour les compositions TSX (frame-based uniquement, ranges monotones, `Easing.bezier`). |
| `suggest-sfx` | idem | `773054b` | MIT | Sound design : où placer whoosh/pop/thump et comment doser. |

Mise à jour des skills officiels : `npx skills add remotion-dev/skills` ou `/remotion-upgrade`.

Composition de test : `TestShort5s` (`src/test/TestShort.tsx`), 5 s, 1080×1920 @ 30 fps.
Rendu : `npx remotion render TestShort5s out/test-short-5s.mp4`.
