import { QuizConfig } from "@/types";

let quizConfigs: QuizConfig[] = [
  {
    id: "quiz-001",
    sourceImageId: "img-001",
    answer: "농루트",
    mode: "eyes",
    crop: { x: 60, y: 40, width: 200, height: 80 },
    zoom: 1.5,
    mask: { enabled: false, style: "black" },
    explanation: "눈매를 잘 보면 농루트의 특징이 보여요!",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "quiz-002",
    sourceImageId: "img-003",
    answer: "농루트",
    mode: "nose",
    crop: { x: 100, y: 80, width: 140, height: 100 },
    zoom: 1.8,
    mask: { enabled: false, style: "black" },
    explanation: "코 라인을 보면 농루트란 걸 알 수 있죠!",
    updatedAt: "2025-01-15T10:05:00Z",
  },
  {
    id: "quiz-003",
    sourceImageId: "img-005",
    answer: "농루트",
    mode: "mouth",
    crop: { x: 90, y: 140, width: 160, height: 80 },
    zoom: 1.6,
    mask: { enabled: false, style: "black" },
    explanation: "입 모양이 농루트의 특징이에요!",
    updatedAt: "2025-01-15T10:10:00Z",
  },
  {
    id: "quiz-004",
    sourceImageId: "img-007",
    answer: "농루트",
    mode: "partial_mask",
    crop: { x: 40, y: 20, width: 260, height: 220 },
    zoom: 1.2,
    mask: { enabled: true, style: "blur" },
    explanation: "블러 처리에도 농루트를 알아보다니!",
    updatedAt: "2025-01-15T10:15:00Z",
  },
  {
    id: "quiz-005",
    sourceImageId: "img-009",
    answer: "농루트",
    mode: "eyes",
    crop: { x: 70, y: 50, width: 180, height: 70 },
    zoom: 1.7,
    mask: { enabled: false, style: "black" },
    explanation: "농루트의 눈은 이런 느낌이죠!",
    updatedAt: "2025-01-15T10:20:00Z",
  },
  {
    id: "quiz-006",
    sourceImageId: "img-011",
    answer: "농루트",
    mode: "partial_mask",
    crop: { x: 50, y: 30, width: 240, height: 200 },
    zoom: 1.3,
    mask: { enabled: true, style: "pixel" },
    explanation: "픽셀 처리 속에서도 농루트를 찾았네요!",
    updatedAt: "2025-01-15T10:25:00Z",
  },
  {
    id: "quiz-007",
    sourceImageId: "img-013",
    answer: "농루트",
    mode: "nose",
    crop: { x: 110, y: 90, width: 120, height: 90 },
    zoom: 2.0,
    mask: { enabled: false, style: "black" },
    explanation: "확대된 코만 봐도 농루트!",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "quiz-008",
    sourceImageId: "img-015",
    answer: "쫀득",
    mode: "eyes",
    crop: { x: 80, y: 60, width: 200, height: 80 },
    zoom: 1.5,
    mask: { enabled: false, style: "black" },
    explanation: "부드러운 눈매가 쫀득의 포인트!",
    updatedAt: "2025-01-15T10:35:00Z",
  },
  {
    id: "quiz-009",
    sourceImageId: "img-017",
    answer: "쫀득",
    mode: "mouth",
    crop: { x: 100, y: 150, width: 150, height: 80 },
    zoom: 1.6,
    mask: { enabled: false, style: "black" },
    explanation: "미소 지을 때 입꼬리가 올라가는 게 쫀득!",
    updatedAt: "2025-01-15T10:40:00Z",
  },
  {
    id: "quiz-010",
    sourceImageId: "img-019",
    answer: "쫀득",
    mode: "partial_mask",
    crop: { x: 50, y: 30, width: 260, height: 220 },
    zoom: 1.2,
    mask: { enabled: true, style: "blur" },
    explanation: "윤곽만으로 쫀득을 맞히다니 대단해요!",
    updatedAt: "2025-01-15T10:45:00Z",
  },
  {
    id: "quiz-011",
    sourceImageId: "img-021",
    answer: "쫀득",
    mode: "nose",
    crop: { x: 110, y: 90, width: 130, height: 100 },
    zoom: 1.8,
    mask: { enabled: false, style: "black" },
    explanation: "코 라인으로 쫀득을 구분할 수 있어요!",
    updatedAt: "2025-01-15T10:50:00Z",
  },
  {
    id: "quiz-012",
    sourceImageId: "img-023",
    answer: "쫀득",
    mode: "partial_mask",
    crop: { x: 60, y: 40, width: 240, height: 200 },
    zoom: 1.3,
    mask: { enabled: true, style: "pixel" },
    explanation: "픽셀 속에서도 쫀득을 찾는 진정한 팬!",
    updatedAt: "2025-01-15T10:55:00Z",
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
