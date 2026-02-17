"use client";

import { useState, useCallback } from "react";
import DropZone from "@/components/DropZone";
import DimensionsCard from "@/components/DimensionsCard";
import FormatCard from "@/components/FormatCard";
import FileSizeCard from "@/components/FileSizeCard";
import DpiCard from "@/components/DpiCard";
import ProgressBar from "@/components/ProgressBar";
import ResultCard from "@/components/ResultCard";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import type { OutputFormat } from "@/components/FormatCard";
import type { SizeUnit } from "@/components/FileSizeCard";

interface SourceImage {
  file: File;
  img: HTMLImageElement;
  dataUrl: string;
}

export default function Home() {
  // Source image state
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);

  // Dimensions state
  const [dimMode, setDimMode] = useState<"pixel" | "percent">("pixel");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [percent, setPercent] = useState<number>(100);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Format state
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(85);

  // File size target state
  const [sizeEnabled, setSizeEnabled] = useState(false);
  const [targetSize, setTargetSize] = useState(200);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("KB");

  // DPI state
  const [dpi, setDpi] = useState(96);

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const { progress, result, process, setResult } = useImageProcessor();

  // ── Handle image load ───────────────────────────────────────
  const handleImageLoad = useCallback((src: SourceImage) => {
    setSourceImage(src);
    setWidth(src.img.width);
    setHeight(src.img.height);
    setAspectRatio(src.img.width / src.img.height);
    setResult(null);
  }, [setResult]);

  const handleClear = useCallback(() => {
    setSourceImage(null);
    setResult(null);
    setWidth(0);
    setHeight(0);
    setAspectRatio(null);
  }, [setResult]);

  // ── Width / Height with aspect ratio lock ──────────────────
  const handleWidthChange = useCallback(
    (w: number) => {
      setWidth(w);
      if (lockAspect && aspectRatio && w > 0) {
        setHeight(Math.round(w / aspectRatio));
      }
    },
    [lockAspect, aspectRatio]
  );

  const handleHeightChange = useCallback(
    (h: number) => {
      setHeight(h);
      if (lockAspect && aspectRatio && h > 0) {
        setWidth(Math.round(h * aspectRatio));
      }
    },
    [lockAspect, aspectRatio]
  );

  // ── Process ────────────────────────────────────────────────
  const handleProcess = useCallback(async () => {
    if (!sourceImage) return;
    setIsProcessing(true);
    try {
      await process({
        sourceImage,
        dimMode,
        width,
        height,
        percent,
        format,
        quality,
        sizeEnabled,
        targetSize,
        sizeUnit,
        dpi,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceImage,
    dimMode,
    width,
    height,
    percent,
    format,
    quality,
    sizeEnabled,
    targetSize,
    sizeUnit,
    dpi,
    process,
  ]);

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-20">
      {/* Ambient blobs */}
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          background: "#7c6fff",
          top: -200,
          left: -200,
          filter: "blur(120px)",
          opacity: 0.12,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 500,
          height: 500,
          background: "#ff6f91",
          bottom: -200,
          right: -100,
          filter: "blur(120px)",
          opacity: 0.12,
        }}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-end justify-between mb-12 gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c6fff, #ff6f91)",
            }}
          >
            ⚡
          </div>
          <div>
            <h1
              className="text-[28px] font-extrabold tracking-tight font-syne"
              style={{
                background: "linear-gradient(90deg, #fff 40%, #7c6fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              One Resizer
            </h1>
            <p className="font-mono text-xs text-[#5a5a72] mt-0.5">
              resize · compress · convert · download
            </p>
            <p>Design & Developer By : Tipu Sultan</p>
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-[1px] uppercase px-3.5 py-1.5 rounded-full bg-[rgba(124,111,255,0.12)] border border-[rgba(124,111,255,0.3)] text-[#7c6fff]">
          100% Client-Side
        </div>
      </header>

      {/* ── Drop Zone ─────────────────────────────────────── */}
      <DropZone
        sourceImage={sourceImage}
        onLoad={handleImageLoad}
        onClear={handleClear}
      />

      {/* ── Controls Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <DimensionsCard
          dimMode={dimMode}
          setDimMode={setDimMode}
          width={width}
          height={height}
          percent={percent}
          lockAspect={lockAspect}
          aspectRatio={aspectRatio}
          onWidthChange={handleWidthChange}
          onHeightChange={handleHeightChange}
          onPercentChange={setPercent}
          onLockChange={setLockAspect}
        />
        <FormatCard
          format={format}
          quality={quality}
          onFormatChange={setFormat}
          onQualityChange={setQuality}
        />
        <FileSizeCard
          enabled={sizeEnabled}
          targetSize={targetSize}
          sizeUnit={sizeUnit}
          onToggle={setSizeEnabled}
          onTargetChange={setTargetSize}
          onUnitChange={setSizeUnit}
        />
        <DpiCard dpi={dpi} onDpiChange={setDpi} />
      </div>

      {/* ── Process Button ────────────────────────────────── */}
      <button
        onClick={handleProcess}
        disabled={!sourceImage || isProcessing}
        className="w-full py-[18px] rounded-2xl text-white font-syne font-bold text-base tracking-wide flex items-center justify-center gap-2.5 mb-6 transition-all duration-250 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,111,255,0.4)] active:translate-y-0"
        style={{
          background: "linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)",
        }}
      >
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
        />
        <span className="text-lg relative z-10">⚡</span>
        <span className="relative z-10">
          {isProcessing ? "Processing…" : "Process Image"}
        </span>
      </button>

      {/* ── Progress Bar ─────────────────────────────────── */}
      <ProgressBar
        show={progress.show}
        percent={progress.pct}
        label={progress.label}
      />

      {/* ── Result Card ───────────────────────────────────── */}
      <ResultCard result={result} />
      <footer>
        <h5>Design & Developer By : Tipu Sultan</h5>
      </footer>
    </main>
  );
}
