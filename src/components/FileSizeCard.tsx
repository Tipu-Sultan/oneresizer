"use client";

export type SizeUnit = "KB" | "MB";

interface FileSizeCardProps {
  enabled: boolean;
  targetSize: number;
  sizeUnit: SizeUnit;
  onToggle: (v: boolean) => void;
  onTargetChange: (v: number) => void;
  onUnitChange: (u: SizeUnit) => void;
}

export default function FileSizeCard({
  enabled,
  targetSize,
  sizeUnit,
  onToggle,
  onTargetChange,
  onUnitChange,
}: FileSizeCardProps) {
  return (
    <div className="bg-[#16161f] border border-[#22222e] rounded-2xl p-5">
      <div className="text-[10px] tracking-[2px] uppercase text-[#5a5a72] font-mono mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffcc44] inline-block" />
        Target File Size
      </div>

      {/* Enable toggle */}
      <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="hidden"
        />
        <div
          className="rounded-[5px] border flex items-center justify-center text-[11px] transition-all duration-200 flex-shrink-0"
          style={{
            width: 18,
            height: 18,
            background: enabled ? "var(--accent)" : "",
            borderColor: enabled ? "var(--accent)" : "var(--border)",
          }}
        >
          {enabled && <span className="text-white text-[10px]">✓</span>}
        </div>
        <span className="text-xs text-[#5a5a72]">Enable size target</span>
      </label>

      {/* Size inputs */}
      <div className={`transition-all duration-200 ${enabled ? "opacity-100" : "opacity-35 pointer-events-none"}`}>
        <div className="relative">
          <input
            type="number"
            value={targetSize || ""}
            placeholder="200"
            min={1}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            className="w-full bg-[#0a0a0f] border border-[#22222e] rounded-xl px-3.5 py-2.5 text-[#e8e8f0] font-mono text-sm outline-none focus:border-[#7c6fff] transition-colors pr-20"
          />
          {/* Unit toggle */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-0.5">
            {(["KB", "MB"] as SizeUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => onUnitChange(u)}
                className={`px-2 py-1 rounded-md font-mono text-[10px] transition-all duration-150 ${
                  sizeUnit === u
                    ? "bg-[#7c6fff] text-white"
                    : "bg-transparent text-[#5a5a72] hover:text-[#e8e8f0]"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 font-mono text-[10px] text-[#5a5a72] leading-relaxed">
          Quality will be auto-adjusted to hit target (±10%).
        </p>
      </div>
    </div>
  );
}
