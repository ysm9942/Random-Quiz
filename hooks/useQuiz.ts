"use client";

import { useState, useCallback, useMemo } from "react";
import { Person, QuizQuestion, QuizResult } from "@/types";
import { loadQuizQuestions } from "@/lib/utils";

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedAnswer: Person | null;
  showResult: boolean;
  answers: { questionId: string; selected: Person; correct: boolean }[];
  isFinished: boolean;
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => ({
    questions: loadQuizQuestions(),
    currentIndex: 0,
    selectedAnswer: null,
    showResult: false,
    answers: [],
    isFinished: false,
  }));

  const currentQuestion = useMemo(
    () => state.questions[state.currentIndex] ?? null,
    [state.questions, state.currentIndex]
  );

  const isCorrect = useMemo(() => {
    if (!state.selectedAnswer || !currentQuestion) return null;
    return state.selectedAnswer === currentQuestion.config.answer;
  }, [state.selectedAnswer, currentQuestion]);

  const selectAnswer = useCallback(
    (answer: Person) => {
      if (state.selectedAnswer || !currentQuestion) return;

      const correct = answer === currentQuestion.config.answer;

      setState((prev) => ({
        ...prev,
        selectedAnswer: answer,
        showResult: true,
        answers: [
          ...prev.answers,
          {
            questionId: currentQuestion.config.id,
            selected: answer,
            correct,
          },
        ],
      }));
    },
    [state.selectedAnswer, currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isFinished: true };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        showResult: false,
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState({
      questions: loadQuizQuestions(),
      currentIndex: 0,
      selectedAnswer: null,
      showResult: false,
      answers: [],
      isFinished: false,
    });
  }, []);

  const result: QuizResult | null = useMemo(() => {
    if (!state.isFinished) return null;
    return {
      totalQuestions: state.questions.length,
      correctAnswers: state.answers.filter((a) => a.correct).length,
      answers: state.answers,
    };
  }, [state.isFinished, state.questions.length, state.answers]);

  return {
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    selectedAnswer: state.selectedAnswer,
    showResult: state.showResult,
    isCorrect,
    isFinished: state.isFinished,
    result,
    selectAnswer,
    nextQuestion,
    restart,
  };
}
