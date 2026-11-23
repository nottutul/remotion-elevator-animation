import React from "react";
import { useCurrentFrame } from "remotion";
import { ArrowUpDown } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { GaugeCard } from "../components/GaugeCard";
import { EquationCard } from "../components/EquationCard";

/**
 * Scene 3 Overlay (20.30s - 31.60s, frames 609 - 948)
 * Cues 7 to 10: "কিন্তু আমরা যে ওজন অনুভব করি... W' = N"
 */
export const S3Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 609 || frame > 948) {
    return null;
  }

  // Primary Card: frames 609 - 805 (Cues 7 & 8)
  const showPrimaryCard = frame >= 609 && frame <= 805;
  // Gauge card: frames 670 - 940 (enters as N is introduced)
  const showGauge = frame >= 670 && frame <= 940;
  // Equation card: frames 810 - 940 (Cues 9 & 10)
  const showEquation = frame >= 810 && frame <= 940;

  return (
    <>
      {showPrimaryCard && (
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
            tint="green"
            enterAt={609}
            exitAt={805}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<ArrowUpDown size={44} color="#2E7D32" strokeWidth={2.2} />}
              tint="green"
              size={80}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#2E7D32",
                  lineHeight: 1.1,
                }}
              >
                আপাত ওজন (Apparent Weight)
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
                মেঝে আমাদের পায়ের ওপর যে অভিলম্ব প্রতিক্রিয়া বল (N) প্রয়োগ করে
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {showGauge && (
        <GaugeCard
          ratio={1.0}
          enterAt={670}
          exitAt={940}
        />
      )}

      {showEquation && (
        <EquationCard
          equation="W′ = N"
          subtitle="আপাত ওজন (অনুভূত ওজন)"
          highlightTerm="N"
          tint="green"
          enterAt={810}
          exitAt={940}
        />
      )}
    </>
  );
};
