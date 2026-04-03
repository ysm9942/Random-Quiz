"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getImageById } from "@/data/images";
import {
  getQuizConfigByImageId,
  getQuizConfigs,
  getQuizSettings,
  saveQuizConfig,
} from "@/data/quiz-configs";
import QuizImage from "@/components/quiz/QuizImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { generateId } from "@/lib/utils";
import { Person, QuizConfig } from "@/types";

interface EditorState {
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  displayMaxWidth: number;
  displayMaxHeight: number;
  answer: Person;
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const image = getImageById(id);
  const existingConfig = getQuizConfigByImageId(id);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [renderedSize, setRenderedSize] = useState({ w: 0, h: 0 });
  const [previewWidth, setPreviewWidth] = useState(0);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<Person | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const [state, setState] = useState<EditorState>(() => {
    if (existingConfig) {
      return {
        cropX: existingConfig.crop.x,
        cropY: existingConfig.crop.y,
        cropW: existingConfig.crop.width,
        cropH: existingConfig.crop.height,
        displayMaxWidth: existingConfig.displayMaxWidth ?? 480,
        displayMaxHeight: existingConfig.displayMaxHeight ?? 220,
        answer: existingConfig.answer,
      };
    }
    return {
      cropX: 100,
      cropY: 200,
      cropW: 500,
      cropH: 150,
      displayMaxWidth: 480,
      displayMaxHeight: 220,
      answer: image?.person ?? "쫀득",
    };
  });

