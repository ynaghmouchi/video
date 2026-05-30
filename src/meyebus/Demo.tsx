import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IntroScene, HookScene, PhoneScene, OutroScene } from "./scenes";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { TrackingScreen } from "./screens/TrackingScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { COLORS } from "./theme";

const D = {
  intro: 110,
  hook: 95,
  login: 115,
  home: 120,
  tracking: 165,
  arrived: 120,
  notifs: 120,
  outro: 130,
};
const T = 18; // transition length
const N_TRANSITIONS = 7;

export const TOTAL_FRAMES =
  Object.values(D).reduce((a, b) => a + b, 0) - N_TRANSITIONS * T;

const timing = linearTiming({ durationInFrames: T });

export const MEyeBusDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.hook}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-bottom" })} />

        <TransitionSeries.Sequence durationInFrames={D.login}>
          <PhoneScene kicker="Connexion" title="Connectez-vous en toute sécurité" screen={<LoginScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.home}>
          <PhoneScene kicker="Accueil" title="Tous vos enfants, un seul espace" screen={<HomeScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.tracking}>
          <PhoneScene kicker="Suivi GPS" title="Suivez le bus en temps réel" screen={<TrackingScreen />} screenBg={COLORS.mapBg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.arrived}>
          <PhoneScene kicker="Alerte" title="Prévenu à la seconde près" screen={<TrackingScreen arrived />} screenBg={COLORS.mapBg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={D.notifs}>
          <PhoneScene kicker="Notifications" title="Chaque trajet, notifié" screen={<NotificationsScreen />} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={timing} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={D.outro}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
