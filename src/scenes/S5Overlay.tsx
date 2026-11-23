import React from "react";
import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { TrendingDown, ArrowDownCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { GaugeCard } from "../components/GaugeCard";
import { EquationCard } from "../components/EquationCard";
import { CardChip } from "../components/CardChip";

/**
 * Scene 5 Overlay (49.55s - 63.10s, frames 1486 - 1893)
 * Cues 17 to 21: "লিফট নিচের দিকে a ত্বরণে চলে... N = m(g - a)... ওজন কম মনে হয়"
 */
export const S5Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < 1486 || frame > 1893) {
    return null;
  }

  // Smooth transition for gauge needle to 0.5
  const needleSpring = spring({
    frame: frame - 1486,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 80 },
  });
  const gaugeRatio = interpolate(needleSpring, [0, 1], [1.0, 0.5]);

  // Cue 17: Intro Card (frames 1486 - 1575)
  const showIntro = frame >= 1486 && frame <= 1575;
  // Cue 18: Equation step 1 (frames 1580 - 1648)
  const showEq1 = frame >= 1580 && frame <= 1648;
  // Cue 19: Equation step 2 (frames 1650 - 1745)
  const showEq2 = frame >= 1650 && frame <= 1745;
  // Cues 20-21: Trend Chip (frames 1750 - 1885)
  const showTrend = frame >= 1750 && frame <= 1885;

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
            tint="red"
            enterAt={1486}
            exitAt={1575}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<ArrowDownCircle size={44} color="#D32F2F" strokeWidth={2.2} />}
              tint="red"
              size={80}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#D32F2F",
                  lineHeight: 1.1,
                }}
              >
                লিফট নিচের দিকে ত্বরণে চলছে
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
                ত্বরণ a নিচের দিকে ক্রিয়ারত (Acceleration a ↓)
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {showEq1 && (
        <EquationCard
          equation="mg − N = ma"
          subtitle="নিউটনের ২য় গতিসূত্র"
          highlightTerm="ma"
          tint="blue"
          enterAt={1580}
          exitAt={1648}
        />
      )}

      {showEq2 && (
        <EquationCard
          equation="N = m(g − a)"
          subtitle="অভিলম্ব প্রতিক্রিয়া হ্রাস"
          highlightTerm="(g − a)"
          tint="red"
          enterAt={1650}
          exitAt={1745}
        />
      )}

      {/* Weight Gauge in GAUGE_SLOT: visible throughout S5 */}
      <GaugeCard
        ratio={gaugeRatio}
        enterAt={1486}
        exitAt={1885}
      />

      {showTrend && (
        <CardChip
          position="slot"
          icon={<TrendingDown size={28} color="#D32F2F" strokeWidth={2.5} />}
          label="ওজন হ্রাস"
          sublabel="N < mg  (হালকা অনুভব)"
          tint="red"
          enterAt={1750}
          exitAt={1885}
        />
      )}
    </>
  );
};
