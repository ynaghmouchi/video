import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { RevealScene, StoryPhoneScene, OutroStory } from "./story-scenes";
import { EnfantPluieScene, ParentPaniqueScene, EcoleDebordeeScene, BasculeScene, ApaisementScene } from "./characters/EmotionalScenes";
import { VoiceOver } from "./characters/VoiceOver";
import { TrackingScreen } from "./screens/TrackingScreen";
import { EleveScreen, ChauffeurScreen, AdminScreen } from "./story-screens";
import { COLORS } from "./theme";

// Scene durations (frames @ 30fps). Tuned so each subtitle/voice line lands.
const D = {
  enfant: 165,
  parent: 195,
  ecole: 185,
  bascule: 110,
  reveal: 150,
  apaisement: 200,
  parents: 175,
  eleve: 175,
  chauffeur: 180,
  admin: 185,
  outro: 165,
};
const T = 22;
const N = 10; // number of transitions
export const STORY_FRAMES = Object.values(D).reduce((a, b) => a + b, 0) - N * T;
const timing = linearTiming({ durationInFrames: T });

export const MEyeBusStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      <TransitionSeries>
        {/* 1 — Problem: child waiting in the rain */}
        <TransitionSeries.Sequence durationInFrames={D.enfant}>
          <VoiceOver name="01-enfant" />
          <EnfantPluieScene subtitle="7h42. Le bus aurait dû être là." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        {/* 2 — Anxious parent + traffic-jam map */}
        <TransitionSeries.Sequence durationInFrames={D.parent}>
          <VoiceOver name="02-parent" />
          <ParentPaniqueScene subtitle="Un embouteillage. Un simple retard. Mais personne n'est prévenu." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        {/* 3 — Overwhelmed school office */}
        <TransitionSeries.Sequence durationInFrames={D.ecole}>
          <VoiceOver name="03-ecole" />
          <EcoleDebordeeScene subtitle="À l'école, c'est la même question, dix fois par minute." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        {/* 4 — The turning point */}
        <TransitionSeries.Sequence durationInFrames={D.bascule}>
          <VoiceOver name="04-bascule" />
          <BasculeScene subtitle="Et si tout le monde voyait la même chose, en même temps ?" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-bottom" })} />

        {/* 5 — Reveal (3D phone + logo) */}
        <TransitionSeries.Sequence durationInFrames={D.reveal}>
          <VoiceOver name="05-reveal" />
          <RevealScene subtitle="M'EyeBus. Le trajet en temps réel, pour tout le monde." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        {/* 6 — Relief: the three personas, reassured */}
        <TransitionSeries.Sequence durationInFrames={D.apaisement}>
          <VoiceOver name="06-apaisement" />
          <ApaisementScene subtitle="Chacun sait. Chacun est rassuré." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        {/* 7-10 — Personas with real app screens */}
        <TransitionSeries.Sequence durationInFrames={D.parents}>
          <VoiceOver name="07-parents" />
          <StoryPhoneScene persona="Pour les parents" icon="user" tint={COLORS.blue} subtitle="Le bus en direct, et une alerte à chaque étape." screen={<TrackingScreen />} screenBg={COLORS.mapBg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.eleve}>
          <VoiceOver name="08-eleves" />
          <StoryPhoneScene persona="Pour les élèves" icon="shield" tint={COLORS.green} subtitle="Un trajet plus sûr. Chaque montée et descente, confirmée." screen={<EleveScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.chauffeur}>
          <VoiceOver name="09-chauffeurs" />
          <StoryPhoneScene persona="Pour les chauffeurs" icon="bus" tint={COLORS.orange} subtitle="Itinéraire, arrêts et élèves. La route, sans distraction." screen={<ChauffeurScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.admin}>
          <VoiceOver name="10-ecole" />
          <StoryPhoneScene persona="Pour l’école" icon="home" tint={COLORS.navy} subtitle="Toute la flotte, centralisée et supervisée en direct." screen={<AdminScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        {/* 11 — Outro / CTA */}
        <TransitionSeries.Sequence durationInFrames={D.outro}>
          <VoiceOver name="11-outro" />
          <OutroStory subtitle="M'EyeBus. La sérénité, à chaque trajet." />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
