"use client";

import { useEffect, useState } from "react";
import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  zoom?: number;   // 1.0 = show full crop, 2.0 = zoom into center 2x
  mask: MaskConfig;
  className?: string;
}

// Crop coords (x, y, width, height) are in NATURAL image pixel space.
// zoom zooms into the center of the crop region.
// CSS percentage positioning ensures pixel-perfect accuracy at any container size.
export default function QuizImage({
  imageUrl,
  crop,
  zoom = 1,
  mask,
  className = "",
}: QuizImageProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  // Apply zoom: shrink the effective region around the center of the crop
  const effectiveW = crop.width / zoom;
  const effectiveH = crop.height / zoom;
  const effectiveX = crop.x + (crop.width - effectiveW) / 2;
  const effectiveY = crop.y + (crop.height - effectiveH) / 2;

  // Container aspect ratio matches the effective (zoomed) crop region
  const paddingBottom = `${(effectiveH / effectiveW) * 100}%`;

  // Image width as % of container width:
  //   img_display_width = container_width * (natural.w / effectiveW)
  const imgWidthPct = naturalSize ? (naturalSize.w / effectiveW) * 100 : 0;

  // Image left: -effectiveX / effectiveW * 100%
  const imgLeftPct = (-effectiveX / effectiveW) * 100;

  // Image top: -effectiveY / effectiveH * 100%
  const imgTopPct = (-effectiveY / effectiveH) * 100;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      style={{ width: "100%", paddingBottom }}
    >
      {naturalSize && (
        <img
          src={imageUrl}
          alt="퀴즈 이미지"
          draggable={false}
          className="absolute select-none"
          style={{
            width: `${imgWidthPct}%`,
            height: "auto",
            left: `${imgLeftPct}%`,
            top: `${imgTopPct}%`,
          }}
        />
      )}

      {mask.enabled && mask.blurPercent > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${(mask.blurPercent / 100) * 20}px)`,
            WebkitBackdropFilter: `blur(${(mask.blurPercent / 100) * 20}px)`,
          }}
        />
      )}
    </div>
  );
}
