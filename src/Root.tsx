import "./index.css";
import { Composition } from "remotion";
import { MEyeBusDemo, TOTAL_FRAMES } from "./meyebus/Demo";
import { MEyeBusStory, STORY_FRAMES } from "./meyebus/Story";
import { CharacterPreview } from "./meyebus/characters/Preview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CharacterPreview"
        component={CharacterPreview}
        durationInFrames={480}
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
