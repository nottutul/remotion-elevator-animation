import React from "react";
import { AbsoluteFill, staticFile, CanvasImage, Img } from "remotion";

export interface KeyframeInfo {
  frame: number;
  time: string;
  scene: string;
  label: string;
  color: string;
}

export const ALL_KEYFRAMES: KeyframeInfo[] = [
  // Row 1 (S1 & S2)
  { frame: 15, time: "0.5s", scene: "S1", label: "Intro", color: "#3B82F6" },
  { frame: 120, time: "4.0s", scene: "S1", label: "Going Up", color: "#3B82F6" },
  { frame: 210, time: "7.0s", scene: "S1", label: "Going Down", color: "#3B82F6" },
  { frame: 310, time: "10.3s", scene: "S1", label: "Hook ? ", color: "#3B82F6" },
  { frame: 450, time: "15.0s", scene: "S2", label: "W = mg Card", color: "#EF4444" },
  { frame: 555, time: "18.5s", scene: "S2", label: "Equation W=mg", color: "#EF4444" },

  // Row 2 (S3 & S4)
  { frame: 675, time: "22.5s", scene: "S3", label: "Apparent W'", color: "#10B981" },
  { frame: 735, time: "24.5s", scene: "S3", label: "N Arrow & Gauge", color: "#10B981" },
  { frame: 850, time: "28.3s", scene: "S3", label: "Normal Force", color: "#10B981" },
  { frame: 915, time: "30.5s", scene: "S3", label: "W' = N Formula", color: "#10B981" },
  { frame: 1080, time: "36.0s", scene: "S4", label: "a ↑ (Start Up)", color: "#2563EB" },
  { frame: 1160, time: "38.7s", scene: "S4", label: "N - mg = ma", color: "#2563EB" },

  // Row 3 (S4 & S5)
  { frame: 1245, time: "41.5s", scene: "S4", label: "N = m(g+a)", color: "#2563EB" },
  { frame: 1380, time: "46.0s", scene: "S4", label: "Reaction N > mg", color: "#2563EB" },
  { frame: 1425, time: "47.5s", scene: "S4", label: "Heavier Chip", color: "#2563EB" },
  { frame: 1530, time: "51.0s", scene: "S5", label: "a ↓ (Start Down)", color: "#F59E0B" },
  { frame: 1620, time: "54.0s", scene: "S5", label: "mg - N = ma", color: "#F59E0B" },
  { frame: 1740, time: "58.0s", scene: "S5", label: "N = m(g-a)", color: "#F59E0B" },

  // Row 4 (S5, S6 & S7)
  { frame: 1860, time: "62.0s", scene: "S5", label: "Lighter Chip", color: "#F59E0B" },
  { frame: 1980, time: "66.0s", scene: "S6", label: "Constant Speed", color: "#059669" },
  { frame: 2080, time: "69.3s", scene: "S6", label: "W' = N = mg", color: "#059669" },
  { frame: 2145, time: "71.5s", scene: "S6", label: "Weight Constant", color: "#059669" },
  { frame: 2265, time: "75.5s", scene: "S7", label: "Free Fall a=g", color: "#9333EA" },
  { frame: 2440, time: "81.3s", scene: "S7", label: "Question CTA", color: "#9333EA" },
];

/**
 * 24-Frame Contact Sheet (6 columns x 4 rows)
 * Resolution: 2400 x 1800
 */
export const MotionStripFull: React.FC = () => {
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundColor: "#0B0F19",
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, sans-serif",
          translate: "0px -1014.1px"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            paddingBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              Lift Physics: Full Continuous 3D Timeline (S1 to S7)
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#94A3B8",
                backgroundColor: "rgba(255,255,255,0.08)",
                padding: "4px 14px",
                borderRadius: 12,
              }}
            >
              24 Keyframes (81.34s @ 30fps)
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["S1 Intro", "S2 True W", "S3 Apparent W'", "S4 Accel UP", "S5 Accel DOWN", "S6 Constant", "S7 Free Fall"].map(
              (tag, idx) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#E2E8F0",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      
        {/* 6 x 4 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: 16,
            flex: 1,
          }}
        >
          {ALL_KEYFRAMES.map((kf) => (
            <div
              key={kf.frame}
              style={{
                position: "relative",
                backgroundColor: "#1E293B",
                borderRadius: 14,
                overflow: "hidden",
                border: "1.5px solid rgba(255,255,255,0.12)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
            >
              {/* Image Thumbnail */}
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <Img
                  src={staticFile(`stills/frame-${kf.frame}.png`)}
                  alt={`Frame ${kf.frame}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Scene & Time Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: kf.color,
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 6,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  }}
                >
                  {kf.scene} • {kf.time}
                </div>
              </div>
      
              {/* Cell Footer Caption */}
              <div
                style={{
                  padding: "8px 10px",
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#F8FAFC",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kf.label}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748B",
                  }}
                >
                  f{kf.frame}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <CanvasImage
        src={staticFile("frame-1980.png")}
        style={{
          position: "absolute",
          translate: "60px -148.7px",
          width: 1080,
          height: 1920
        }}
      />
      <CanvasImage
        src={staticFile("frame-1380.png")}
        style={{
          position: "absolute",
          translate: "169.9px -371.3px",
          width: 1080,
          height: 1920
        }}
      />
      <CanvasImage
        src={staticFile("frame-1530.png")}
        style={{
          position: "absolute",
          translate: "682.5px -303.7px",
          width: 1080,
          height: 1920
        }}
      />
    </>
  );
};
