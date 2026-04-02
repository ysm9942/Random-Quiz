"use client";

import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  zoom: number;
  mask: MaskConfig;
  className?: string;
}

export default function QuizImage({
  imageUrl,
  crop,
  zoom,
  mask,
  className = "",
}: QuizImageProps) {
  const containerWidth = 360;
  const containerHeight = 300;

  const blurPx = mask.enabled ? (mask.blurPercent / 100) * 20 : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: containerWidth,
          height: containerHeight,
        }}
      >
        <img
          src={imageUrl}
          alt="퀴즈 이미지"
          draggable={false}
          className="absolute select-none"
          style={{
            left: -crop.x * zoom,
            top: -crop.y * zoom,
            width: `${(crop.width + crop.x * 2) * zoom}px`,
            height: "auto",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        />
      </div>

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
