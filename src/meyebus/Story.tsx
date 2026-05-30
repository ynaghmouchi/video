import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { ProblemScene, AnxietyScene, RevealScene, StoryPhoneScene, OutroStory } from "./story-scenes";
import { TrackingScreen } from "./screens/TrackingScreen";
import { EleveScreen, ChauffeurScreen, AdminScreen } from "./story-screens";
import { COLORS } from "./theme";

const D = {
  problem: 110,
  anxiety: 130,
  reveal: 120,
  parents: 150,
  eleve: 150,
  chauffeur: 150,
  admin: 165,
  outro: 130,
};
const T = 18;
const N = 7;
export const STORY_FRAMES = Object.values(D).reduce((a, b) => a + b, 0) - N * T;
const timing = linearTiming({ durationInFrames: T });

export const MEyeBusStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.problem}>
          <ProblemScene subtitle="Chaque matin, la même question… Est-ce que le bus est arrivé ?" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.anxiety}>
          <AnxietyScene subtitle="Parents inquiets. École débordée. Chauffeurs sans visibilité. Personne ne voit la même chose." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.reveal}>
          <RevealScene subtitle="Et si tout le monde voyait le même trajet, en temps réel ?" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-bottom" })} />

        <TransitionSeries.Sequence durationInFrames={D.parents}>
          <StoryPhoneScene persona="Pour les parents" icon="user" tint={COLORS.blue} subtitle="Le bus en direct, et une alerte à chaque étape." screen={<TrackingScreen />} screenBg={COLORS.mapBg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.eleve}>
          <StoryPhoneScene persona="Pour les élèves" icon="shield" tint={COLORS.green} subtitle="Un trajet plus sûr. Chaque montée et descente, confirmée." screen={<EleveScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.chauffeur}>
          <StoryPhoneScene persona="Pour les chauffeurs" icon="bus" tint={COLORS.orange} subtitle="Itinéraire, arrêts et élèves. La route, sans distraction." screen={<ChauffeurScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.admin}>
          <StoryPhoneScene persona="Pour l’école" icon="home" tint={COLORS.navy} subtitle="Toute la flotte, centralisée et supervisée en direct." screen={<AdminScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.outro}>
          <OutroStory subtitle="M’EyeBus. La sérénité, à chaque trajet." />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
