"use client";

import { useEffect, useRef, useState } from "react";
import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  zoom?: number;   // 1.0 = show full crop, 2.0 = zoom into center 2x
  mask: MaskConfig;
  maxHeight?: number; // optional cap on rendered height in px
  className?: string;
}

export default function QuizImage({
  imageUrl,
  crop,
  zoom = 1,
  mask,
  maxHeight,
  className = "",
}: QuizImageProps) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  // Track actual container width for pixel-precise layout
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Effective crop region after zoom (zoom into center)
  const effectiveW = crop.width / zoom;
  const effectiveH = crop.height / zoom;
  const effectiveX = crop.x + (crop.width - effectiveW) / 2;
  const effectiveY = crop.y + (crop.height - effectiveH) / 2;

  // Compute pixel layout from actual container width
  let containerH = containerW > 0 ? containerW * (effectiveH / effectiveW) : 0;
  if (maxHeight && containerH > maxHeight) containerH = maxHeight;

  // Scale so effectiveW natural px = containerW display px (then adjust for capped height)
  const scale = containerW > 0 ? Math.min(
    containerW / effectiveW,
    maxHeight ? containerH / effectiveH : Infinity
  ) : 0;

  const imgW = naturalSize ? naturalSize.w * scale : 0;
  const imgH = naturalSize ? naturalSize.h * scale : 0;
  const imgLeft = -effectiveX * scale;
  const imgTop = -effectiveY * scale;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      style={{ width: "100%", height: containerH || undefined }}
    >
      {naturalSize && containerW > 0 && (
        <img
          src={imageUrl}
          alt="퀴즈 이미지"
          draggable={false}
          className="absolute select-none"
          style={{
            width: imgW,
            height: imgH,
            left: imgLeft,
            top: imgTop,
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
