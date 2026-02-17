"use client";

import { useState, useCallback } from "react";
import {
  canvasToBlob,
  binarySearchQuality,
  embedJpegDpi,
} from "@/lib/imageUtils";
import type { ResultData } from "@/components/ResultCard";
import type { OutputFormat } from "@/components/FormatCard";
import type { SizeUnit } from "@/components/FileSizeCard";

interface SourceImage {
  file: File;
  img: HTMLImageElement;
  dataUrl: string;
}

interface ProcessOptions {
  sourceImage: SourceImage;
  dimMode: "pixel" | "percent";
  width: number;
  height: number;
  percent: number;
  format: OutputFormat;
  quality: number;
  sizeEnabled: boolean;
  targetSize: number;
  sizeUnit: SizeUnit;
  dpi: number;
}

function tick() {
  return new Promise<void>((r) => setTimeout(r, 0));
}

export function useImageProcessor() {
  const [progress, setProgress] = useState({ show: false, pct: 0, label: "" });
  const [result, setResult] = useState<ResultData | null>(null);

  const updateProgress = useCallback((pct: number, label: string) => {
    setProgress({ show: true, pct, label });
  }, []);

  const process = useCallback(
    async (opts: ProcessOptions) => {
      const {
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
      } = opts;

      const { img: sourceImg, file: sourceFile } = sourceImage;

      setResult(null);
      updateProgress(5, "Preparing canvas…");
      await tick();

      // ── Compute output dimensions ──────────────────────────
      let outW: number, outH: number;
      if (dimMode === "pixel") {
        outW = Math.max(1, width || sourceImg.width);
        outH = Math.max(1, height || sourceImg.height);
      } else {
        const pct = Math.max(1, percent || 100) / 100;
        outW = Math.max(1, Math.round(sourceImg.width * pct));
        outH = Math.max(1, Math.round(sourceImg.height * pct));
      }

      updateProgress(20, "Rendering image…");
      await tick();

      // ── Canvas draw ────────────────────────────────────────
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceImg, 0, 0, outW, outH);

      updateProgress(50, "Encoding…");
      await tick();

      // ── Quality / size target ─────────────────────────────
      const qualityFraction = quality / 100;
      let finalBlob: Blob;

      if (!sizeEnabled || format === "image/png") {
        finalBlob = await canvasToBlob(canvas, format, qualityFraction);
        updateProgress(80, "Finalising…");
      } else {
        const rawSize = targetSize || 200;
        const targetBytes =
          sizeUnit === "MB" ? rawSize * 1024 * 1024 : rawSize * 1024;
        updateProgress(55, "Finding optimal quality…");
        finalBlob = await binarySearchQuality(canvas, format, targetBytes);
        updateProgress(80, "Finalising…");
      }

      await tick();
      updateProgress(95, "Preparing download…");
      await tick();

      // ── Embed DPI for JPEG ────────────────────────────────
      if (format === "image/jpeg") {
        finalBlob = await embedJpegDpi(finalBlob, dpi);
      }

      const blobUrl = URL.createObjectURL(finalBlob);
      const outExt = format.split("/")[1].replace("jpeg", "jpg");
      const baseName = sourceFile.name.replace(/\.[^.]+$/, "");
      const downloadName = `${baseName}_${outW}x${outH}.${outExt}`;

      updateProgress(100, "Done!");
      await tick();

      setTimeout(() => setProgress({ show: false, pct: 0, label: "" }), 500);

      setResult({
        blobUrl,
        downloadName,
        outW,
        outH,
        origW: sourceImg.width,
        origH: sourceImg.height,
        origSize: sourceFile.size,
        finalSize: finalBlob.size,
        dpi,
        format: outExt,
        origFormat: sourceFile.name.split(".").pop() ?? "img",
      });
    },
    [updateProgress]
  );

  return { progress, result, process, setResult };
}
