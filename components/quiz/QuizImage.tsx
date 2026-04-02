"use client";

import { useEffect, useState } from "react";
import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  mask: MaskConfig;
  className?: string;
}

// Crop coords (x, y, width, height) are in NATURAL image pixel space.
// The container fills to match the crop's aspect ratio.
// CSS percentage positioning ensures pixel-perfect accuracy at any container size.
export default function QuizImage({
  imageUrl,
  crop,
  mask,
  className = "",
}: QuizImageProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  const blurPx = mask.enabled ? (mask.blurPercent / 100) * 20 : 0;

  // The container width is 100% of its parent.
  // The container height = container_width * (crop.height / crop.width).
  // We use padding-bottom trick for the aspect ratio.
  const paddingBottom = `${(crop.height / crop.width) * 100}%`;

  // Image width as % of container width:
  //   img_display_width = container_width * (natural.w / crop.width)
  //   => width% = (natural.w / crop.width) * 100
  const imgWidthPct = naturalSize ? (naturalSize.w / crop.width) * 100 : 0;

  // Image left offset as % of container width:
  //   offset = -crop.x * (container_width / crop.width)
  //   => left% = (-crop.x / crop.width) * 100
  const imgLeftPct = (-crop.x / crop.width) * 100;

  // Image top offset:
  //   container_height = container_width * (crop.height / crop.width)
  //   img_top_px = -crop.y * (container_width / crop.width)
  //   top% of container_height = img_top_px / container_height
  //                            = (-crop.y / crop.width) / (crop.height / crop.width)
  //                            = -crop.y / crop.height
  const imgTopPct = (-crop.y / crop.height) * 100;

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

      {mask.enabled && blurPx > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blurPx}px)`,
            WebkitBackdropFilter: `blur(${blurPx}px)`,
          }}
        />
      )}
    </div>
  );
}
