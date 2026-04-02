"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import QuizImage from "@/components/quiz/QuizImage";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { Person } from "@/types";

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    showResult,
    isCorrect,
    isFinished,
    result,
    selectAnswer,
    nextQuestion,
  } = useQuiz();

  useEffect(() => {
    if (isFinished && result) {
      const params = new URLSearchParams({
        total: result.totalQuestions.toString(),
        correct: result.correctAnswers.toString(),
      });
      router.push(`/result?${params.toString()}`);
    }
  }, [isFinished, result, router]);

  if (!currentQuestion) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted text-lg">문제가 없습니다.</p>
          <Button variant="secondary" onClick={() => router.push("/")}>
            홈으로 돌아가기
          </Button>
        </div>
      </main>
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="text-muted hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              ← 홈으로
            </button>
          </div>
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>

        {/* Question Image */}
        <div className="flex justify-center">
          <QuizImage
            imageUrl={currentQuestion.image.originalUrl}
            crop={currentQuestion.config.crop}
            mask={currentQuestion.config.mask}
            className="shadow-2xl shadow-black/50"
          />
        </div>

        {/* Question */}
        <div className="text-center">
          <h2 className="text-xl font-bold">이 사람은 누구일까요?</h2>
          <p className="text-sm text-muted mt-1">
            문제 {currentIndex + 1} / {totalQuestions}
          </p>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {(["쫀득", "농루트"] as Person[]).map((person) => {
            const isSelected = selectedAnswer === person;
            const isAnswer = currentQuestion.config.answer === person;

            let btnClass = "relative py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-300 cursor-pointer ";

            if (!showResult) {
              btnClass +=
                "bg-card border-border hover:border-primary hover:bg-card-hover";
            } else if (isAnswer) {
              btnClass +=
                "bg-success/10 border-success text-success";
            } else if (isSelected && !isAnswer) {
              btnClass +=
                "bg-danger/10 border-danger text-danger";
            } else {
              btnClass += "bg-card border-border opacity-50";
            }

            return (
              <button
                key={person}
                onClick={() => selectAnswer(person)}
                disabled={!!selectedAnswer}
                className={btnClass}
              >
                {person}
                {showResult && isAnswer && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-success rounded-full flex items-center justify-center text-white text-sm">
                    ✓
                  </span>
                )}
                {showResult && isSelected && !isAnswer && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-danger rounded-full flex items-center justify-center text-white text-sm">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback + Original Image */}
        {showResult && (
          <div className="space-y-4">
            <div
              className={`rounded-xl p-4 border text-center ${
                isCorrect
                  ? "bg-success/5 border-success/30"
                  : "bg-danger/5 border-danger/30"
              }`}
            >
              <span className="text-lg mr-2">
                {isCorrect ? "🎉" : "😢"}
              </span>
              <span
                className={`font-bold ${
                  isCorrect ? "text-success" : "text-danger"
                }`}
              >
                {isCorrect ? "정답!" : "오답!"}
              </span>
              <span className="ml-2 text-sm text-muted">
                정답: {currentQuestion.config.answer}
              </span>
            </div>

            {/* Original Photo Reveal */}
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={currentQuestion.image.originalUrl}
                alt={currentQuestion.config.answer}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button
            onClick={nextQuestion}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {isLastQuestion ? "결과 보기" : "다음 문제 →"}
          </Button>
        )}
      </div>
    </main>
  );
}
