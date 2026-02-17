"use client";

import RangeSlider from "./RangeSlider";

const DPI_PRESETS = [
  { label: "72 — Web", value: 72 },
  { label: "96 — Screen", value: 96 },
  { label: "150 — Medium", value: 150 },
  { label: "300 — Print", value: 300 },
  { label: "600 — HQ Print", value: 600 },
];

interface DpiCardProps {
  dpi: number;
  onDpiChange: (v: number) => void;
}

export default function DpiCard({ dpi, onDpiChange }: DpiCardProps) {
  return (
    <div className="bg-[#16161f] border border-[#22222e] rounded-2xl p-5 col-span-full">
      <div className="text-[10px] tracking-[2px] uppercase text-[#5a5a72] font-mono mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4fffb0] inline-block" />
        Resolution / DPI
      </div>

      <div className="flex items-center gap-4">
        {/* Number input */}
        <div className="relative" style={{ maxWidth: 160 }}>
          <input
            type="number"
            value={dpi || ""}
            min={1}
            max={1200}
            onChange={(e) => onDpiChange(Math.max(1, Number(e.target.value) || 96))}
            className="w-full bg-[#0a0a0f] border border-[#22222e] rounded-xl px-3.5 py-2.5 text-[#e8e8f0] font-mono text-sm outline-none focus:border-[#7c6fff] transition-colors pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#5a5a72] pointer-events-none">
            dpi
          </span>
        </div>

        {/* Slider */}
        <div className="flex-1">
          <RangeSlider
            min={1}
            max={1200}
            value={Math.min(1200, dpi)}
            onChange={onDpiChange}
            hint="0 → 1200 dpi"
            displayValue={String(dpi)}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mt-3">
        {DPI_PRESETS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onDpiChange(value)}
            className={`px-3.5 py-1.5 rounded-full border font-mono text-[11px] transition-all duration-200 ${
              dpi === value
                ? "bg-[#7c6fff] border-[#7c6fff] text-white"
                : "bg-[#0a0a0f] border-[#22222e] text-[#5a5a72] hover:border-[#7c6fff] hover:text-[#7c6fff]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
