import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { EnfantPluieScene, ParentPaniqueScene, EcoleDebordeeScene, ApaisementScene } from "./EmotionalScenes";

// Preview reel of the four new emotional scenes (for validation / stills).
export const CharacterPreview: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={120}>
        <EnfantPluieScene subtitle="7h42. Le bus aurait dû être là." />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <ParentPaniqueScene subtitle="Un embouteillage. Un simple retard. Mais personne n'est prévenu." />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <EcoleDebordeeScene subtitle="À l'école, c'est la même question, dix fois par minute." />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <ApaisementScene subtitle="Chacun sait. Chacun est rassuré." />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
