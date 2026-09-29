# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## M'EyeBus compositions

| ID | Description | Rendu |
| --- | --- | --- |
| `MEyeBusSpot3DPro` | Version réaliste du spot 3D : ombres portées, matériaux PBR et reflets, textures procédurales, dôme de ciel, lampadaires, voitures, étalonnage (9:16, 48 s) | `npx remotion render MEyeBusSpot3DPro out/spot-3d-pro.mp4 --gl=swangle` |
| `MEyeBusSpot3D` | Spot motion design 100 % 3D (ville low-poly, bus sur une route en « M », caméra animée, 9:16, 48 s) | `npx remotion render MEyeBusSpot3D out/spot-3d.mp4 --gl=swangle` |
| `MEyeBusStory` | Storytelling (problème → solution, 4 personas) avec sous-titres | `npx remotion render MEyeBusStory --gl=swangle` |
| `MEyeBusDemo` | Démo produit (écrans de l'app) | `npx remotion render MEyeBusDemo` |

Sur une machine avec GPU, remplacez `--gl=swangle` par `--gl=angle` pour un rendu plus rapide.
Le code du spot 3D est dans `src/meyebus3d/` (`timeline.ts` = scènes, route et caméra ; `Spot3D.tsx` = textes et cartes). La version réaliste vit dans `src/meyebus3d/pro/` et partage la même timeline.

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
