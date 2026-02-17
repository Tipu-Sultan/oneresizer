"use client";

interface ResultData {
  blobUrl: string;
  downloadName: string;
  outW: number;
  outH: number;
  origW: number;
  origH: number;
  origSize: number;
  finalSize: number;
  dpi: number;
  format: string;
  origFormat: string;
}

interface ResultCardProps {
  result: ResultData | null;
}

function fmtKB(bytes: number) {
  return (bytes / 1024).toFixed(1) + " KB";
}

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  return (
    <div className="animate-pop-in bg-[#16161f] border border-[rgba(79,255,176,0.25)] rounded-2xl p-6 mb-6">
      {/* Top row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2.5 font-bold text-[15px] font-syne">
          <span className="w-2 h-2 rounded-full bg-[#4fffb0] flex-shrink-0" />
          Processed Successfully
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            `${result.outW}×${result.outH} px`,
            fmtKB(result.finalSize),
            `${result.dpi} DPI`,
            result.format.toUpperCase(),
          ].map((chip) => (
            <span
              key={chip}
              className="font-mono text-[11px] px-3.5 py-1.5 rounded-full bg-[rgba(79,255,176,0.08)] border border-[rgba(79,255,176,0.2)] text-[#4fffb0]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Preview + Compare */}
      <div className="flex flex-wrap gap-5 mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.blobUrl}
          alt="Result"
          className="w-48 h-28 object-contain rounded-xl bg-black border border-[#22222e] flex-shrink-0"
        />
        <div className="flex-1 grid grid-cols-2 gap-2.5 min-w-[200px]">
          {[
            {
              label: "Before",
              dim: `${result.origW}×${result.origH}`,
              size: fmtKB(result.origSize),
              cls: "text-[#5a5a72]",
            },
            {
              label: "After",
              dim: `${result.outW}×${result.outH}`,
              size: fmtKB(result.finalSize),
              cls: "text-[#4fffb0]",
            },
            {
              label: "Format",
              dim: result.origFormat.toUpperCase(),
              size: result.format.toUpperCase(),
              cls2: "text-[#5a5a72]",
              cls: "text-[#4fffb0]",
            },
            {
              label: "DPI",
              dim: "—",
              size: String(result.dpi),
              cls: "text-[#4fffb0]",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0a0a0f] rounded-xl p-3 border border-[#22222e]"
            >
              <div className="text-[9px] tracking-[2px] uppercase text-[#5a5a72] font-mono mb-1">
                {item.label}
              </div>
              <div className={`font-mono text-[13px] font-medium ${item.cls2 ?? "text-[#5a5a72]"}`}>
                {item.dim}
              </div>
              <div className={`font-mono text-[13px] font-medium mt-1 ${item.cls}`}>
                {item.size}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download button */}
      <a
        href={result.blobUrl}
        download={result.downloadName}
        className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 bg-[rgba(79,255,176,0.1)] border border-[rgba(79,255,176,0.35)] text-[#4fffb0] font-syne font-bold text-[15px] hover:bg-[rgba(79,255,176,0.18)] hover:-translate-y-0.5 transition-all duration-200"
      >
        ⬇️ Download Image
      </a>
    </div>
  );
}

export type { ResultData };
