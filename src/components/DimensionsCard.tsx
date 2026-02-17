"use client";

import { useEffect } from "react";
import RangeSlider from "./RangeSlider";

type DimMode = "pixel" | "percent";

interface DimensionsCardProps {
  dimMode: DimMode;
  setDimMode: (m: DimMode) => void;
  width: number;
  height: number;
  percent: number;
  lockAspect: boolean;
  aspectRatio: number | null;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  onPercentChange: (p: number) => void;
  onLockChange: (locked: boolean) => void;
}

export default function DimensionsCard({
  dimMode,
  setDimMode,
  width,
  height,
  percent,
  lockAspect,
  aspectRatio,
  onWidthChange,
  onHeightChange,
  onPercentChange,
  onLockChange,
}: DimensionsCardProps) {
  // Lock aspect ratio enforcement
  useEffect(() => {
    // handled by parent
  }, []);

  return (
    <div className="bg-[#16161f] border border-[#22222e] rounded-2xl p-5">
      <div className="text-[10px] tracking-[2px] uppercase text-[#5a5a72] font-mono mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7c6fff] inline-block" />
        Dimensions
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-[#0a0a0f] rounded-xl p-[3px] border border-[#22222e] mb-3.5">
        {(["pixel", "percent"] as DimMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setDimMode(m)}
            className={`flex-1 py-1.5 rounded-[8px] font-mono text-[11px] transition-all duration-200 ${
              dimMode === m
                ? "bg-[#7c6fff] text-white font-medium"
                : "bg-transparent text-[#5a5a72] hover:text-[#e8e8f0]"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Pixel Inputs */}
      {dimMode === "pixel" && (
        <div>
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                type="number"
                value={width || ""}
                placeholder="Width"
                min={1}
                max={9999}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="w-full bg-[#0a0a0f] border border-[#22222e] rounded-xl px-3.5 py-2.5 text-[#e8e8f0] font-mono text-sm outline-none focus:border-[#7c6fff] transition-colors pr-9"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#5a5a72] pointer-events-none">
                px
              </span>
            </div>
            <span className="text-[#5a5a72] text-lg font-bold">×</span>
            <div className="flex-1 relative">
              <input
                type="number"
                value={height || ""}
                placeholder="Height"
                min={1}
                max={9999}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="w-full bg-[#0a0a0f] border border-[#22222e] rounded-xl px-3.5 py-2.5 text-[#e8e8f0] font-mono text-sm outline-none focus:border-[#7c6fff] transition-colors pr-9"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#5a5a72] pointer-events-none">
                px
              </span>
            </div>
          </div>

          {/* Lock Aspect */}
          <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => onLockChange(e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center text-[10px] transition-all duration-200 ${
                lockAspect
                  ? "bg-[#7c6fff] border-[#7c6fff]"
                  : "bg-[#0a0a0f] border-[#22222e]"
              }`}
              style={{ width: 18, height: 18 }}
            >
              {lockAspect ? "🔒" : "🔓"}
            </div>
            <span className="text-xs text-[#5a5a72]">Lock aspect ratio</span>
          </label>
        </div>
      )}

      {/* Percent Inputs */}
      {dimMode === "percent" && (
        <div>
          <div className="relative">
            <input
              type="number"
              value={percent || ""}
              placeholder="100"
              min={1}
              max={2000}
              onChange={(e) => onPercentChange(Number(e.target.value))}
              className="w-full bg-[#0a0a0f] border border-[#22222e] rounded-xl px-3.5 py-2.5 text-[#e8e8f0] font-mono text-sm outline-none focus:border-[#7c6fff] transition-colors pr-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#5a5a72] pointer-events-none">
              %
            </span>
          </div>
          <RangeSlider
            min={1}
            max={400}
            value={Math.min(400, percent)}
            onChange={onPercentChange}
            hint="Scale factor"
            displayValue={`${percent}%`}
          />
        </div>
      )}
    </div>
  );
}
