import React from "react";
import { AbsoluteFill, Audio, Sequence, getStaticFiles, staticFile } from "remotion";
import { Illustration } from "./art";
import { FONTS_READY } from "./fonts";
import { Captions } from "./Captions";
import { BigNumber, Bubble, Bubbles, Camera, Finish, Label, Stamp, Tag } from "./layers";
import { FPS, SCENES, TOTAL_FRAMES } from "./script";

export { TOTAL_FRAMES as BEERFLOOD_FRAMES, FPS as BEERFLOOD_FPS };

const f = (s: number) => Math.round(s * FPS);
const sceneFrames = (id: string) => {
  const s = SCENES.find((x) => x.id === id)!;
  return { from: f(s.from), durationInFrames: f(s.to) - f(s.from) };
};

const Scene: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { from, durationInFrames } = sceneFrames(id);
  return (
    <Sequence from={from} durationInFrames={durationInFrames} premountFor={FPS} name={id}>
      {children}
    </Sequence>
  );
};

export const BeerFlood: React.FC = () => {
  void FONTS_READY;
  const voice = getStaticFiles().find((x) => x.name === "beerflood/voice.mp3");
  return (
    <AbsoluteFill style={{ background: "#1F4D2E" }}>
      {/* 1 — HOOK: wide shot of the wave, slow push-in */}
      <Scene id="hook">
        <Camera from={1} to={1.1} origin="50% 60%">
          <Illustration name="wave" />
        </Camera>
        <Bubbles opacity={0.25} />
        <Tag text="LONDRES · 1814" x={330} y={160} delay={8} />
        <Finish />
      </Scene>

      {/* 2 — the vat bursts: tight crop on the roof */}
      <Scene id="vat">
        <Camera from={1.7} to={1.55} origin="50% 16%" panY={10}>
          <Illustration name="wave" />
        </Camera>
        <Label text="LA CUVE ÉCLATE" x={260} y={300} delay={10} rotate={-5} size={56} />
        <Finish />
      </Scene>

      {/* 3 — the number */}
      <Scene id="litres">
        <Camera from={1.12} to={1.22} origin="50% 65%">
          <Illustration name="wave" />
        </Camera>
        <Bubbles opacity={0.4} />
        <BigNumber target={1470000} suffix="L" sub="de bière, d'un coup" y={360} delay={6} />
        <Finish />
      </Scene>

      {/* 4 — walls & cellars: low angle on the street, zoom-out */}
      <Scene id="walls">
        <Camera from={1.45} to={1.25} origin="30% 78%" panX={-20}>
          <Illustration name="wave" />
        </Camera>
        <Label text="MURS DÉFONCÉS" x={120} y={330} delay={6} rotate={-6} />
        <Label text="CAVES INONDÉES" x={420} y={520} delay={22} rotate={4} />
        <Finish />
      </Scene>

      {/* 5 — the toll: darker grade, red stamp */}
      <Scene id="dead">
        <Camera from={1.2} to={1.3} origin="50% 55%">
          <Illustration name="wave" />
        </Camera>
        <Stamp text="8 MORTS" y={520} delay={10} size={150} />
        <Finish dark={0.35} />
      </Scene>

      {/* 6 — narrator: "une fête ?" crossed out */}
      <Scene id="party">
        <Camera from={1.05} to={1.12} origin="50% 40%">
          <Illustration name="fox" />
        </Camera>
        <Bubble text="UNE FÊTE GÉANTE ?" x={120} y={230} delay={6} strike={34} />
        <Finish />
      </Scene>

      {/* 7 — payoff: industrial accident stamp, hold */}
      <Scene id="accident">
        <Camera from={1.12} to={1.04} origin="50% 40%">
          <Illustration name="fox" />
        </Camera>
        <Stamp text="ACCIDENT" y={210} delay={12} size={130} />
        <Stamp text="INDUSTRIEL" y={400} delay={18} size={130} />
        <Finish />
      </Scene>

      <Captions />
      {voice ? <Audio src={staticFile(voice.name)} /> : null}
    </AbsoluteFill>
  );
};
