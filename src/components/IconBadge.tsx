import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GlassTint, THEME } from "../theme";

export interface IconBadgeProps {
  icon: React.ReactNode;
  tint?: GlassTint;
  size?: number;
  enterAt?: number;
  exitAt?: number;
  style?: React.CSSProperties;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  tint = "neutral",
  size = 56,
  enterAt = 0,
  exitAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterAt) {
    return null;
  }
  if (exitAt !== undefined && frame > exitAt) {
    return null;
  }

  const popSpring = spring({
    frame: frame - enterAt,
    fps,
    config: THEME.springs.pop,
  });

  const scale = interpolate(popSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(popSpring, [0, 0.4, 1], [0, 0.8, 1]);

  let exitScale = 1;
  let exitOpacity = 1;
  if (exitAt !== undefined && frame >= exitAt - 8) {
    exitScale = interpolate(frame, [exitAt - 8, exitAt], [1, 0.85], {
      extrapolateRight: "clamp",
    });
    exitOpacity = interpolate(frame, [exitAt - 8, exitAt], [1, 0], {
      extrapolateRight: "clamp",
    });
  }

  const tintConfig = THEME.colors.glassTints[tint];
  const radius = Math.round(size * 0.32);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: tintConfig.badgeBg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1.5px solid ${tintConfig.border}`,
        boxShadow: "0 8px 24px rgba(30, 40, 80, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale * exitScale})`,
        opacity: opacity * exitOpacity,
        color: tintConfig.accentColor,
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
    </div>
  );
};
