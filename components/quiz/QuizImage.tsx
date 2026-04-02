"use client";

import { useEffect, useRef, useState } from "react";
import { CropRegion, MaskConfig } from "@/types";

interface QuizImageProps {
  imageUrl: string;
  crop: CropRegion;
  mask: MaskConfig;
  maxWidth?: number;   // cap display width in px
  maxHeight?: number;  // cap display height in px
  className?: string;
}

// Crop coords (x, y, width, height) are in NATURAL image pixel space.
// The component shows exactly the crop region, scaled to fill the container.
// maxWidth/maxHeight constrain the display size.
export default function QuizImage({
  imageUrl,
  crop,
  mask,
  maxWidth,
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Scale: fit crop.width natural px into containerW display px
  // If that would make height exceed maxHeight, constrain by height instead
  const scaleByW = containerW > 0 ? containerW / crop.width : 0;
  const scaleByH = maxHeight ? maxHeight / crop.height : Infinity;
  const scale = Math.min(scaleByW, scaleByH);

  // Actual container height after scaling
  const containerH = scale > 0 ? crop.height * scale : 0;

  const imgW = naturalSize ? naturalSize.w * scale : 0;
  const imgH = naturalSize ? naturalSize.h * scale : 0;
  const imgLeft = -crop.x * scale;
  const imgTop = -crop.y * scale;

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
            height: "auto",
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
