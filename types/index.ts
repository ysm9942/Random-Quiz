export type Person = "쫀득" | "농루트";

export interface CropRegion {
  x: number;      // left edge in natural image pixels
  y: number;      // top edge in natural image pixels
  width: number;  // crop width in natural image pixels
  height: number; // crop height in natural image pixels
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
  enabled: boolean;  // whether this quiz appears in the pool
  crop: CropRegion;
  zoom: number;      // zoom into center of crop (1.0 = no zoom, 2.0 = 2x zoom)
  mask: MaskConfig;
  updatedAt: string;
}

export interface QuizSettings {
  totalQuestions: number;
  jjondeukQuestions: number;
  nongrutQuestions: number;
  quizMaxWidth: number;   // px - max width of quiz image display
  quizMaxHeight: number;  // px - max height of quiz image display
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
