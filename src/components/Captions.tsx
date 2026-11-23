import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { getCueWordTimings, ScriptCue } from "../data/script";
import { THEME } from "../theme";

export interface CaptionsProps {
  cues: ScriptCue[];
  style?: React.CSSProperties;
}

export const Captions: React.FC<CaptionsProps> = ({ cues, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Find currently active cue
  const activeCue = cues.find(
    (c) => currentTimeSec >= c.startSec && currentTimeSec <= c.endSec
  );

  if (!activeCue) {
    return null;
  }

  // Get word-level timings distributed by character weight
  const words = getCueWordTimings(activeCue, fps);

  return (
    <div
      style={{
        position: "absolute",
        left: THEME.safeZones.sideMargin,
        right: THEME.safeZones.sideMargin,
        top: 1320, // Positioned safely in y: 1250-1450 range
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 20,
        ...style,
      }}
    >
      {/* Glass Pill Container */}
      <div
        style={{
          maxWidth: THEME.safeZones.contentWidth,
          padding: "20px 38px",
          borderRadius: 32,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.62))",
          backdropFilter: THEME.glassRecipe.backdropFilter,
          WebkitBackdropFilter: THEME.glassRecipe.WebkitBackdropFilter,
          border: "1.5px solid rgba(255, 255, 255, 0.95)",
          boxShadow: THEME.glassRecipe.boxShadow,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: "10px",
          rowGap: "8px",
          fontFamily: THEME.typography.fontFamily,
          boxSizing: "border-box",
        }}
      >
        {words.map((w, index) => {
          // Check if this word is currently spoken
          // Ensure exact boundaries so active word is distinct
          const isActive =
            currentTimeSec >= w.startSec &&
            (index === words.length - 1
              ? currentTimeSec <= w.endSec
              : currentTimeSec < w.endSec);

          return (
            <span
              key={`${activeCue.id}-${index}-${w.word}`}
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: 14,
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.3,
                color: isActive ? "#5C007A" : THEME.colors.ink,
                background: isActive
                  ? "rgba(123, 31, 162, 0.16)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(123, 31, 162, 0.45)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 4px 16px rgba(123, 31, 162, 0.20), inset 0 1px 0 rgba(255,255,255,0.8)"
                  : "none",
                transform: isActive ? "scale(1.04)" : "scale(1.0)",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
