import "./index.css";
import { Composition } from "remotion";
import { MEyeBusDemo, TOTAL_FRAMES } from "./meyebus/Demo";
import { MEyeBusStory, STORY_FRAMES } from "./meyebus/Story";
import { MEyeBusSpot3D, SPOT_FRAMES } from "./meyebus3d/Spot3D";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // Full 3D motion-design spot (low-poly world, animated camera).
        // Render with: npx remotion render MEyeBusSpot3D --gl=swangle
        id="MEyeBusSpot3D"
        component={MEyeBusSpot3D}
        durationInFrames={SPOT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
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
