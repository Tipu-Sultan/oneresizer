/**
 * Convert canvas to Blob with given MIME type and quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob conversion failed"));
      },
      mime,
      quality
    );
  });
}

/**
 * Binary search to find optimal quality for a target file size
 */
export async function binarySearchQuality(
  canvas: HTMLCanvasElement,
  mime: string,
  targetBytes: number
): Promise<Blob> {
  let lo = 0.05,
    hi = 0.99;
  let best: Blob | null = null;

  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, mime, mid);
    best = blob;
    if (Math.abs(blob.size - targetBytes) / targetBytes < 0.05) break;
    if (blob.size > targetBytes) hi = mid;
    else lo = mid;
  }

  return best!;
}

/**
 * Embed DPI metadata into JPEG via JFIF APP0 segment
 */
export async function embedJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buf = await blob.arrayBuffer();
  const arr = new Uint8Array(buf);

  // JPEG must start with FFD8
  if (arr[0] !== 0xff || arr[1] !== 0xd8) return blob;

  // Build new JFIF APP0 segment with desired DPI
  const app0 = new Uint8Array([
    0xff,
    0xe0, // APP0 marker
    0x00,
    0x10, // length = 16
    0x4a,
    0x46,
    0x49,
    0x46,
    0x00, // "JFIF\0"
    0x01,
    0x01, // version 1.1
    0x01, // units = DPI (1)
    (dpi >> 8) & 0xff,
    dpi & 0xff, // X density
    (dpi >> 8) & 0xff,
    dpi & 0xff, // Y density
    0x00,
    0x00, // no thumbnail
  ]);

  let rest: Uint8Array;
  if (arr[2] === 0xff && arr[3] === 0xe0) {
    // existing APP0 – replace it
    const segLen = (arr[4] << 8) | arr[5];
    rest = arr.slice(2 + segLen);
  } else {
    // no APP0 – insert after FFD8
    rest = arr.slice(2);
  }

  const newArr = new Uint8Array(2 + app0.length + rest.length);
  newArr[0] = 0xff;
  newArr[1] = 0xd8;
  newArr.set(app0, 2);
  newArr.set(rest, 2 + app0.length);

  return new Blob([newArr], { type: "image/jpeg" });
}

/**
 * Format bytes into human-readable string
 */
export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/**
 * Get slider fill percentage as CSS custom property string
 */
export function getSliderPct(min: number, max: number, val: number): string {
  const pct = ((val - min) / (max - min)) * 100;
  return `${pct}%`;
}
