"use client";

import { useEffect, useState } from "react";
import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  zoom: number;
  mask: MaskConfig;
  className?: string;
}

// Admin editor displays images with maxHeight: 450px.
// Crop coordinates are in that displayed-pixel space.
// This component recreates the same scale, then zooms the crop region to fill the container.
const ADMIN_MAX_HEIGHT = 450;

export default function QuizImage({
  imageUrl,
  crop,
  zoom,
  mask,
  className = "",
}: QuizImageProps) {
  const containerSize = 320;
  const [adminDims, setAdminDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      // Match admin editor display constraints
      if (h > ADMIN_MAX_HEIGHT) {
        w = w * (ADMIN_MAX_HEIGHT / h);
        h = ADMIN_MAX_HEIGHT;
      }
      setAdminDims({ w, h });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const blurPx = mask.enabled ? (mask.blurPercent / 100) * 20 : 0;

  // Scale: make crop.size pixels fill the containerSize, then apply zoom
  const scale = adminDims ? (containerSize / crop.size) * zoom : 1;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      style={{ width: containerSize, height: containerSize }}
    >
      {adminDims && (
        <img
          src={imageUrl}
          alt="퀴즈 이미지"
          draggable={false}
          className="absolute select-none"
          style={{
            width: adminDims.w * scale,
            height: adminDims.h * scale,
            left: -crop.x * scale,
            top: -crop.y * scale,
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
