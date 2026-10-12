import "./index.css";
import { Composition } from "remotion";
import { MEyeBusDemo, TOTAL_FRAMES } from "./meyebus/Demo";
import { MEyeBusStory, STORY_FRAMES } from "./meyebus/Story";
import { TestShort, TEST_SHORT_FPS, TEST_SHORT_FRAMES } from "./test/TestShort";
import { BeerFlood, BEERFLOOD_FPS, BEERFLOOD_FRAMES } from "./beerflood/BeerFlood";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // Storytelling version with voice-over subtitles + 3D reveal.
        // Render with: npx remotion render MEyeBusStory --gl=swangle
        id="MEyeBusStory"
        component={MEyeBusStory}
        durationInFrames={STORY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        // "Mr Coyote"-style explainer short: London beer flood, 1814.
        // Render with: npx remotion render BeerFlood out/beerflood.mp4
        id="BeerFlood"
        component={BeerFlood}
        durationInFrames={BEERFLOOD_FRAMES}
        fps={BEERFLOOD_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        // 5 s vertical smoke test for the installed video skills.
        // Render with: npx remotion render TestShort5s out/test-short-5s.mp4
        id="TestShort5s"
        component={TestShort}
        durationInFrames={TEST_SHORT_FRAMES}
        fps={TEST_SHORT_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        // Original product demo.
        id="MEyeBusDemo"
        component={MEyeBusDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
