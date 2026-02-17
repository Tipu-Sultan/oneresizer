"use client";

import { useCallback, useRef } from "react";
import { fmtBytes } from "@/lib/imageUtils";

interface SourceImage {
  file: File;
  img: HTMLImageElement;
  dataUrl: string;
}

interface DropZoneProps {
  sourceImage: SourceImage | null;
  onLoad: (source: SourceImage) => void;
  onClear: () => void;
}

export default function DropZone({ sourceImage, onLoad, onClear }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);

  const loadFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onLoad({ file, img, dataUrl });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [onLoad]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    isDraggingRef.current = false;
    if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear();
  };

  if (sourceImage) {
    return (
      <div className="relative rounded-3xl border border-[rgba(124,111,255,0.4)] bg-[rgba(124,111,255,0.04)] p-4 mb-8">
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sourceImage.dataUrl}
            alt="Preview"
            className="w-40 h-24 object-contain rounded-xl bg-black border border-[#22222e] flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-2 break-all font-syne">
              {sourceImage.file.name}
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                ["Dims", `${sourceImage.img.width}×${sourceImage.img.height}`],
                ["Size", fmtBytes(sourceImage.file.size)],
                ["Type", sourceImage.file.type.split("/")[1].toUpperCase()],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="font-mono text-[11px] px-3 py-1 rounded-full bg-[#16161f] border border-[#22222e] text-[#5a5a72]"
                >
                  {k}: <span className="text-[#e8e8f0]">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleClear}
            className="ml-auto flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,111,145,0.15)] border border-[rgba(255,111,145,0.3)] text-[#ff6f91] text-sm hover:bg-[rgba(255,111,145,0.3)] transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative border-2 border-dashed border-[#22222e] rounded-3xl bg-[#111118] h-56 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:border-[#7c6fff] hover:bg-[rgba(124,111,255,0.05)] hover:scale-[1.005] overflow-hidden mb-8"
      onDragOver={handleDragOver}
      onDragLeave={() => (isDraggingRef.current = false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="text-4xl leading-none">🖼️</div>
      <div className="font-bold text-base font-syne">Drop image here or click to browse</div>
      <div className="text-xs text-[#5a5a72] font-mono">Any size, any resolution</div>
      <div className="flex gap-2 mt-1">
        {["JPG", "PNG", "WEBP", "GIF", "BMP"].map((fmt) => (
          <span
            key={fmt}
            className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-[#22222e] text-[#5a5a72]"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}
