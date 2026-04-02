"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getImageById } from "@/data/images";
import {
  getQuizConfigByImageId,
  saveQuizConfig,
} from "@/data/quiz-configs";
import QuizImage from "@/components/quiz/QuizImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { generateId } from "@/lib/utils";
import {
  Person,
  CropRegion,
  QuizConfig,
} from "@/types";

interface EditorState {
  crop: CropRegion;
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saved, setSaved] = useState(false);

  const [state, setState] = useState<EditorState>(() => {
    if (existingConfig) {
      return {
        crop: { ...existingConfig.crop },
        zoom: existingConfig.zoom,
        maskEnabled: existingConfig.mask.enabled,
        blurPercent: existingConfig.mask.blurPercent,
        answer: existingConfig.answer,
      };
    }
    return {
      crop: { x: 50, y: 50, width: 200, height: 150 },
      zoom: 1.0,
      maskEnabled: false,
      blurPercent: 30,
      answer: image?.person ?? "쫀득",
    };
  });

  const updateField = useCallback(
    <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
    },
    []
  );

  const updateCrop = useCallback(
    <K extends keyof CropRegion>(key: K, value: number) => {
      setState((prev) => ({
        ...prev,
        crop: { ...prev.crop, [key]: value },
      }));
      setSaved(false);
    },
    []
  );

  // Convert mouse position to image-relative coordinates
  const getImageRelativePos = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current || !imgRef.current) return { x: 0, y: 0 };
      const imgRect = imgRef.current.getBoundingClientRect();
      return {
        x: Math.round(clientX - imgRect.left),
        y: Math.round(clientY - imgRect.top),
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getImageRelativePos(e.clientX, e.clientY);
      setIsDragging(true);
      setDragStart(pos);
    },
    [getImageRelativePos]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const pos = getImageRelativePos(e.clientX, e.clientY);

      const x = Math.max(0, Math.min(dragStart.x, pos.x));
      const y = Math.max(0, Math.min(dragStart.y, pos.y));
      const width = Math.abs(pos.x - dragStart.x);
      const height = Math.abs(pos.y - dragStart.y);

      setState((prev) => ({
        ...prev,
        crop: {
          x,
          y,
          width: Math.max(20, width),
          height: Math.max(20, height),
        },
      }));
    },
    [isDragging, dragStart, getImageRelativePos]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalUp);
    return () => window.removeEventListener("mouseup", handleGlobalUp);
  }, []);

  const handleSave = useCallback(() => {
    if (!image) return;

    const config: QuizConfig = {
      id: existingConfig?.id ?? `quiz-${generateId()}`,
      sourceImageId: image.id,
      answer: state.answer,
      crop: { ...state.crop },
      zoom: state.zoom,
      mask: {
        enabled: state.maskEnabled,
        blurPercent: state.blurPercent,
      },
      updatedAt: new Date().toISOString(),
    };

    saveQuizConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            {saved && <Badge variant="success">저장됨!</Badge>}
            {existingConfig && <Badge variant="info">기존 설정 있음</Badge>}
          </div>
        </div>

        {/* Main layout: Left = Editor, Right = Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="space-y-6">
            {/* Image Canvas */}
            <Card>
              <h3 className="text-sm font-semibold text-muted mb-3">
                원본 이미지 (드래그로 영역 지정)
              </h3>
              <div
                ref={canvasRef}
                className="relative bg-black rounded-xl overflow-hidden cursor-crosshair select-none inline-block"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={image.originalUrl}
                  alt={image.name}
                  className="block max-w-full h-auto"
                  style={{ maxHeight: 400 }}
                  draggable={false}
                />
                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
                  style={{
                    left: state.crop.x,
                    top: state.crop.y,
                    width: state.crop.width,
                    height: state.crop.height,
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                    {state.crop.width} x {state.crop.height}
                  </div>
                </div>
              </div>
            </Card>

            {/* Crop Controls */}
            <Card>
              <h3 className="text-sm font-semibold text-muted mb-3">
                Crop 좌표
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ["x", "X"],
                    ["y", "Y"],
                    ["width", "너비"],
                    ["height", "높이"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs text-muted mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={state.crop[key]}
                      onChange={(e) =>
                        updateCrop(key, parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Answer */}
            <Card>
              <label className="block text-xs text-muted mb-2">정답</label>
              <div className="flex gap-2">
                {(["쫀득", "농루트"] as Person[]).map((person) => (
                  <button
                    key={person}
                    onClick={() => updateField("answer", person)}
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

            {/* Zoom */}
            <Card>
              <h3 className="text-sm font-semibold text-muted mb-3">
                확대 (Zoom): {state.zoom.toFixed(1)}x
              </h3>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.1}
                value={state.zoom}
                onChange={(e) =>
                  updateField("zoom", parseFloat(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0.5x</span>
                <span>4.0x</span>
              </div>
            </Card>

            {/* Blur Mask */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted">
                  블러 처리
                </h3>
                <button
                  onClick={() =>
                    updateField("maskEnabled", !state.maskEnabled)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    state.maskEnabled ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      state.maskEnabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
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
                    onChange={(e) =>
                      updateField("blurPercent", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <h3 className="text-sm font-semibold text-muted mb-4">
                미리보기
              </h3>

              <div className="bg-background rounded-xl p-6 space-y-4">
                <div className="text-center text-xs text-muted">
                  퀴즈 화면 미리보기
                </div>

                <div className="flex justify-center">
                  <QuizImage
                    imageUrl={image.originalUrl}
                    crop={state.crop}
                    zoom={state.zoom}
                    mask={{
                      enabled: state.maskEnabled,
                      blurPercent: state.blurPercent,
                    }}
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

              {/* Config Summary */}
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
                  <span>
                    {state.maskEnabled
                      ? `${state.blurPercent}%`
                      : "없음"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">크롭</span>
                  <span className="font-mono text-xs">
                    {state.crop.x},{state.crop.y} {state.crop.width}x
                    {state.crop.height}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                variant={saved ? "success" : "primary"}
                size="lg"
                className="w-full mt-6"
              >
                {saved ? "저장 완료!" : "설정 저장"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
