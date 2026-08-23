"use client";

import React from "react";

interface RangoliProps {
  currentStep: number;
  totalSteps?: number;
}

export const Rangoli: React.FC<RangoliProps> = ({
  currentStep,
  totalSteps = 13,
}) => {
  const petals = Array.from({ length: totalSteps }, (_, i) => {
    const angle = (i / totalSteps) * 2 * Math.PI - Math.PI / 2;
    const cx = 50 + Math.cos(angle) * 20;
    const cy = 50 + Math.sin(angle) * 20;
    const rotation = (angle * 180) / Math.PI + 90;
    const isFilled = i < currentStep;

    return (
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={10.5}
        ry={6.5}
        transform={`rotate(${rotation} ${cx} ${cy})`}
        fill={isFilled ? "var(--sindoor)" : "none"}
        stroke={isFilled ? "var(--sindoor)" : "var(--paper-line)"}
        strokeWidth={2}
        opacity={isFilled ? 0.85 : 1}
        style={{
          transition: "fill 0.45s ease, stroke 0.45s ease, opacity 0.45s ease",
        }}
      />
    );
  });

  return (
    <svg
      className="w-[66px] h-[66px] mt-0.5"
      viewBox="0 0 100 100"
      aria-label={`Step ${currentStep} of ${totalSteps} progress`}
    >
      <g>{petals}</g>
      <circle cx="50" cy="50" r="6" fill="var(--haldi)" />
    </svg>
  );
};
