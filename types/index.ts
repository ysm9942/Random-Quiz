export type Person = "쫀득" | "농루트";

export interface CropRegion {
  x: number;
  y: number;
  size: number;
}

export interface MaskConfig {
  enabled: boolean;
  blurPercent: number;
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
  crop: CropRegion;
  zoom: number;
  mask: MaskConfig;
  updatedAt: string;
}

export interface QuizSettings {
  totalQuestions: number;
  jjondeukQuestions: number;
  nongrutQuestions: number;
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
