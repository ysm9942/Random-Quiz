import { QuizConfig, QuizSettings } from "@/types";

let quizSettings: QuizSettings = {
  totalQuestions: 24,
  jjondeukQuestions: 10,
  nongrutQuestions: 14,
};

// crop coords are in NATURAL image pixels.
// x, y = top-left corner of the crop region
// width, height = size of the crop region
// All values need to be configured in the admin editor for each image.
let quizConfigs: QuizConfig[] = [
  { id: "quiz-001", sourceImageId: "img-001", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:00:00Z" },
  { id: "quiz-002", sourceImageId: "img-002", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:05:00Z" },
  { id: "quiz-003", sourceImageId: "img-003", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:10:00Z" },
  { id: "quiz-004", sourceImageId: "img-004", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:15:00Z" },
  { id: "quiz-005", sourceImageId: "img-005", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:20:00Z" },
  { id: "quiz-006", sourceImageId: "img-006", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:25:00Z" },
  { id: "quiz-007", sourceImageId: "img-007", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:30:00Z" },
  { id: "quiz-008", sourceImageId: "img-008", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:35:00Z" },
  { id: "quiz-009", sourceImageId: "img-009", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:40:00Z" },
  { id: "quiz-010", sourceImageId: "img-010", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:45:00Z" },
  { id: "quiz-011", sourceImageId: "img-011", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:50:00Z" },
  { id: "quiz-012", sourceImageId: "img-012", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:55:00Z" },
  { id: "quiz-013", sourceImageId: "img-013", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:00:00Z" },
  { id: "quiz-014", sourceImageId: "img-014", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:05:00Z" },
  { id: "quiz-015", sourceImageId: "img-015", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:10:00Z" },
  { id: "quiz-016", sourceImageId: "img-016", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:15:00Z" },
  { id: "quiz-017", sourceImageId: "img-017", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:20:00Z" },
  { id: "quiz-018", sourceImageId: "img-018", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:25:00Z" },
  { id: "quiz-019", sourceImageId: "img-019", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:30:00Z" },
  { id: "quiz-020", sourceImageId: "img-020", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:35:00Z" },
  { id: "quiz-021", sourceImageId: "img-021", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:40:00Z" },
  { id: "quiz-022", sourceImageId: "img-022", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:45:00Z" },
  { id: "quiz-023", sourceImageId: "img-023", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:50:00Z" },
  { id: "quiz-024", sourceImageId: "img-024", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:55:00Z" },
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

export function setQuizConfigs(configs: QuizConfig[]): void {
  quizConfigs = configs;
}

export function setQuizSettingsData(settings: QuizSettings): void {
  quizSettings = settings;
}
