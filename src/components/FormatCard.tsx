"use client";

import RangeSlider from "./RangeSlider";

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

interface FormatCardProps {
  format: OutputFormat;
  quality: number;
  onFormatChange: (fmt: OutputFormat) => void;
  onQualityChange: (q: number) => void;
}

const FORMATS: { label: string; value: OutputFormat }[] = [
  { label: "JPG", value: "image/jpeg" },
  { label: "PNG", value: "image/png" },
  { label: "WEBP", value: "image/webp" },
];

export default function FormatCard({
  format,
  quality,
  onFormatChange,
  onQualityChange,
}: FormatCardProps) {
  return (
    <div className="bg-[#16161f] border border-[#22222e] rounded-2xl p-5">
      <div className="text-[10px] tracking-[2px] uppercase text-[#5a5a72] font-mono mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f91] inline-block" />
        Output Format
      </div>

      {/* Format Pills */}
      <div className="flex flex-wrap gap-2">
        {FORMATS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onFormatChange(value)}
            className={`px-4 py-1.5 rounded-full border font-mono text-[11px] transition-all duration-200 ${
              format === value
                ? "bg-[#7c6fff] border-[#7c6fff] text-white"
                : "bg-[#0a0a0f] border-[#22222e] text-[#5a5a72] hover:border-[#7c6fff] hover:text-[#7c6fff]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Quality Slider — hidden for PNG */}
      {format !== "image/png" && (
        <RangeSlider
          min={1}
          max={100}
          value={quality}
          onChange={onQualityChange}
          hint="Quality"
          displayValue={`${quality}%`}
        />
      )}

      {format === "image/png" && (
        <p className="mt-4 font-mono text-[10px] text-[#5a5a72] leading-relaxed">
          PNG is lossless — quality setting does not apply.
        </p>
      )}
    </div>
  );
}
