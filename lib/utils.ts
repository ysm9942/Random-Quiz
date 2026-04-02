import { GradeBadge, QuizQuestion } from "@/types";
import { getQuizConfigs, getQuizSettings } from "@/data/quiz-configs";
import { getImageById } from "@/data/images";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function loadQuizQuestions(): QuizQuestion[] {
  const configs = getQuizConfigs();
  const settings = getQuizSettings();

  const allQuestions: QuizQuestion[] = [];
  for (const config of configs) {
    const image = getImageById(config.sourceImageId);
    if (image) {
      allQuestions.push({ config, image });
    }
  }

  const jjondeuk = shuffleArray(
    allQuestions.filter((q) => q.config.answer === "쫀득")
  ).slice(0, settings.jjondeukQuestions);

  const nongrut = shuffleArray(
    allQuestions.filter((q) => q.config.answer === "농루트")
  ).slice(0, settings.nongrutQuestions);

  const combined = [...jjondeuk, ...nongrut];
  const totalLimit = settings.totalQuestions;

  return shuffleArray(combined).slice(0, totalLimit);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getGradeBadge(accuracy: number): GradeBadge {
  if (accuracy === 100) {
    return {
      label: "S",
      emoji: "👑",
      color: "from-yellow-400 to-amber-600",
      description: "완벽한 팬! 쫀득과 농루트를 완벽히 구분합니다!",
    };
  }
  if (accuracy >= 80) {
    return {
      label: "A",
      emoji: "🔥",
      color: "from-purple-400 to-violet-600",
      description: "엄청난 실력! 거의 다 맞혔어요!",
    };
  }
  if (accuracy >= 60) {
    return {
      label: "B",
      emoji: "✨",
      color: "from-blue-400 to-cyan-600",
      description: "괜찮은 실력! 좀 더 연습해볼까요?",
    };
  }
  if (accuracy >= 40) {
    return {
      label: "C",
      emoji: "💪",
      color: "from-green-400 to-emerald-600",
      description: "아직 헷갈리는 부분이 있네요!",
    };
  }
  return {
    label: "D",
    emoji: "😅",
    color: "from-red-400 to-rose-600",
    description: "더 많이 봐야 할 것 같아요!",
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
