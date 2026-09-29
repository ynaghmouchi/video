import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../../meyebus/theme";
import { ScenePro, sunDirection, dawnAmount } from "./ScenePro";
import { Headline, WorldCard, busPoint, Questions, LogoReveal, BrandFooter, Stats } from "../overlays";
import { OutroPro } from "./OutroPro";
import { SCENES, HOME_POS, STOP_POS, SCHOOL_POS, busState, cameraPose, projectToScreen } from "../timeline";

export { SPOT_FRAMES } from "../timeline";

const S = SCENES;
const stopPoint = () => new THREE.Vector3(STOP_POS.x + 0.8, 1.2, STOP_POS.z + 2.1);
const schoolPoint = () => new THREE.Vector3(SCHOOL_POS.x, 4, SCHOOL_POS.z);

// Photographic finish: sun flare, warm grade, vignette and fine grain.
const PostFX: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dawn = dawnAmount(frame);
  const bus = busState(frame);
  const pose = cameraPose(frame, bus);
  const sun = projectToScreen(pose.pos.clone().add(sunDirection(dawn).multiplyScalar(500)), pose, width, height);
  const inFrame = sun.visible && sun.x > -300 && sun.x < width + 300 && sun.y > -300 && sun.y < height + 300;
  const flare = inFrame ? 0.35 + dawn * 0.45 : 0;
  const dim = interpolate(frame, [S.outro.from + 100, S.outro.from + 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {flare > 0 ? (
        <>
          <div style={{ position: "absolute", left: sun.x - 700, top: sun.y - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,236,200,${0.55 * flare}) 0%, rgba(255,190,120,${0.22 * flare}) 22%, rgba(255,170,100,0) 60%)`, mixBlendMode: "screen" }} />
          {[0.3, 0.55, 0.8].map((k, i) => (
            <div key={i} style={{ position: "absolute", left: sun.x + (width / 2 - sun.x) * (1 + k) - 60 - i * 20, top: sun.y + (height / 2 - sun.y) * (1 + k) - 60 - i * 20, width: 120 + i * 40, height: 120 + i * 40, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,200,150,${0.16 * flare}) 0%, rgba(255,200,150,0) 70%)`, mixBlendMode: "screen" }} />
          ))}
        </>
      ) : null}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(255,170,90,${0.12 * dawn}) 0%, rgba(0,0,0,0) 45%, rgba(20,40,80,0.10) 100%)`, mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "radial-gradient(75% 65% at 50% 45%, rgba(0,0,0,0) 55%, rgba(5,10,20,0.45) 100%)", opacity: dim }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.075, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 200} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const MEyeBusSpot3DPro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      <ScenePro />
      <PostFX />

      <Sequence from={S.dawn.from} durationInFrames={S.dawn.dur} name="Dawn">
        <Headline kicker="07:15" title="Chaque matin, des milliers d’enfants prennent le bus." dur={S.dawn.dur} />
      </Sequence>

      <Sequence from={S.question.from} durationInFrames={S.question.dur} name="Question">
        <Headline kicker="Et chaque matin…" title="Où est le bus ? Est-il passé ? Est-il en retard ?" dur={S.question.dur} tint={COLORS.red} />
        <Questions point={new THREE.Vector3(HOME_POS.x, 3.2, HOME_POS.z)} sceneFrom={S.question.from} dur={S.question.dur} />
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
        <Sequence durationInFrames={100}>
          <Headline title="Un trajet. Une seule vérité, pour tous." dur={100} />
        </Sequence>
        <OutroPro />
      </Sequence>
    </AbsoluteFill>
  );
};
