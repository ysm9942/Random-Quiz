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
import { generateId } from "@/lib/utils";
import { Person, QuizConfig } from "@/types";

interface EditorState {
  cropX: number;
  cropY: number;
  cropSize: number;
  zoom: number;
  maskEnabled: boolean;
  blurPercent: number;
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
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [state, setState] = useState<EditorState>(() => {
    if (existingConfig) {
      return {
        cropX: existingConfig.crop.x,
        cropY: existingConfig.crop.y,
        cropSize: existingConfig.crop.size,
        zoom: existingConfig.zoom,
        maskEnabled: existingConfig.mask.enabled,
        blurPercent: existingConfig.mask.blurPercent,
        answer: existingConfig.answer,
      };
    }
    return {
      cropX: 50,
      cropY: 50,
      cropSize: 150,
      zoom: 1.0,
      maskEnabled: false,
      blurPercent: 30,
      answer: image?.person ?? "쫀득",
    };
  });

  // Track rendered image size
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => {
      if (img.naturalWidth > 0) {
        setImgSize({ w: img.clientWidth, h: img.clientHeight });
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

  // Click on image = set crop center
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = Math.round(e.clientX - rect.left);
      const clickY = Math.round(e.clientY - rect.top);
      const half = Math.round(state.cropSize / 2);
      setState((prev) => ({
        ...prev,
        cropX: Math.max(0, clickX - half),
        cropY: Math.max(0, clickY - half),
      }));
      setSaved(false);
    },
    [state.cropSize]
  );

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setState((p) => ({
        ...p,
        zoom: Math.round(Math.min(4, Math.max(0.5, p.zoom + delta)) * 10) / 10,
      }));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Save to GitHub
  const handleSave = useCallback(async () => {
    if (!image) return;
    setSaving(true);
    setSaveError("");

    // Save locally first
    const config: QuizConfig = {
      id: existingConfig?.id ?? `quiz-${generateId()}`,
      sourceImageId: image.id,
      answer: state.answer,
      crop: { x: state.cropX, y: state.cropY, size: state.cropSize },
      zoom: state.zoom,
      mask: { enabled: state.maskEnabled, blurPercent: state.blurPercent },
      updatedAt: new Date().toISOString(),
    };
    saveQuizConfig(config);

    // Push to GitHub
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

  const maxDim = Math.min(imgSize.w || 600, imgSize.h || 400);

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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="space-y-6">
            {/* Image + Click */}
            <Card>
              <h3 className="text-sm font-semibold text-muted mb-3">
                원본 이미지
              </h3>
              <div
                ref={containerRef}
                className="relative inline-block cursor-crosshair select-none"
                style={{ lineHeight: 0 }}
                onClick={handleImageClick}
              >
                <img
                  ref={imgRef}
                  src={image.originalUrl}
                  alt={image.name}
                  className="block rounded-xl"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 450,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
                {/* Square crop overlay */}
                <div
                  className="absolute border-2 border-primary bg-primary/20 pointer-events-none rounded"
                  style={{
                    left: state.cropX,
                    top: state.cropY,
                    width: state.cropSize,
                    height: state.cropSize,
                    transition: "all 0.1s ease-out",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                클릭: 위치 이동 · 방향키: 미세 조정 (Shift+방향키: 10px) · 휠: 줌
              </p>
            </Card>

            {/* Crop Size */}
            <Card>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>영역 크기</span>
                    <span>{state.cropSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={maxDim || 400}
                    step={1}
                    value={state.cropSize}
                    onChange={(e) => {
                      setState((p) => ({ ...p, cropSize: parseInt(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>확대 (Zoom)</span>
                    <span>{state.zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={4}
                    step={0.1}
                    value={state.zoom}
                    onChange={(e) => {
                      setState((p) => ({ ...p, zoom: parseFloat(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            {/* Answer */}
            <Card>
              <label className="block text-xs text-muted mb-2">정답</label>
              <div className="flex gap-2">
                {(["쫀득", "농루트"] as Person[]).map((person) => (
                  <button
                    key={person}
                    onClick={() => {
                      setState((p) => ({ ...p, answer: person }));
                      setSaved(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm text-center transition-all cursor-pointer ${
                      state.answer === person
                        ? "bg-primary text-white"
                        : "bg-background border border-border hover:border-primary/30"
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            </Card>

            {/* Blur */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted">블러 처리</h3>
                <button
                  onClick={() => {
                    setState((p) => ({ ...p, maskEnabled: !p.maskEnabled }));
                    setSaved(false);
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    state.maskEnabled ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      state.maskEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {state.maskEnabled && (
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>블러 강도</span>
                    <span>{state.blurPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={state.blurPercent}
                    onChange={(e) => {
                      setState((p) => ({ ...p, blurPercent: parseInt(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <h3 className="text-sm font-semibold text-muted mb-4">미리보기</h3>

              <div className="bg-background rounded-xl p-6 space-y-4">
                <div className="flex justify-center">
                  <QuizImage
                    imageUrl={image.originalUrl}
                    crop={{ x: state.cropX, y: state.cropY, size: state.cropSize }}
                    zoom={state.zoom}
                    mask={{ enabled: state.maskEnabled, blurPercent: state.blurPercent }}
                    className="shadow-xl"
                  />
                </div>

                <div className="text-center">
                  <p className="font-bold">이 사람은 누구일까요?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(["쫀득", "농루트"] as Person[]).map((person) => (
                    <div
                      key={person}
                      className={`py-3 text-center rounded-xl border-2 text-sm font-bold ${
                        person === state.answer
                          ? "border-success bg-success/10 text-success"
                          : "border-border bg-card text-muted"
                      }`}
                    >
                      {person}
                      {person === state.answer && " ✓"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">정답</span>
                  <span>{state.answer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">줌</span>
                  <span>{state.zoom.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">블러</span>
                  <span>{state.maskEnabled ? `${state.blurPercent}%` : "없음"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">크롭</span>
                  <span className="font-mono text-xs">
                    ({state.cropX}, {state.cropY}) {state.cropSize}px
                  </span>
                </div>
              </div>

              {/* Save */}
              {saveError && (
                <div className="mt-3 p-2 bg-danger/10 border border-danger/30 rounded-lg text-xs text-danger">
                  {saveError}
                </div>
              )}
              <Button
                onClick={handleSave}
                variant={saved ? "success" : "primary"}
                size="lg"
                className="w-full mt-6"
                disabled={saving}
              >
                {saving ? "저장 중..." : saved ? "GitHub에 저장됨!" : "저장 (GitHub)"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
