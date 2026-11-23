import React, { useLayoutEffect } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { ArrowDown, ArrowUp, CircleHelp } from "lucide-react";
import { THEME } from "../theme";
import { SCRIPT_CUES } from "../data/script";
import { Captions } from "../components/Captions";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { Character3D } from "../components/Character3D";
import { LiftCabin3D } from "../components/LiftCabin3D";
import { CityScene3D } from "../components/CityScene3D";
import { getLiftMotion } from "../lib/motion";

const CameraController: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
}> = ({ position, target }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);
  return null;
};

export interface S1Props {
  startOffset?: number;
}

export const S1: React.FC<S1Props> = ({ startOffset = 0 }) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = currentFrame + startOffset;

  // Continuous Lift Motion (Physics Curve)
  const lift = getLiftMotion(frame, fps);

  // Smooth camera push-in over 11.3s (about 4% push-in)
  // Perfectly framing lift cabin, character, open sky with sun above, and city below
  const cameraZ = 6.05 - (frame / 339) * 0.20;
  const cameraPos: [number, number, number] = [0, 1.30, cameraZ];
  const cameraTarget: [number, number, number] = [0, 1.30, 0];

  // Direction and floor indicator
  let direction: "up" | "down" | "idle" = "idle";
  let currentFloor = "32F";

  if (frame >= 70 && frame <= 180) {
    direction = "up";
    currentFloor = frame > 125 ? "34F" : "33F";
  } else if (frame > 180 && frame < 186) {
    direction = "idle";
    currentFloor = "34F";
  } else if (frame >= 186 && frame <= 285) {
    direction = "down";
    currentFloor = frame > 235 ? "32F" : "33F";
  } else {
    direction = "idle";
    currentFloor = "32F";
  }

  // Floating Glass Badges Timing:
  // Cue 2 "ভারী": starts at 4.87s (frame 146), exits at 6.00s (frame 180)
  const heavyEnterAt = 146;
  const heavyExitAt = 180;

  // Cue 3 "হালকা": starts at 8.27s (frame 248), exits at 9.47s (frame 284)
  const lightEnterAt = 248;
  const lightExitAt = 284;

  // Cue 4 "কিন্তু কেন?": enters at 9.75s (frame 293), stays until scene end (339)
  const questionEnterAt = 293;
  const questionExitAt = 339;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#E2F0FD",
        overflow: "hidden",
      }}
    >
      {/* 1. Voiceover Audio from frame 0 */}
      <Audio src={staticFile("script-voice-over.wav")} />

      {/* 2. FULL 3D CANVAS (Three.js via @remotion/three) */}
      <ThreeCanvas
        width={1080}
        height={1920}
        camera={{ position: cameraPos, fov: 42 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
        }}
      >
        <CameraController position={cameraPos} target={cameraTarget} />

        {/* Ambient & Hemisphere Lighting */}
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#E0F2FE", "#FFF3E0", 0.70]} />

        {/* Warm Directional Sun from Upper Left matching the background image */}
        <directionalLight
          position={[-6, 12, 5]}
          intensity={1.8}
          color="#FFF8E7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Key Fill Light from front-left camera side to illuminate character front, shirt texture & face */}
        <directionalLight
          position={[-2.0, 2.0, 4.5]}
          intensity={1.3}
          color="#FFF6EC"
        />

        {/* Frontal Soft Light */}
        <directionalLight
          position={[1.5, 1.5, 4.5]}
          intensity={0.65}
          color="#E0F2FE"
        />

        {/* Warm Elevator Ceiling Downlight Diffuser */}
        <pointLight
          position={[-0.08, 2.58, 0]}
          intensity={1.3}
          color="#FFF8DC"
          distance={4.0}
          decay={1.8}
        />

        {/* Warm Golden Sun Rim Light from Upper Left */}
        <directionalLight
          position={[-4, 8, 1]}
          intensity={1.5}
          color="#FED7AA"
        />

        {/* Warm Soft Rim Light from Back Right */}
        <directionalLight
          position={[3.0, 3.0, -3.0]}
          intensity={0.65}
          color="#FFE8C2"
        />

        {/* 3D City Environment (Distant background with parallax + Right-side Skyscraper Tower) */}
        <CityScene3D liftY={lift.y} frame={frame} />

        {/* Panoramic Glass Lift Cabin (Attached to right-side building tracks) */}
        <group position={[0, 0.38, 0]}>
          <LiftCabin3D currentFloor={currentFloor} direction={direction} />
        </group>

        {/* 3D Ready Player Me Character (Standing centered inside cabin at X = -0.08) */}
        <group position={[-0.08, 0.38, 0]}>
          <Character3D frame={frame} fps={fps} />
        </group>
      </ThreeCanvas>

      {/* ============================================================== */}
      {/* 3. 2D HTML GLASS UI OVERLAY LAYER                             */}
      {/* ============================================================== */}
      {/* FLOATING GLASS BADGE 1: "ভারী" (Upward Acceleration Beat) */}
      {frame >= heavyEnterAt && frame <= heavyExitAt && (
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 710,
            zIndex: 30,
          }}
        >
          <GlassCard
            width={240}
            height={78}
            radius={24}
            tint="purple"
            enterAt={heavyEnterAt}
            exitAt={heavyExitAt}
            style={{
              padding: "8px 18px",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<ArrowUp size={22} color={THEME.colors.glassTints.purple.accentColor} />}
              size={38}
              tint="purple"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 34,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              ভারী
            </span>
          </GlassCard>
        </div>
      )}

      {/* FLOATING GLASS BADGE 2: "হালকা" (Downward Acceleration Beat) */}
      {frame >= lightEnterAt && frame <= lightExitAt && (
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 710,
            zIndex: 30,
          }}
        >
          <GlassCard
            width={240}
            height={78}
            radius={24}
            tint="blue"
            enterAt={lightEnterAt}
            exitAt={lightExitAt}
            style={{
              padding: "8px 18px",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<ArrowDown size={22} color={THEME.colors.glassTints.blue.accentColor} />}
              size={38}
              tint="blue"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 34,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              হালকা
            </span>
          </GlassCard>
        </div>
      )}

      {/* QUESTION CARD: "কিন্তু কেন?" (Cue 4 Hook Finale) */}
      {frame >= questionEnterAt && (
        <div
          style={{
            position: "absolute",
            top: 236,
            left: 140,
            zIndex: 40,
          }}
        >
          <GlassCard
            width={800}
            height={220}
            radius={36}
            tint="neutral"
            enterAt={questionEnterAt}
            exitAt={questionExitAt}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 28px",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<CircleHelp size={28} color={THEME.colors.glassTints.purple.accentColor} />}
              size={48}
              tint="purple"
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 64,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 1.0,
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              কিন্তু কেন?
            </span>
          </GlassCard>
        </div>
      )}

      {/* BANGLA CAPTIONS (Floating cleanly below lift chassis over lower cityscape) */}
      <Captions cues={SCRIPT_CUES} style={{ top: 1540 }} />
    </AbsoluteFill>
  );
};
