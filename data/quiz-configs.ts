import { QuizConfig, QuizSettings } from "@/types";

let quizSettings: QuizSettings = {
  totalQuestions: 10,
  jjondeukQuestions: 5,
  nongrutQuestions: 5,
};

let quizConfigs: QuizConfig[] = [
  {
    id: "quiz-001",
    sourceImageId: "img-001",
    answer: "농루트",
    crop: { x: 60, y: 40, width: 200, height: 80 },
    zoom: 1.5,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "quiz-002",
    sourceImageId: "img-003",
    answer: "농루트",
    crop: { x: 100, y: 80, width: 140, height: 100 },
    zoom: 1.8,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:05:00Z",
  },
  {
    id: "quiz-003",
    sourceImageId: "img-005",
    answer: "농루트",
    crop: { x: 90, y: 140, width: 160, height: 80 },
    zoom: 1.6,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:10:00Z",
  },
  {
    id: "quiz-004",
    sourceImageId: "img-007",
    answer: "농루트",
    crop: { x: 40, y: 20, width: 260, height: 220 },
    zoom: 1.2,
    mask: { enabled: true, blurPercent: 40 },
    updatedAt: "2025-01-15T10:15:00Z",
  },
  {
    id: "quiz-005",
    sourceImageId: "img-009",
    answer: "농루트",
    crop: { x: 70, y: 50, width: 180, height: 70 },
    zoom: 1.7,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:20:00Z",
  },
  {
    id: "quiz-006",
    sourceImageId: "img-011",
    answer: "농루트",
    crop: { x: 50, y: 30, width: 240, height: 200 },
    zoom: 1.3,
    mask: { enabled: true, blurPercent: 60 },
    updatedAt: "2025-01-15T10:25:00Z",
  },
  {
    id: "quiz-007",
    sourceImageId: "img-013",
    answer: "농루트",
    crop: { x: 110, y: 90, width: 120, height: 90 },
    zoom: 2.0,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "quiz-008",
    sourceImageId: "img-015",
    answer: "쫀득",
    crop: { x: 80, y: 60, width: 200, height: 80 },
    zoom: 1.5,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:35:00Z",
  },
  {
    id: "quiz-009",
    sourceImageId: "img-017",
    answer: "쫀득",
    crop: { x: 100, y: 150, width: 150, height: 80 },
    zoom: 1.6,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:40:00Z",
  },
  {
    id: "quiz-010",
    sourceImageId: "img-019",
    answer: "쫀득",
    crop: { x: 50, y: 30, width: 260, height: 220 },
    zoom: 1.2,
    mask: { enabled: true, blurPercent: 50 },
    updatedAt: "2025-01-15T10:45:00Z",
  },
  {
    id: "quiz-011",
    sourceImageId: "img-021",
    answer: "쫀득",
    crop: { x: 110, y: 90, width: 130, height: 100 },
    zoom: 1.8,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T10:50:00Z",
  },
  {
    id: "quiz-012",
    sourceImageId: "img-023",
    answer: "쫀득",
    crop: { x: 60, y: 40, width: 240, height: 200 },
    zoom: 1.3,
    mask: { enabled: true, blurPercent: 70 },
    updatedAt: "2025-01-15T10:55:00Z",
  },
];

export function getQuizSettings(): QuizSettings {
  return { ...quizSettings };
}

export function saveQuizSettings(settings: QuizSettings): void {
  quizSettings = { ...settings };
}

export function getQuizConfigs(): QuizConfig[] {
  return [...quizConfigs];
}

export function getQuizConfigById(id: string): QuizConfig | undefined {
  return quizConfigs.find((q) => q.id === id);
}

export function getQuizConfigByImageId(imageId: string): QuizConfig | undefined {
  return quizConfigs.find((q) => q.sourceImageId === imageId);
}

export function saveQuizConfig(config: QuizConfig): void {
  const index = quizConfigs.findIndex((q) => q.id === config.id);
  if (index >= 0) {
    quizConfigs[index] = { ...config, updatedAt: new Date().toISOString() };
  } else {
    quizConfigs.push({ ...config, updatedAt: new Date().toISOString() });
  }
}

export function deleteQuizConfig(id: string): void {
  quizConfigs = quizConfigs.filter((q) => q.id !== id);
}
