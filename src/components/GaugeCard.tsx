import React from "react";
import { Scale, CircleHelp } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IconBadge } from "./IconBadge";

export interface GaugeCardProps {
  ratio: number; // N / mg ratio (e.g., 1.0, 1.5, 0.5, 0.0)
  enterAt?: number;
  exitAt?: number;
  isWobbling?: boolean;
  showQuestion?: boolean;
  style?: React.CSSProperties;
}

/**
 * Spring Balance / Weight Gauge showing apparent weight (N) vs true weight (mg).
 * Placed in GAUGE_SLOT (720px, 520px, 270px, 240px).
 */
export const GaugeCard: React.FC<GaugeCardProps> = ({
  ratio,
  enterAt = 0,
  exitAt,
  isWobbling = false,
  showQuestion = false,
  style,
}) => {
  // Needle angle mapping:
  // ratio = 1.0 -> 0 deg (center, vertical)
  // ratio = 0.0 -> -65 deg (far left)
  // ratio = 1.5 -> +45 deg (right)
  // ratio = 2.0 -> +75 deg
  const clampedRatio = Math.max(0, Math.min(2.0, ratio));
  let needleAngle = (clampedRatio - 1.0) * 80;

  if (isWobbling) {
    needleAngle += Math.sin(Date.now() / 100) * 12; // fallback if needed, but in remotion we pass wobbled ratio
  }

  // Format ratio text
  // let valueText = `${ratio.toFixed(1)} mg`;
  // if (showQuestion) {
  //   valueText = "?";
  // } else if (Math.abs(ratio - 1.0) < 0.05) {
  //   valueText = "1.0 mg";
  // }

  return (
    <div
      style={{
        position: "absolute",
        left: 720,
        top: 520,
        width: 270,
        height: 240,
        zIndex: 50,
        ...style,
      }}
    >
      <GlassCard
        width={270}
        height={240}
        radius={28}
        tint="green"
        enterAt={enterAt}
        exitAt={exitAt}
        style={{
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Header row with Title and Icon */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 6px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "ShohidShafkatSamir, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.1,
              }}
            >
              স্প্রিং নিক্তি
            </span>
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: 0.5,
              }}
            >
              SCALE (N)
            </span>
          </div>
          <IconBadge
            icon={<Scale size={20} color="#2E7D32" strokeWidth={2.5} />}
            tint="green"
            size={40}
          />
        </div>

        {/* Dial Face SVG */}
        <div
          style={{
            position: "relative",
            width: 190,
            height: 105,
            marginTop: 4,
            overflow: "visible",
          }}
        >
          <svg
            width="190"
            height="105"
            viewBox="0 0 190 105"
            style={{ overflow: "visible" }}
          >
            {/* Background Arc */}
            <path
              d="M 20 95 A 75 75 0 0 1 170 95"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Active Normal Zone Arc */}
            <path
              d="M 65 37 A 75 75 0 0 1 125 37"
              fill="none"
              stroke="rgba(46, 125, 50, 0.35)"
              strokeWidth="14"
            />

            {/* Red Reference Tick for 1.0 mg (True Weight) */}
            <line
              x1="95"
              y1="20"
              x2="95"
              y2="34"
              stroke="#D32F2F"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left Tick (0.5 mg) */}
            <line
              x1="52"
              y1="40"
              x2="60"
              y2="49"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Right Tick (1.5 mg) */}
            <line
              x1="138"
              y1="40"
              x2="130"
              y2="49"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Needle Pivot Point at (95, 95) */}
            <g
              transform={`rotate(${needleAngle}, 95, 95)`}
              style={{
                transition: isWobbling ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* Needle Shadow */}
              <line
                x1="95"
                y1="95"
                x2="95"
                y2="24"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="4"
                strokeLinecap="round"
                transform="translate(1, 2)"
              />
              {/* Green Needle */}
              <line
                x1="95"
                y1="95"
                x2="95"
                y2="24"
                stroke="#2E7D32"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="95" cy="24" r="3" fill="#1B5E20" />
            </g>

            {/* Center Pivot Cap */}
            <circle cx="95" cy="95" r="9" fill="#1E293B" />
            <circle cx="95" cy="95" r="4" fill="#FFFFFF" />
          </svg>

          {/* Question Overlay for S7 */}
          {showQuestion && (
            <div
              style={{
                position: "absolute",
                top: 25,
                left: 70,
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #7B1FA2",
              }}
            >
              <CircleHelp size={32} color="#7B1FA2" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Digital Value Display Pill */}
        <div
          style={{
            padding: "4px 16px",
            borderRadius: 14,
            backgroundColor: showQuestion
              ? "rgba(123, 31, 162, 0.12)"
              : "rgba(46, 125, 50, 0.12)",
            border: showQuestion
              ? "1px solid rgba(123, 31, 162, 0.3)"
              : "1px solid rgba(46, 125, 50, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: showQuestion ? "#7B1FA2" : "#1B5E20",
              letterSpacing: 0.5,
            }}
          >
            {/* {valueText} */}
            ওজন
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
