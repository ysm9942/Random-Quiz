export type Person = "쫀득" | "농루트";

export type QuizMode = "eyes" | "nose" | "mouth" | "partial_mask";

export type MaskStyle = "black" | "blur" | "pixel";

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MaskConfig {
  enabled: boolean;
  style: MaskStyle;
}

export interface SourceImage {
  id: string;
  person: Person;
  name: string;
  originalUrl: string;
  thumbnailUrl: string;
  tags?: string[];
}

export interface QuizConfig {
  id: string;
  sourceImageId: string;
  answer: Person;
  mode: QuizMode;
  crop: CropRegion;
  zoom: number;
  mask: MaskConfig;
  explanation: string;
  updatedAt: string;
}

export interface QuizQuestion {
  config: QuizConfig;
  image: SourceImage;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionId: string;
    selected: Person;
    correct: boolean;
  }[];
}

export type GradeBadge = {
  label: string;
  emoji: string;
  color: string;
  description: string;
};
