import { QuizConfig } from "@/types";

let quizConfigs: QuizConfig[] = [
  {
    id: "quiz-001",
    sourceImageId: "img-001",
    answer: "쫀득",
    mode: "eyes",
    crop: { x: 80, y: 60, width: 200, height: 80 },
    zoom: 1.5,
    mask: { enabled: false, style: "black" },
    explanation: "눈매가 부드러운 게 쫀득의 특징이에요!",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "quiz-002",
    sourceImageId: "img-004",
    answer: "농루트",
    mode: "nose",
    crop: { x: 120, y: 100, width: 120, height: 100 },
    zoom: 2.0,
    mask: { enabled: false, style: "black" },
    explanation: "코 라인이 샤프한 게 농루트의 특징!",
    updatedAt: "2025-01-15T10:05:00Z",
  },
  {
    id: "quiz-003",
    sourceImageId: "img-002",
    answer: "쫀득",
    mode: "mouth",
    crop: { x: 100, y: 160, width: 160, height: 80 },
    zoom: 1.8,
    mask: { enabled: false, style: "black" },
    explanation: "미소 지을 때 입꼬리가 올라가는 게 쫀득!",
    updatedAt: "2025-01-15T10:10:00Z",
  },
  {
    id: "quiz-004",
    sourceImageId: "img-005",
    answer: "농루트",
    mode: "partial_mask",
    crop: { x: 50, y: 30, width: 260, height: 220 },
    zoom: 1.2,
    mask: { enabled: true, style: "blur" },
    explanation: "얼굴 윤곽만 봐도 농루트를 알 수 있다면 진정한 팬!",
    updatedAt: "2025-01-15T10:15:00Z",
  },
  {
    id: "quiz-005",
    sourceImageId: "img-003",
    answer: "쫀득",
    mode: "partial_mask",
    crop: { x: 60, y: 40, width: 240, height: 200 },
    zoom: 1.3,
    mask: { enabled: true, style: "pixel" },
    explanation: "픽셀 처리된 상태에서도 맞히다니 대단해요!",
    updatedAt: "2025-01-15T10:20:00Z",
  },
  {
    id: "quiz-006",
    sourceImageId: "img-006",
    answer: "농루트",
    mode: "eyes",
    crop: { x: 90, y: 70, width: 180, height: 70 },
    zoom: 1.6,
    mask: { enabled: false, style: "black" },
    explanation: "농루트의 눈은 조금 더 날카로운 느낌이죠!",
    updatedAt: "2025-01-15T10:25:00Z",
  },
];

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
