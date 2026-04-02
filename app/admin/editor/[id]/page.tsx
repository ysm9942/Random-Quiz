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
  // All crop coordinates in NATURAL image pixels
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

  // Natural image dimensions (loaded once)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  // Rendered image dimensions (updated by ResizeObserver)
  const [renderedSize, setRenderedSize] = useState({ w: 0, h: 0 });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

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
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
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

  // dispScale: ratio of rendered to natural pixels
  const dispScale = naturalSize.w > 0 ? renderedSize.w / naturalSize.w : 1;

  // Arrow key fine-tuning (1 natural px per step, Shift = 10)
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

  // Click on image = set crop center (convert displayed px → natural px)
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dispScale === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX_disp = e.clientX - rect.left;
      const clickY_disp = e.clientY - rect.top;
      const clickX_nat = clickX_disp / dispScale;
      const clickY_nat = clickY_disp / dispScale;
      setState((prev) => ({
        ...prev,
        cropX: Math.max(0, Math.round(clickX_nat - prev.cropW / 2)),
        cropY: Math.max(0, Math.round(clickY_nat - prev.cropH / 2)),
      }));
      setSaved(false);
    },
    [dispScale]
  );

  // Mouse wheel = zoom the editor view (adjusts crop size)
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

  // Overlay rect in displayed pixels
  const overlayLeft = state.cropX * dispScale;
  const overlayTop = state.cropY * dispScale;
  const overlayW = state.cropW * dispScale;
  const overlayH = state.cropH * dispScale;

  const maxNatW = naturalSize.w || 2000;
  const maxNatH = naturalSize.h || 2000;

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
                원본 이미지 — 클릭으로 크롭 위치 지정
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
                {/* Crop overlay (in displayed pixels) */}
                <div
                  className="absolute border-2 border-primary bg-primary/20 pointer-events-none rounded"
                  style={{
                    left: overlayLeft,
                    top: overlayTop,
                    width: overlayW,
                    height: overlayH,
                    transition: "all 0.08s ease-out",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                클릭: 위치 이동 · 방향키: 미세 조정 (Shift: 10px) · 휠: 크기 조절
              </p>
            </Card>

            {/* Crop Size Controls */}
            <Card>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>가로 (Width)</span>
                    <span>{state.cropW}px</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={maxNatW}
                    step={1}
                    value={state.cropW}
                    onChange={(e) => {
                      setState((p) => ({ ...p, cropW: parseInt(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>세로 (Height)</span>
                    <span>{state.cropH}px</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={maxNatH}
                    step={1}
                    value={state.cropH}
                    onChange={(e) => {
                      setState((p) => ({ ...p, cropH: parseInt(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="pt-2 border-t border-border space-y-3">
                  <p className="text-xs font-semibold text-muted">퀴즈 표시 크기</p>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>최대 가로</span>
                      <span>{state.displayMaxWidth}px</span>
                    </div>
                    <input
                      type="range" min={150} max={800} step={10}
                      value={state.displayMaxWidth}
                      onChange={(e) => { setState((p) => ({ ...p, displayMaxWidth: parseInt(e.target.value) })); setSaved(false); }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>최대 세로</span>
                      <span>{state.displayMaxHeight}px</span>
                    </div>
                    <input
                      type="range" min={50} max={500} step={10}
                      value={state.displayMaxHeight}
                      onChange={(e) => { setState((p) => ({ ...p, displayMaxHeight: parseInt(e.target.value) })); setSaved(false); }}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted pt-2 border-t border-border font-mono">
                  <div>X: <span className="text-foreground">{state.cropX}</span></div>
                  <div>Y: <span className="text-foreground">{state.cropY}</span></div>
                  <div>W: <span className="text-foreground">{state.cropW}</span></div>
                  <div>H: <span className="text-foreground">{state.cropH}</span></div>
                  {naturalSize.w > 0 && (
                    <div className="col-span-2">원본: <span className="text-foreground">{naturalSize.w}×{naturalSize.h}</span></div>
                  )}
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

          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <h3 className="text-sm font-semibold text-muted mb-4">미리보기</h3>

              <div className="bg-background rounded-xl p-4 space-y-4">
                <QuizImage
                  imageUrl={image.originalUrl}
                  crop={{ x: state.cropX, y: state.cropY, width: state.cropW, height: state.cropH }}
                  maxWidth={state.displayMaxWidth}
                  maxHeight={state.displayMaxHeight}
                  mask={{ enabled: false, blurPercent: 0 }}
                  className="shadow-xl"
                />

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
                className="w-full mt-4"
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
