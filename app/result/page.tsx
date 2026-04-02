"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { calculateAccuracy, getGradeBadge } from "@/lib/utils";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const total = parseInt(searchParams.get("total") || "0", 10);
  const correct = parseInt(searchParams.get("correct") || "0", 10);
  const accuracy = calculateAccuracy(correct, total);
  const badge = getGradeBadge(accuracy);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Badge */}
        <div className="space-y-4">
          <div
            className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br ${badge.color} text-white text-5xl font-black shadow-2xl`}
          >
            {badge.label}
          </div>
          <div className="text-4xl">{badge.emoji}</div>
          <h1 className="text-3xl font-black">퀴즈 결과</h1>
        </div>

        {/* Stats */}
        <Card className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold text-foreground">{total}</div>
              <div className="text-sm text-muted mt-1">총 문제</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">{correct}</div>
              <div className="text-sm text-muted mt-1">정답</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {accuracy}%
              </div>
              <div className="text-sm text-muted mt-1">정답률</div>
            </div>
          </div>

          {/* Accuracy Bar */}
          <div>
            <div className="w-full h-3 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${badge.color} transition-all duration-1000`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Message */}
          <p className="text-muted">{badge.description}</p>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/quiz")}
            variant="primary"
            size="lg"
            className="w-full"
          >
            다시 풀기
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">결과를 불러오는 중...</div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
