import React from "react";
import { useCurrentFrame } from "remotion";
import { CheckCircle2, Scale } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { GaugeCard } from "../components/GaugeCard";
import { EquationCard } from "../components/EquationCard";
import { CardChip } from "../components/CardChip";

/**
 * Scene 6 Overlay (63.35s - 72.60s, frames 1900 - 2178)
 * Cues 22 to 24: "প্রকৃত ওজন পরিবর্তন হয় না... পরিবর্তন হয় N... সেটাই আপাত ওজন!"
 */
export const S6Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 1900 || frame > 2178) {
    return null;
  }

  // Cue 22: Primary Card (frames 1900 - 2040)
  const showPrimary = frame >= 1900 && frame <= 2040;
  // Cues 23-24: Equation & Chip (frames 2045 - 2170)
  const showEq = frame >= 2045 && frame <= 2170;

  return (
    <>
      {showPrimary && (
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
            enterAt={1900}
            exitAt={2040}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<CheckCircle2 size={44} color="#2E7D32" strokeWidth={2.2} />}
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
                প্রকৃত ওজন বদলায় না!
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
                W = mg সর্বদা অপরিবর্তিত থাকে; শুধু N পরিবর্তিত হয়
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {showEq && (
        <>
          <EquationCard
            equation="W′ = N = mg"
            subtitle="আপাত ওজন = প্রকৃত ওজন"
            highlightTerm="N"
            tint="green"
            enterAt={2045}
            exitAt={2170}
          />

          <CardChip
            position="slot"
            icon={<Scale size={28} color="#2E7D32" strokeWidth={2.5} />}
            label="স্বাভাবিক ওজন"
            sublabel="W′ = W (ধ্রুবক)"
            tint="green"
            enterAt={2045}
            exitAt={2170}
          />
        </>
      )}

      {/* Gauge in GAUGE_SLOT: steady at 1.0 */}
      <GaugeCard
        ratio={1.0}
        enterAt={1900}
        exitAt={2170}
      />
    </>
  );
};
