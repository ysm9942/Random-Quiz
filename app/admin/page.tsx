"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { sourceImages } from "@/data/images";
import {
  getQuizConfigs,
  getQuizSettings,
  saveQuizConfig,
} from "@/data/quiz-configs";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PinGate from "@/components/ui/PinGate";
import { Person, QuizConfig } from "@/types";

type FilterType = "all" | Person;

export default function AdminPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [configs, setConfigs] = useState<QuizConfig[]>(getQuizConfigs);

  const filteredImages = useMemo(() => {
    if (filter === "all") return sourceImages;
    return sourceImages.filter((img) => img.person === filter);
  }, [filter]);

  const enabledConfigs = configs.filter((c) => c.enabled);
  const jjondeukEnabled = enabledConfigs.filter((c) => c.answer === "쫀득").length;
  const nongrutEnabled = enabledConfigs.filter((c) => c.answer === "농루트").length;

  const toggleEnabled = (config: QuizConfig) => {
    const updated = { ...config, enabled: !config.enabled };
    saveQuizConfig(updated);
    setConfigs((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  return (
    <PinGate
      storageKey="admin-auth"
      title="관리자 인증"
      description="관리자 페이지에 접속하려면 PIN을 입력하세요."
    >
    <main className="flex-1 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-black mt-2">관리자 설정</h1>
          <p className="text-muted mt-1">
            이미지를 선택해 퀴즈 문제를 편집하고, 카드의 토글로 출제 여부를 설정하세요.
          </p>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-sm text-muted">활성 문제</div>
            <div className="text-3xl font-bold text-primary mt-1">
              {enabledConfigs.length}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-muted">쫀득 활성</div>
            <div className="text-3xl font-bold text-violet-400 mt-1">
              {jjondeukEnabled}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-muted">농루트 활성</div>
            <div className="text-3xl font-bold text-cyan-400 mt-1">
              {nongrutEnabled}
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted mr-2">필터:</span>
          {(["all", "쫀득", "농루트"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-card border border-border text-muted hover:text-foreground hover:border-primary/30"
              }`}
            >
              {f === "all" ? "전체" : f}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => {
            const config = configs.find((c) => c.sourceImageId === image.id);

            return (
              <Card key={image.id} hoverable className="space-y-3">
                <Link href={`/admin/editor/${image.id}`} className="block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {config && !config.enabled && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                        <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">비활성</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <h3 className="font-semibold text-sm">{image.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{image.person}</p>
                    </div>
                  </div>
                </Link>
                {/* Enabled toggle — outside Link so click doesn't navigate */}
                {config && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted">출제 여부</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleEnabled(config);
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        config.enabled ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                          config.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
    </PinGate>
  );
}
