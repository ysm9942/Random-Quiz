import { QuizConfig, QuizSettings } from "@/types";

let quizSettings: QuizSettings = {
  totalQuestions: 24,
  jjondeukQuestions: 10,
  nongrutQuestions: 14,
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
  {
    id: "quiz-013",
    sourceImageId: "img-002",
    answer: "농루트",
    crop: { x: 70, y: 50, width: 190, height: 90 },
    zoom: 1.4,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:00:00Z",
  },
  {
    id: "quiz-014",
    sourceImageId: "img-004",
    answer: "농루트",
    crop: { x: 80, y: 60, width: 170, height: 100 },
    zoom: 1.6,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:05:00Z",
  },
  {
    id: "quiz-015",
    sourceImageId: "img-006",
    answer: "농루트",
    crop: { x: 60, y: 45, width: 210, height: 110 },
    zoom: 1.5,
    mask: { enabled: true, blurPercent: 30 },
    updatedAt: "2025-01-15T11:10:00Z",
  },
  {
    id: "quiz-016",
    sourceImageId: "img-008",
    answer: "농루트",
    crop: { x: 90, y: 70, width: 150, height: 80 },
    zoom: 1.7,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:15:00Z",
  },
  {
    id: "quiz-017",
    sourceImageId: "img-010",
    answer: "농루트",
    crop: { x: 55, y: 35, width: 230, height: 180 },
    zoom: 1.3,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:20:00Z",
  },
  {
    id: "quiz-018",
    sourceImageId: "img-012",
    answer: "농루트",
    crop: { x: 100, y: 80, width: 160, height: 90 },
    zoom: 1.8,
    mask: { enabled: true, blurPercent: 45 },
    updatedAt: "2025-01-15T11:25:00Z",
  },
  {
    id: "quiz-019",
    sourceImageId: "img-014",
    answer: "농루트",
    crop: { x: 65, y: 55, width: 200, height: 100 },
    zoom: 1.5,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:30:00Z",
  },
  {
    id: "quiz-020",
    sourceImageId: "img-016",
    answer: "쫀득",
    crop: { x: 75, y: 55, width: 180, height: 90 },
    zoom: 1.6,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:35:00Z",
  },
  {
    id: "quiz-021",
    sourceImageId: "img-018",
    answer: "쫀득",
    crop: { x: 85, y: 65, width: 170, height: 85 },
    zoom: 1.7,
    mask: { enabled: true, blurPercent: 35 },
    updatedAt: "2025-01-15T11:40:00Z",
  },
  {
    id: "quiz-022",
    sourceImageId: "img-020",
    answer: "쫀득",
    crop: { x: 60, y: 40, width: 220, height: 160 },
    zoom: 1.4,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:45:00Z",
  },
  {
    id: "quiz-023",
    sourceImageId: "img-022",
    answer: "쫀득",
    crop: { x: 95, y: 75, width: 160, height: 80 },
    zoom: 1.8,
    mask: { enabled: false, blurPercent: 0 },
    updatedAt: "2025-01-15T11:50:00Z",
  },
  {
    id: "quiz-024",
    sourceImageId: "img-024",
    answer: "쫀득",
    crop: { x: 70, y: 50, width: 200, height: 150 },
    zoom: 1.5,
    mask: { enabled: true, blurPercent: 55 },
    updatedAt: "2025-01-15T11:55:00Z",
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
