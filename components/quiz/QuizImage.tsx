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

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {/* Cropped and zoomed image */}
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

      {/* Mask overlay */}
      {mask.enabled && (
        <div
          className="absolute inset-0"
          style={getMaskStyle(mask.style)}
        />
      )}
    </div>
  );
}

function getMaskStyle(style: string): React.CSSProperties {
  switch (style) {
    case "black":
      return {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      };
    case "blur":
      return {
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      };
    case "pixel":
      return {
        backdropFilter: "blur(12px) contrast(1.5)",
        WebkitBackdropFilter: "blur(12px) contrast(1.5)",
        imageRendering: "pixelated" as const,
        background:
          "repeating-conic-gradient(rgba(0,0,0,0.1) 0% 25%, transparent 0% 50%) 0 0 / 12px 12px",
      };
    default:
      return {};
  }
}
