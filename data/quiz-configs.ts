import { QuizConfig, QuizSettings } from "@/types";

let quizSettings: QuizSettings = {
  totalQuestions: 24,
  jjondeukQuestions: 10,
  nongrutQuestions: 14,
  quizMaxWidth: 800,
  quizMaxHeight: 80,
};

// crop coords are in NATURAL image pixels.
// x, y = top-left corner of the crop region
// width, height = size of the crop region
// All values need to be configured in the admin editor for each image.
let quizConfigs: QuizConfig[] = [
  { id: "quiz-001", sourceImageId: "img-001", answer: "농루트", enabled: true, crop: { x: 431, y: 404, width: 92, height: 54 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:01:39.285Z" },
  { id: "quiz-002", sourceImageId: "img-002", answer: "농루트", enabled: false, crop: { x: 23, y: 130, width: 830, height: 802 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T01:42:06.729Z" },
  { id: "quiz-003", sourceImageId: "img-003", answer: "농루트", enabled: true, crop: { x: 407, y: 725, width: 212, height: 81 }, displayMaxWidth: 480, displayMaxHeight: 50, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:06:09.158Z" },
  { id: "quiz-004", sourceImageId: "img-004", answer: "농루트", enabled: true, crop: { x: 609, y: 210, width: 321, height: 55 }, displayMaxWidth: 480, displayMaxHeight: 100, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:02:04.509Z" },
  { id: "quiz-005", sourceImageId: "img-005", answer: "농루트", enabled: true, crop: { x: 848, y: 1920, width: 550, height: 183 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:16:06.593Z" },
  { id: "quiz-006", sourceImageId: "img-006", answer: "농루트", enabled: true, crop: { x: 1432, y: 1400, width: 704, height: 208 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:58:36.985Z" },
  { id: "quiz-007", sourceImageId: "img-007", answer: "농루트", enabled: true, crop: { x: 1059, y: 1091, width: 645, height: 451 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:07:06.747Z" },
  { id: "quiz-008", sourceImageId: "img-008", answer: "농루트", enabled: true, crop: { x: 1063, y: 336, width: 130, height: 30 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:01:42.614Z" },
  { id: "quiz-009", sourceImageId: "img-009", answer: "농루트", enabled: false, crop: { x: 1046, y: 2132, width: 311, height: 144 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:59:39.060Z" },
  { id: "quiz-010", sourceImageId: "img-010", answer: "농루트", enabled: true, crop: { x: 3387, y: 1800, width: 964, height: 283 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:08:55.120Z" },
  { id: "quiz-011", sourceImageId: "img-011", answer: "농루트", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T10:50:00Z" },
  { id: "quiz-012", sourceImageId: "img-012", answer: "농루트", enabled: true, crop: { x: 1318, y: 1206, width: 136, height: 112 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:08:01.678Z" },
  { id: "quiz-013", sourceImageId: "img-013", answer: "농루트", enabled: true, crop: { x: 551, y: 288, width: 217, height: 75 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:59:50.536Z" },
  { id: "quiz-014", sourceImageId: "img-014", answer: "농루트", enabled: true, crop: { x: 103, y: 107, width: 41, height: 13 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:56:39.975Z" },
  { id: "quiz-015", sourceImageId: "img-015", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:10:00Z" },
  { id: "quiz-016", sourceImageId: "img-016", answer: "쫀득", enabled: true, crop: { x: 1386, y: 1065, width: 255, height: 139 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:05:10.283Z" },
  { id: "quiz-017", sourceImageId: "img-017", answer: "쫀득", enabled: true, crop: { x: 1377, y: 1215, width: 392, height: 156 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:16:32.262Z" },
  { id: "quiz-018", sourceImageId: "img-018", answer: "쫀득", enabled: true, crop: { x: 950, y: 904, width: 588, height: 334 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T03:09:48.921Z" },
  { id: "quiz-019", sourceImageId: "img-019", answer: "쫀득", enabled: true, crop: { x: 1048, y: 939, width: 415, height: 225 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:57:31.973Z" },
  { id: "quiz-020", sourceImageId: "img-020", answer: "쫀득", enabled: true, crop: { x: 0, y: 0, width: 500, height: 200 }, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2025-01-15T11:35:00Z" },
  { id: "quiz-021", sourceImageId: "img-021", answer: "쫀득", enabled: true, crop: { x: 718, y: 954, width: 783, height: 159 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:03:38.343Z" },
  { id: "quiz-022", sourceImageId: "img-022", answer: "쫀득", enabled: true, crop: { x: 947, y: 773, width: 481, height: 148 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:04:25.697Z" },
  { id: "quiz-023", sourceImageId: "img-023", answer: "쫀득", enabled: true, crop: { x: 1306, y: 1116, width: 934, height: 197 }, displayMaxWidth: 480, displayMaxHeight: 220, mask: { enabled: false, blurPercent: 0 }, updatedAt: "2026-04-03T02:17:16.676Z" },
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
