"use client";

import { getSliderPct } from "@/lib/imageUtils";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  displayValue?: string;
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  hint,
  displayValue,
}: RangeSliderProps) {
  const pct = getSliderPct(min, max, value);

  return (
    <div className="mt-3">
      {(hint || displayValue) && (
        <div className="flex justify-between items-center mb-2">
          {hint && (
            <span className="font-mono text-[10px] text-[#5a5a72]">{hint}</span>
          )}
          {displayValue && (
            <span className="font-mono text-lg font-medium text-[#7c6fff]">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": pct } as React.CSSProperties}
        className="w-full"
      />
    </div>
  );
}
