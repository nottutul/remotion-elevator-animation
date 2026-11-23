import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GlassTint, THEME } from "../theme";

export interface GlassCardProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  tint?: GlassTint;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  enterAt?: number;
  exitAt?: number;
  floatAmount?: number;
  phaseOffset?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  width,
  height,
  radius = 42,
  tint = "neutral",
  icon,
  children,
  enterAt = 0,
  exitAt,
  floatAmount = 6,
  phaseOffset = 0,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If before enterAt, do not render
  if (frame < enterAt) {
    return null;
  }

  // If past exitAt, do not render
  if (exitAt !== undefined && frame > exitAt) {
    return null;
  }

  // Entry spring animation
  const enterSpring = spring({
    frame: frame - enterAt,
    fps,
    config: THEME.springs.card,
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.9, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [40, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const enterBlur = interpolate(enterSpring, [0, 1], [12, 0]);

  // Specular sheen sweep on entry (25 frames)
  const sheenProgress = interpolate(frame - enterAt, [0, 25], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle floating and subtle tilt
  const idleY = Math.sin((frame - enterAt) * 0.05 + phaseOffset) * floatAmount;
  const idleTilt = Math.sin((frame - enterAt) * 0.035 + phaseOffset) * 0.75;

  // Exit animation (last 9 frames before exitAt)
  let exitScale = 1;
  let exitOpacity = 1;
  if (exitAt !== undefined && frame >= exitAt - 9) {
    exitScale = interpolate(frame, [exitAt - 9, exitAt], [1, 0.96], {
      extrapolateRight: "clamp",
    });
    exitOpacity = interpolate(frame, [exitAt - 9, exitAt], [1, 0], {
      extrapolateRight: "clamp",
    });
  }

  const finalScale = enterScale * exitScale;
  const finalOpacity = enterOpacity * exitOpacity;
  const finalY = enterY + idleY;

  const tintConfig = THEME.colors.glassTints[tint];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: tintConfig.background,
        backdropFilter: `blur(28px) saturate(180%) ${enterBlur > 0.1 ? `blur(${enterBlur}px)` : ""}`,
        WebkitBackdropFilter: `blur(28px) saturate(180%) ${enterBlur > 0.1 ? `blur(${enterBlur}px)` : ""}`,
        border: `1.5px solid ${tintConfig.border}`,
        boxShadow: THEME.glassRecipe.boxShadow,
        transform: `translate3d(0, ${finalY}px, 0) scale(${finalScale}) rotate(${idleTilt}deg)`,
        opacity: finalOpacity,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: THEME.typography.fontFamily,
        color: THEME.colors.ink,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Top diagonal specular highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.0) 100%)",
          borderTopLeftRadius: radius - 2,
          borderTopRightRadius: radius - 2,
          pointerEvents: "none",
        }}
      />

      {/* Entry sheen sweep */}
      {frame - enterAt <= 28 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "60%",
            transform: `translateX(${sheenProgress}%) skewX(-25deg)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Optional Top Icon */}
      {icon && (
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: (style?.flexDirection as React.CSSProperties["flexDirection"]) || "column",
          alignItems: (style?.alignItems as React.CSSProperties["alignItems"]) || "center",
          justifyContent: (style?.justifyContent as React.CSSProperties["justifyContent"]) || "center",
          gap: style?.gap,
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
