import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GlassCard } from "./GlassCard";
import { THEME } from "../theme";

export interface CardChipProps {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  tint?: "neutral" | "green" | "purple" | "blue" | "red";
  enterAt?: number;
  exitAt?: number;
  position?: "slot" | "contrast_slot" | "custom";
  style?: React.CSSProperties;
}

/**
 * Compact high-contrast status pill chip for trend badges.
 * Supports CHIP_SLOT (720px, 790px, 270px, 76px) and CHIP_CONTRAST_SLOT (200px, 420px, 680px, 64px).
 */
export const CardChip: React.FC<CardChipProps> = ({
  icon,
  label,
  sublabel,
  tint = "neutral",
  enterAt = 0,
  exitAt,
  position = "slot",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterAt) return null;
  if (exitAt !== undefined && frame > exitAt) return null;

  const pop = spring({
    frame: frame - enterAt,
    fps,
    config: THEME.springs.pop,
  });

  const scale = interpolate(pop, [0, 1], [0.85, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  let defaultPos: React.CSSProperties = {
    position: "absolute",
    left: 720,
    top: 790,
    width: 270,
    height: 76,
    zIndex: 50,
  };

  if (position === "contrast_slot") {
    defaultPos = {
      position: "absolute",
      left: 200,
      top: 420,
      width: 680,
      height: 64,
      zIndex: 50,
    };
  } else if (position === "custom") {
    defaultPos = {
      position: "absolute",
      zIndex: 50,
    };
  }

  return (
    <div
      style={{
        ...defaultPos,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <GlassCard
        width="100%"
        height="100%"
        radius={22}
        tint={tint}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 16px",
          gap: 10,
        }}
      >
        {icon && (
          <div style={{ display: "flex", alignItems: "center" }}>{icon}</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "ShohidShafkatSamir, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.1,
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
