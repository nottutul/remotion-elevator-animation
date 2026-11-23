import React from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { S1 } from "./scenes/S1";
import { LiftPhysics } from "./scenes/LiftPhysics";
import { CharTest } from "./scenes/CharTest";
import { MotionStrip } from "./scenes/MotionStrip";
import { MotionStripFull } from "./scenes/MotionStripFull";

// Block rendering until the custom Bangla font is fully loaded
const fontHandle = delayRender("Loading Bangla font");
loadFont({
  family: "ShohidShafkatSamir",
  url: staticFile("bangla-font/Li Shohid Shafkat Samir Unicode.ttf"),
})
  .then(() => {
    continueRender(fontHandle);
  })
  .catch((err) => {
    console.error("Failed to load custom Bangla font:", err);
    continueRender(fontHandle);
  });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full Continuous Physics Video: S1 through S7 (1080x1920, 81.34s @ 30fps = 2441 frames) */}
      <Composition
        id="LiftPhysics"
        component={LiftPhysics}
        durationInFrames={2441}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Approved Scene 1 Composition (1080x1920, 11.3s @ 30fps) */}
      <Composition
        id="LiftScene1"
        component={S1}
        durationInFrames={339}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Still-Only Composition: Character Poses Test (1920x1080, 1 frame) */}
      <Composition
        id="CharTest"
        component={CharTest}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Still-Only Composition: 12-Keyframe Motion Strip (1920x1440, 1 frame) */}
      <Composition
        id="MotionStrip"
        component={MotionStrip}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1440}
      />

      {/* Still-Only Composition: Full 24-Frame Motion Strip (2400x1800, 1 frame) */}
      <Composition
        id="MotionStripFull"
        component={MotionStripFull}
        durationInFrames={1}
        fps={30}
        width={2400}
        height={1800}
      />
    </>
  );
};
