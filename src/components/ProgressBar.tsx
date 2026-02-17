"use client";

interface ProgressBarProps {
  show: boolean;
  percent: number;
  label: string;
}

export default function ProgressBar({ show, percent, label }: ProgressBarProps) {
  if (!show) return null;

  return (
    <div className="mb-6">
      <div className="h-1.5 bg-[#16161f] rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #7c6fff, #ff6f91)",
          }}
        />
      </div>
      <p className="font-mono text-[11px] text-[#5a5a72] text-center">{label}</p>
    </div>
  );
}
