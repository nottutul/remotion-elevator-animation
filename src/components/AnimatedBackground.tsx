import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { THEME } from "../theme";

export interface AnimatedBackgroundProps {
  tint?: string;
  scene?: string;
  opacity?: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  tint,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  // Deterministic floating drift using sin and cos
  const blob1X = Math.sin(frame * 0.012) * 110 + 260;
  const blob1Y = Math.cos(frame * 0.009) * 140 + 480;

  const blob2X = Math.cos(frame * 0.014) * 130 + 820;
  const blob2Y = Math.sin(frame * 0.011) * 160 + 620;

  const blob3X = Math.sin(frame * 0.015 + 1.2) * 120 + 360;
  const blob3Y = Math.cos(frame * 0.013 + 0.8) * 150 + 1280;

  const blob4X = Math.cos(frame * 0.011 + 2.0) * 140 + 780;
  const blob4Y = Math.sin(frame * 0.016 + 1.5) * 130 + 1440;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tint || THEME.colors.bgBase,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Blurred pastel gradient blobs */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.colors.blobs.blue} 0%, rgba(187,215,255,0) 70%)`,
          left: blob1X - 325,
          top: blob1Y - 325,
          filter: "blur(90px)",
          opacity: 0.65,
          transform: "translate3d(0,0,0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.colors.blobs.lavender} 0%, rgba(217,201,255,0) 70%)`,
          left: blob2X - 360,
          top: blob2Y - 360,
          filter: "blur(95px)",
          opacity: 0.6,
          transform: "translate3d(0,0,0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 680,
          height: 680,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.colors.blobs.peach} 0%, rgba(255,217,194,0) 70%)`,
          left: blob3X - 340,
          top: blob3Y - 340,
          filter: "blur(85px)",
          opacity: 0.55,
          transform: "translate3d(0,0,0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.colors.blobs.mint} 0%, rgba(200,240,220,0) 70%)`,
          left: blob4X - 350,
          top: blob4Y - 350,
          filter: "blur(90px)",
          opacity: 0.55,
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* Subtle paper grain texture overlay */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      >
        <filter id="subtle-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#subtle-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
