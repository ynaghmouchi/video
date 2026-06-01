# Scénario — Spot publicitaire M'EyeBus

**Format :** vertical 1080×1920, ~60 s · **Voix :** ElevenLabs « Eric » (FR)
**Arc :** on vit le problème → la tension monte → M'EyeBus apaise tout.

Légende : 🎙️ voix-off · 💬 texte à l'écran · 🎬 animation

| # | Scène | ⏱️ approx. | 🎙️ Voix-off / sous-titre | 🎬 Visuel |
|---|-------|-----------|--------------------------|-----------|
| 1 | Enfant sous la pluie | ~5,5 s | **« 7h42. Le bus aurait dû être là. »** | Enfant seul à l'abri de bus, pluie, flaque, ciel gris. Il frissonne et cherche le bus du regard. |
| 2 | Parent en panique | ~6,5 s | **« Un embouteillage. Un simple retard. Mais personne n'est prévenu. »** | Parent chez lui, téléphone vide d'infos, bulles anxieuses. Incrustation : plan de ville avec le bus bloqué dans un bouchon — *qu'il ne voit pas.* |
| 3 | École débordée | ~6 s | **« À l'école, c'est la même question, dix fois par minute. »** | Secrétaire au téléphone, compteur « X appels en attente », sonneries, post-its qui s'empilent. |
| 4 | Bascule | ~3,5 s | **« Et si tout le monde voyait la même chose, en même temps ? »** | Écran sombre, halo lumineux qui pulse. Respiration dramatique. |
| 5 | Révélation | ~5 s | **« M'EyeBus. Le trajet en temps réel, pour tout le monde. »** | Flash → téléphone 3D + logo, les couleurs passent du gris au lumineux. |
| 6 | Apaisement | ~6,5 s | **« Chacun sait. Chacun est rassuré. »** | 3 panneaux : enfant souriant (bus en approche), parent détendu (« Bus à 3 min »), école sereine. |
| 7 | Parents | ~5,5 s | « Le bus en direct, et une alerte à chaque étape. » | Écran de suivi temps réel de l'app (TrackingScreen). |
| 8 | Élèves | ~5,5 s | « Un trajet plus sûr. Chaque montée et descente, confirmée. » | Écran élève. |
| 9 | Chauffeurs | ~6 s | « Itinéraire, arrêts et élèves. La route, sans distraction. » | Écran chauffeur. |
| 10 | École | ~6 s | « Toute la flotte, centralisée et supervisée en direct. » | Écran admin / supervision. |
| 11 | Outro / CTA | ~5,5 s | **« M'EyeBus. La sérénité, à chaque trajet. »** · 💬 *Disponible sur iOS & Android* | Logo + bouton CTA. |

## Production

- **Rendu :** `npx remotion render MEyeBusStory out/meyebus-story.mp4`
- **Voix-off :** `ELEVENLABS_API_KEY=… node scripts/generate-voiceover.mjs` puis passer `VOICEOVER_ENABLED = true` dans `src/meyebus/characters/VoiceOver.tsx`.
- **Personnages :** 100 % vectoriels (SVG), nets à toute résolution — voir `src/meyebus/characters/`.
