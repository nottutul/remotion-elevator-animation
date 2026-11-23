import React from "react";
import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { TrendingUp, ArrowUpCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { GaugeCard } from "../components/GaugeCard";
import { EquationCard } from "../components/EquationCard";
import { CardChip } from "../components/CardChip";

/**
 * Scene 4 Overlay (32.30s - 49.00s, frames 969 - 1470)
 * Cues 11 to 16: "লিফট উপরের দিকে a ত্বরণে চলছে... N = m(g + a)... ভারী অনুভব করি"
 */
export const S4Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < 969 || frame > 1470) {
    return null;
  }

  // Smooth spring transition for gauge needle from 1.0 to 1.5
  const needleSpring = spring({
    frame: frame - 969,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 80 },
  });
  const gaugeRatio = interpolate(needleSpring, [0, 1], [1.0, 1.5]);

  // Cues 11-12: Intro Card (frames 969 - 1125)
  const showIntro = frame >= 969 && frame <= 1125;
  // Cue 13: Newton's 2nd Law (frames 1130 - 1200)
  const showEq1 = frame >= 1130 && frame <= 1200;
  // Cue 14: Expanded Formula (frames 1205 - 1310)
  const showEq2 = frame >= 1205 && frame <= 1310;
  // Cues 15-16: Trend Chip (frames 1315 - 1460)
  const showTrend = frame >= 1315 && frame <= 1460;

  return (
    <>
      {showIntro && (
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 236,
            width: 800,
            height: 220,
            zIndex: 50,
          }}
        >
          <GlassCard
            width={800}
            height={220}
            radius={36}
            tint="blue"
            enterAt={969}
            exitAt={1125}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<ArrowUpCircle size={44} color="#1565C0" strokeWidth={2.2} />}
              tint="blue"
              size={80}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#1565C0",
                  lineHeight: 1.1,
                }}
              >
                লিফট উপরের দিকে ত্বরণে চলছে
              </div>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: "#334155",
                  lineHeight: 1.35,
                }}
              >
                ত্বরণ a উপরের দিকে ক্রিয়ারত (Acceleration a ↑)
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {showEq1 && (
        <EquationCard
          equation="N − mg = ma"
          subtitle="নিউটনের ২য় গতিসূত্র"
          highlightTerm="ma"
          tint="blue"
          enterAt={1130}
          exitAt={1200}
        />
      )}

      {showEq2 && (
        <EquationCard
          equation="N = m(g + a)"
          subtitle="অভিলম্ব প্রতিক্রিয়া বৃদ্ধি"
          highlightTerm="(g + a)"
          tint="green"
          enterAt={1205}
          exitAt={1310}
        />
      )}

      {/* Weight Gauge in GAUGE_SLOT: visible throughout S4 */}
      <GaugeCard
        ratio={gaugeRatio}
        enterAt={969}
        exitAt={1460}
      />

      {showTrend && (
        <CardChip
          position="slot"
          icon={<TrendingUp size={28} color="#2E7D32" strokeWidth={2.5} />}
          label="ওজন বৃদ্ধি"
          sublabel="N > mg  (ভারী অনুভব)"
          tint="green"
          enterAt={1315}
          exitAt={1460}
        />
      )}
    </>
  );
};
