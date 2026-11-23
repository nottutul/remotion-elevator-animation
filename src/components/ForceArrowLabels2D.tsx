import React from "react";
import { projectToScreen } from "../lib/project";

export interface ForceArrowLabels2DProps {
  frame: number;
}

/**
 * High-definition 2D Glass Labels for 3D Force Vectors.
 * Dynamically projected to screen pixel coordinates via projectToScreen.
 */
export const ForceArrowLabels2D: React.FC<ForceArrowLabels2DProps> = ({ frame }) => {
  // 1. mg label: visible from S2 (frame 339) to end
  const showMg = frame >= 339;
  const mgPos = projectToScreen(0.14, 1.35, 0.35, frame);

  // 2. N label: visible from S3 (frame 670) to end of S6 (frame 2178)
  const showN = frame >= 670 && frame <= 2178;
  const nPos = projectToScreen(-0.30, 0.68, 0.35, frame);

  // 3. a / g label: visible in S4, S5, S7
  const showA = (frame >= 969 && frame <= 1460) || (frame >= 1486 && frame <= 1880) || frame >= 2188;
  const aPos = projectToScreen(-1.05, 1.62, 0.20, frame);

  let aText = "a";
  if (frame >= 969 && frame <= 1460) {
    aText = "a = +4.9 m/s²";
  } else if (frame >= 1486 && frame <= 1880) {
    aText = "a = \u22124.9 m/s²";
  } else if (frame >= 2188) {
    aText = "a = g";
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        pointerEvents: "none",
        zIndex: 45,
      }}
    >
      {/* mg Label */}
      {showMg && (
        <div
          style={{
            position: "absolute",
            left: mgPos.x,
            top: mgPos.y,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1.5px solid rgba(211, 47, 47, 0.45)",
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
            borderRadius: 12,
            padding: "3px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#D32F2F",
              letterSpacing: 0.5,
            }}
          >
            mg
          </span>
        </div>
      )}

      {/* N Label */}
      {showN && (
        <div
          style={{
            position: "absolute",
            left: nPos.x,
            top: nPos.y,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1.5px solid rgba(46, 125, 50, 0.45)",
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
            borderRadius: 12,
            padding: "3px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#2E7D32",
              letterSpacing: 0.5,
            }}
          >
            N
          </span>
        </div>
      )}

      {/* a / g Label */}
      {showA && (
        <div
          style={{
            position: "absolute",
            left: aPos.x,
            top: aPos.y,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1.5px solid rgba(21, 101, 192, 0.45)",
            boxShadow: "0 4px 12px rgba(21, 101, 192, 0.15)",
            borderRadius: 12,
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 17,
              fontWeight: 800,
              color: "#1565C0",
              letterSpacing: 0.3,
            }}
          >
            {aText}
          </span>
        </div>
      )}
    </div>
  );
};