  // Load natural image dimensions
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.onload = () =>
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = image.originalUrl;
  }, [image]);

  // Track rendered image size
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => {
      if (img.clientWidth > 0) {
        setRenderedSize({ w: img.clientWidth, h: img.clientHeight });
      }
    };
    img.addEventListener("load", update);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(img);
    return () => {
      img.removeEventListener("load", update);
      ro.disconnect();
    };
  }, []);

  // Track preview container width
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) setPreviewWidth(el.clientWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dispScale = naturalSize.w > 0 ? renderedSize.w / naturalSize.w : 1;

  // Arrow key fine-tuning
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;
      let handled = true;
      switch (e.key) {
        case "ArrowLeft":
          setState((p) => ({ ...p, cropX: Math.max(0, p.cropX - step) }));
          break;
        case "ArrowRight":
          setState((p) => ({ ...p, cropX: p.cropX + step }));
          break;
        case "ArrowUp":
          setState((p) => ({ ...p, cropY: Math.max(0, p.cropY - step) }));
          break;
        case "ArrowDown":
          setState((p) => ({ ...p, cropY: p.cropY + step }));
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        setSaved(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Drag to select crop area
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dispScale === 0) return;
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const natX = (e.clientX - rect.left) / dispScale;
      const natY = (e.clientY - rect.top) / dispScale;
      dragStartRef.current = { x: natX, y: natY };
      setIsDragging(true);
    },
    [dispScale]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const natX = Math.max(
        0,
        Math.min((e.clientX - rect.left) / dispScale, naturalSize.w)
      );
      const natY = Math.max(
        0,
        Math.min((e.clientY - rect.top) / dispScale, naturalSize.h)
      );
      const start = dragStartRef.current;
      setState((prev) => ({
        ...prev,
        cropX: Math.round(Math.min(start.x, natX)),
        cropY: Math.round(Math.min(start.y, natY)),
        cropW: Math.max(10, Math.round(Math.abs(natX - start.x))),
        cropH: Math.max(10, Math.round(Math.abs(natY - start.y))),
      }));
    };
    const handleUp = () => {
      setIsDragging(false);
      setSaved(false);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dispScale, naturalSize]);

  // Mouse wheel = zoom crop size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 20 : -20;
      setState((p) => ({
        ...p,
        cropW: Math.max(50, p.cropW + delta),
        cropH: Math.max(20, p.cropH + Math.round(delta * (p.cropH / p.cropW))),
      }));
      setSaved(false);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Save to GitHub
  const handleSave = useCallback(async () => {
    if (!image) return;
    setSaving(true);
    setSaveError("");

    const config: QuizConfig = {
      id: existingConfig?.id ?? `quiz-${generateId()}`,
      sourceImageId: image.id,
      answer: state.answer,
      enabled: existingConfig?.enabled ?? true,
      crop: {
        x: state.cropX,
        y: state.cropY,
        width: state.cropW,
        height: state.cropH,
      },
      displayMaxWidth: state.displayMaxWidth,
      displayMaxHeight: state.displayMaxHeight,
      mask: { enabled: false, blurPercent: 0 },
      updatedAt: new Date().toISOString(),
    };
    saveQuizConfig(config);

    // Save to localStorage for instant quiz reflection
    try {
      localStorage.setItem("quiz-configs", JSON.stringify(getQuizConfigs()));
    } catch {}

    try {
      const res = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: getQuizConfigs(),
          settings: getQuizSettings(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(data.error || "저장 실패");
      }
    } catch {
      setSaveError("네트워크 오류");
    } finally {
      setSaving(false);
    }
  }, [image, existingConfig, state]);

  if (!image) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted text-lg">이미지를 찾을 수 없습니다.</p>
          <Button variant="secondary" onClick={() => router.push("/admin")}>
            목록으로 돌아가기
          </Button>
        </div>
      </main>
    );
  }

  // Overlay in displayed pixels
  const overlayLeft = state.cropX * dispScale;
  const overlayTop = state.cropY * dispScale;
  const overlayW = state.cropW * dispScale;
  const overlayH = state.cropH * dispScale;

  // Preview: scale crop area to fill container width, cap height
  const maxPreviewH = 500;
  let previewScale =
    state.cropW > 0 && previewWidth > 0 ? previewWidth / state.cropW : 1;
  if (state.cropH * previewScale > maxPreviewH) {
    previewScale = maxPreviewH / state.cropH;
  }
  const previewHeight = state.cropH * previewScale;

  return (
    <main className="flex-1 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/admin")}
              className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              ← 목록으로
            </button>
            <h1 className="text-2xl font-bold mt-1">문제 편집</h1>
            <p className="text-sm text-muted">{image.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <Badge variant="success">GitHub에 저장됨!</Badge>}
            {existingConfig && <Badge variant="info">기존 설정 있음</Badge>}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreviewAnswer(null);
                setShowPreview(true);
              }}
            >
              퀴즈 미리보기
            </Button>
          </div>
        </div>

        {/* Two Column: Original Image + Enlarged Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Original Image with Drag Crop */}
          <Card>
            <h3 className="text-sm font-semibold text-muted mb-3">
              원본 이미지 — 드래그로 영역 선택
            </h3>
            <div
              ref={containerRef}
              className="relative inline-block cursor-crosshair select-none"
              style={{ lineHeight: 0 }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imgRef}
                src={image.originalUrl}
                alt={image.name}
                className="block rounded-xl"
                style={{
                  maxWidth: "100%",
                  maxHeight: 500,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                draggable={false}
              />
              <div
                className="absolute border-2 border-primary bg-primary/20 pointer-events-none rounded"
                style={{
                  left: overlayLeft,
                  top: overlayTop,
                  width: overlayW,
                  height: overlayH,
                  transition: isDragging ? "none" : "all 0.08s ease-out",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              드래그: 영역 선택 · 방향키: 미세 이동 (Shift: 10px) · 휠: 크기
              조절
            </p>
          </Card>

          {/* Right: Enlarged Crop Preview */}
          <Card>
            <h3 className="text-sm font-semibold text-muted mb-3">
              선택 영역 미리보기
            </h3>
            <div ref={previewContainerRef}>
              {naturalSize.w > 0 && state.cropW > 10 ? (
                <div
                  className="rounded-xl overflow-hidden border border-border mx-auto"
                  style={{
                    width: state.cropW * previewScale,
                    height: previewHeight,
                  }}
                >
                  <img
                    src={image.originalUrl}
                    alt="미리보기"
                    style={{
                      display: "block",
                      width: naturalSize.w * previewScale,
                      height: naturalSize.h * previewScale,
                      transform: `translate(-${state.cropX * previewScale}px, -${state.cropY * previewScale}px)`,
                      maxWidth: "none",
                    }}
                    draggable={false}
                  />
                </div>
              ) : (
                <div
                  className="rounded-xl bg-black/20 border border-border flex items-center justify-center text-muted text-sm"
                  style={{ height: 200 }}
                >
                  드래그로 영역을 선택하세요
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom Center: Answer + Save */}
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-xs text-muted mb-2 text-center">
              정답 선택
            </label>
            <div className="flex gap-3">
              {(["쫀득", "농루트"] as Person[]).map((person) => (
                <button
                  key={person}
                  onClick={() => {
                    setState((p) => ({ ...p, answer: person }));
                    setSaved(false);
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-center transition-all cursor-pointer ${
                    state.answer === person
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-card border border-border hover:border-primary/30"
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
          </div>

          {saveError && (
            <div className="p-2 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger text-center">
              {saveError}
            </div>
          )}
          <Button
            onClick={handleSave}
            variant={saved ? "success" : "primary"}
            size="lg"
            className="w-full"
            disabled={saving}
          >
            {saving ? "저장 중..." : saved ? "GitHub에 저장됨!" : "저장 (GitHub)"}
          </Button>
        </div>
      </div>

      {/* Quiz Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border hover:bg-card-hover transition-colors text-muted hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            <div className="px-6 py-8 space-y-6">
              <ProgressBar current={1} total={1} />

              <div className="flex justify-center">
                <div
                  style={{ width: "100%", maxWidth: state.displayMaxWidth }}
                >
                  <QuizImage
                    imageUrl={image.originalUrl}
                    crop={{
                      x: state.cropX,
                      y: state.cropY,
                      width: state.cropW,
                      height: state.cropH,
                    }}
                    maxHeight={state.displayMaxHeight}
                    mask={{ enabled: false, blurPercent: 0 }}
                    className="shadow-2xl shadow-black/50"
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold">이 사람은 누구일까요?</h2>
                <p className="text-sm text-muted mt-1">문제 1 / 1</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(["쫀득", "농루트"] as Person[]).map((person) => {
                  const isSelected = previewAnswer === person;
                  const isAnswer = state.answer === person;
                  const answered = previewAnswer !== null;

                  let btnClass =
                    "relative py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-300 cursor-pointer ";

                  if (!answered) {
                    btnClass +=
                      "bg-card border-border hover:border-primary hover:bg-card-hover";
                  } else if (isAnswer) {
                    btnClass += "bg-success/10 border-success text-success";
                  } else if (isSelected && !isAnswer) {
                    btnClass += "bg-danger/10 border-danger text-danger";
                  } else {
                    btnClass += "bg-card border-border opacity-50";
                  }

                  return (
                    <button
                      key={person}
                      onClick={() => !answered && setPreviewAnswer(person)}
                      disabled={answered}
                      className={btnClass}
                    >
                      {person}
                      {answered && isAnswer && (
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-success rounded-full flex items-center justify-center text-white text-sm">
                          ✓
                        </span>
                      )}
                      {answered && isSelected && !isAnswer && (
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-danger rounded-full flex items-center justify-center text-white text-sm">
                          ✗
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {previewAnswer !== null && (
                <div className="space-y-4">
                  <div
                    className={`rounded-xl p-4 border text-center ${
                      previewAnswer === state.answer
                        ? "bg-success/5 border-success/30"
                        : "bg-danger/5 border-danger/30"
                    }`}
                  >
                    <span className="text-lg mr-2">
                      {previewAnswer === state.answer ? "🎉" : "😢"}
                    </span>
                    <span
                      className={`font-bold ${
                        previewAnswer === state.answer
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {previewAnswer === state.answer ? "정답!" : "오답!"}
                    </span>
                    <span className="ml-2 text-sm text-muted">
                      정답: {state.answer}
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-border">
                    <img
                      src={image.originalUrl}
                      alt={state.answer}
                      className="w-full h-auto"
                    />
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => setPreviewAnswer(null)}
                  >
                    다시 해보기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
