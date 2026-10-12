# BeerFlood — short vertical "fait étonnant" (style Mr Coyote)

Sujet : l'inondation de bière de Londres, 17 octobre 1814 (brasserie Horse Shoe, Tottenham Court Road,
~1,47 million de litres, 8 morts).

- `script.ts` — narration (7 lignes), fenêtres de temps, découpage en 7 scènes.
- `vo.gen.ts` — timings mot à mot. **Estimés** par défaut ; exacts après `scripts/tts-edge.py`.
- `BeerFlood.tsx` — scènes : caméra (Ken Burns + whip), illustration, étiquettes, tampons, compteur, bulle.
- `layers.tsx` — Camera, Label (rouge halo), Tag (pastille papier), Stamp (tampon qui claque), BigNumber, Bubble, Bubbles, Finish.
- `Captions.tsx` — un mot à la fois, police Luckiest Guy jaune à contour noir.
- `art.tsx` — illustrations. Si `public/beerflood/wave.(jpg|png|webp)` et `public/beerflood/fox.(jpg|png|webp)`
  existent, elles sont utilisées ; sinon, scènes dessinées en SVG (placeholder).

## Mettre les vraies illustrations

Deux images Seedream 4.5 (9:16) ont été générées sur le compte OpenArt (projet `Jirnvyw6Vk3mAOyVTYQZ`) :
la vague dans la rue (`wave`) et le renard narrateur (`fox`). Les télécharger et les déposer :

```
public/beerflood/wave.jpg
public/beerflood/fox.jpg
```

## Générer la voix française (machine avec internet)

```
pip install edge-tts
python3 scripts/tts-edge.py        # EDGE_VOICE=fr-FR-DeniseNeural pour une voix féminine
```

Écrit `public/beerflood/voice.mp3` et régénère `vo.gen.ts` avec les vrais timings. La composition
ajoute l'audio automatiquement si le fichier existe.

## Rendu

```
npx remotion render BeerFlood out/beerflood.mp4
```
