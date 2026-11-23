import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LiftWorld } from "../components/LiftWorld";
import { SpeedStreaks } from "../components/SpeedStreaks";
import { ForceArrowLabels2D } from "../components/ForceArrowLabels2D";
import { Captions } from "../components/Captions";
import { SCRIPT_CUES } from "../data/script";
import { getLiftState } from "../lib/motion";
import { S1Overlay } from "./S1Overlay";
import { S2Overlay } from "./S2Overlay";
import { S3Overlay } from "./S3Overlay";
import { S4Overlay } from "./S4Overlay";
import { S5Overlay } from "./S5Overlay";
import { S6Overlay } from "./S6Overlay";
import { S7Overlay } from "./S7Overlay";

/**
 * LiftPhysics: Continuous 3D Shot Physics Video (S1 to S7).
 * Duration: 2441 frames (79.84s voiceover + 1.5s hold @ 30fps = 81.34s).
 * Resolution: 1080x1920 (9:16 vertical shorts format).
 */
export const LiftPhysics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Unified global lift kinematics
  const lift = getLiftState(frame, fps);

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#E2F0FD",
        overflow: "hidden",
      }}
    >
      {/* 1. Voiceover Audio from frame 0 across the entire timeline */}
      <Audio src={staticFile("script-voice-over.wav")} />

      {/* 2. Continuous 3D World: City Scene, Lift Cabin, 3D Character, Force Vectors */}
      <LiftWorld frame={frame} fps={fps} />

      {/* 3. 2D Speed Streaks (Faint vertical lines responsive to lift velocity) */}
      <SpeedStreaks velocity={lift.v} />

      {/* 4. 2D Force Vector Labels projected to sharp screen coordinates */}
      <ForceArrowLabels2D frame={frame} />

      {/* 5. 2D HTML Glass UI Overlays per Scene */}
      <S1Overlay />
      <S2Overlay />
      <S3Overlay />
      <S4Overlay />
      <S5Overlay />
      <S6Overlay />
      <S7Overlay />

      {/* 6. Bangla Captions with active word highlighting (Fixed at top: 1540px) */}
      <Captions cues={SCRIPT_CUES} style={{ top: 1540 }} />
    </AbsoluteFill>
  );
};
