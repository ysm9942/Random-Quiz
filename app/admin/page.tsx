"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { sourceImages } from "@/data/images";
import { getQuizConfigs, getQuizConfigByImageId, getQuizSettings, saveQuizSettings } from "@/data/quiz-configs";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PinGate from "@/components/ui/PinGate";
import { Person } from "@/types";

type FilterType = "all" | Person;

export default function AdminPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const configs = getQuizConfigs();
  const [settings, setSettings] = useState(getQuizSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const filteredImages = useMemo(() => {
    if (filter === "all") return sourceImages;
    return sourceImages.filter((img) => img.person === filter);
  }, [filter]);

  const totalConfigs = configs.length;
  const jjondeukConfigs = configs.filter((c) => c.answer === "쫀득").length;
  const nongrutConfigs = configs.filter((c) => c.answer === "농루트").length;

  const handleSaveSettings = () => {
    saveQuizSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
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
            이미지를 선택해 퀴즈 문제를 생성하거나 편집하세요.
          </p>
        </div>

        {/* Quiz Settings */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-4">퀴즈 출제 설정</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">전체 문제 수</label>
              <input
                type="number"
                min={1}
                value={settings.totalQuestions}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, totalQuestions: parseInt(e.target.value) || 1 }))
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">
                쫀득 문제 수 <span className="text-violet-400">(설정됨: {jjondeukConfigs}개)</span>
              </label>
              <input
                type="number"
                min={0}
                value={settings.jjondeukQuestions}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, jjondeukQuestions: parseInt(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">
                농루트 문제 수 <span className="text-cyan-400">(설정됨: {nongrutConfigs}개)</span>
              </label>
              <input
                type="number"
                min={0}
                value={settings.nongrutQuestions}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, nongrutQuestions: parseInt(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button size="sm" onClick={handleSaveSettings}>
              {settingsSaved ? "저장됨!" : "설정 저장"}
            </Button>
            <span className="text-xs text-muted">
              전체 {totalConfigs}개 문제 중 랜덤으로 출제됩니다.
            </span>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-sm text-muted">전체 문제</div>
            <div className="text-3xl font-bold text-primary mt-1">
              {totalConfigs}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-muted">쫀득 문제</div>
            <div className="text-3xl font-bold text-violet-400 mt-1">
              {jjondeukConfigs}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-muted">농루트 문제</div>
            <div className="text-3xl font-bold text-cyan-400 mt-1">
              {nongrutConfigs}
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
            const config = getQuizConfigByImageId(image.id);

            return (
              <Link key={image.id} href={`/admin/editor/${image.id}`}>
                <Card hoverable className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {config && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="success">설정됨</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{image.name}</h3>
                      <p className="text-xs text-muted mt-0.5">
                        {image.person}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
    </PinGate>
  );
}
