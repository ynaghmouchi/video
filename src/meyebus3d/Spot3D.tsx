import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "../meyebus/theme";
import { Scene3D } from "./Scene3D";
import { Sky, Headline, WorldCard, busPoint, Questions, LogoReveal, BrandFooter, Stats, Outro } from "./overlays";
import { SCENES, HOME_POS, STOP_POS, SCHOOL_POS } from "./timeline";

export { SPOT_FRAMES } from "./timeline";

const S = SCENES;
const stopPoint = () => new THREE.Vector3(STOP_POS.x + 0.8, 1.1, STOP_POS.z + 2);
const schoolPoint = () => new THREE.Vector3(SCHOOL_POS.x, 3.5, SCHOOL_POS.z);

// Full-3D motion-design spot: one continuous low-poly world, the bus drives an
// "M"-shaped road (like the badge) while the camera flies from scene to scene.
export const MEyeBusSpot3D: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      <Sky />
      <Scene3D />

      <Sequence from={S.dawn.from} durationInFrames={S.dawn.dur} name="Dawn">
        <Headline kicker="07:15" title="Chaque matin, des milliers d’enfants prennent le bus." dur={S.dawn.dur} />
      </Sequence>

      <Sequence from={S.question.from} durationInFrames={S.question.dur} name="Question">
        <Headline kicker="Et chaque matin…" title="Où est le bus ? Est-il passé ? Est-il en retard ?" dur={S.question.dur} tint={COLORS.red} />
        <Questions point={new THREE.Vector3(HOME_POS.x, 2.6, HOME_POS.z)} sceneFrom={S.question.from} dur={S.question.dur} />
      </Sequence>

      <Sequence from={S.reveal.from} durationInFrames={S.reveal.dur} name="Reveal">
        <Headline kicker="Voici" title="Le bus scolaire, enfin visible." dur={S.reveal.dur} />
        <LogoReveal dur={S.reveal.dur} />
      </Sequence>

      <Sequence from={S.parents.from} durationInFrames={S.parents.dur} name="Parents">
        <Headline kicker="Pour les parents" title="Le bus en direct. Une alerte à chaque étape." dur={S.parents.dur} tint={COLORS.blue} />
        <WorldCard point={busPoint} offset={[-40, -150]} sceneFrom={S.parents.from} delay={30} dur={S.parents.dur} icon="bell" tint={COLORS.orange} title="Bus à 3 min" sub="Arrêt Place des Écoles" anchor="center" />
        <WorldCard point={busPoint} offset={[40, -330]} sceneFrom={S.parents.from} delay={95} dur={S.parents.dur} icon="pin" tint={COLORS.blue} title="Position en temps réel" sub="Mis à jour il y a 2 s" anchor="center" />
        <BrandFooter />
      </Sequence>

      <Sequence from={S.students.from} durationInFrames={S.students.dur} name="Students">
        <Headline kicker="Pour les élèves" title="Chaque montée, chaque descente : confirmée." dur={S.students.dur} tint={COLORS.green} />
        <WorldCard point={stopPoint} offset={[60, -170]} sceneFrom={S.students.from} delay={62} dur={S.students.dur} life={66} icon="check" tint={COLORS.green} title="Yanis est monté" sub="07:42 · Arrêt Place des Écoles" anchor="center" />
        <WorldCard point={stopPoint} offset={[110, -300]} sceneFrom={S.students.from} delay={96} dur={S.students.dur} life={66} icon="check" tint={COLORS.green} title="Léa est montée" sub="07:42" anchor="center" />
        <WorldCard point={stopPoint} offset={[60, -170]} sceneFrom={S.students.from} delay={132} dur={S.students.dur} icon="check" tint={COLORS.green} title="Adam est monté" sub="07:43" anchor="center" />
        <BrandFooter />
      </Sequence>

      <Sequence from={S.driver.from} durationInFrames={S.driver.dur} name="Driver">
        <Headline kicker="Pour les chauffeurs" title="L’itinéraire, les arrêts, les élèves. Sans distraction." dur={S.driver.dur} tint={COLORS.orange} />
        <WorldCard point={busPoint} offset={[0, -190]} sceneFrom={S.driver.from} delay={40} dur={S.driver.dur} icon="navigation" tint={COLORS.blue} title="Prochain arrêt · 4 min" sub="Lycée Ibn Khaldoun · 12 élèves" anchor="center" />
        <BrandFooter />
      </Sequence>

      <Sequence from={S.school.from} durationInFrames={S.school.dur} name="School">
        <Headline kicker="Pour l’école" title="Toute la flotte, supervisée en temps réel." dur={S.school.dur} tint={COLORS.navy} />
        <WorldCard point={schoolPoint} offset={[0, -120]} sceneFrom={S.school.from} delay={70} dur={S.school.dur} icon="home" tint={COLORS.navy} title="École Al Amal" sub="Tableau de bord · en direct" anchor="center" />
        <Stats dur={S.school.dur} />
        <BrandFooter />
      </Sequence>

      <Sequence from={S.outro.from} durationInFrames={S.outro.dur} name="Outro">
        <Sequence durationInFrames={110}>
          <Headline title="Un trajet. Une seule vérité, pour tous." dur={110} />
        </Sequence>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
