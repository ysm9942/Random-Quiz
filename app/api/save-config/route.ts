import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "ysm9942";
const REPO_NAME = "Random-Quiz";
const BRANCH = "claude/creator-face-quiz-app-9c9kk";
const FILE_PATH = "data/quiz-configs.ts";

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const { configs, settings } = await req.json();

  const fileContent = generateFileContent(configs, settings);

  // Get the current file SHA (required for updates)
  const shaRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!shaRes.ok) {
    const err = await shaRes.text();
    return NextResponse.json(
      { error: `GitHub에서 파일을 가져올 수 없습니다: ${err}` },
      { status: 500 }
    );
  }

  const shaData = await shaRes.json();
  const currentSha = shaData.sha;

  const updateRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "chore: update quiz configs from admin editor",
        content: Buffer.from(fileContent).toString("base64"),
        sha: currentSha,
        branch: BRANCH,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    return NextResponse.json(
      { error: `GitHub 저장 실패: ${err}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

function generateFileContent(
  configs: Array<{
    id: string;
    sourceImageId: string;
    answer: string;
    enabled?: boolean;
    crop: { x: number; y: number; width: number; height: number };
    zoom?: number;
    mask: { enabled: boolean; blurPercent: number };
    updatedAt: string;
  }>,
  settings: { totalQuestions: number; jjondeukQuestions: number; nongrutQuestions: number; quizMaxWidth: number; quizMaxHeight: number }
): string {
  const configLines = configs
    .map(
      (c) =>
        `  { id: "${c.id}", sourceImageId: "${c.sourceImageId}", answer: "${c.answer}", enabled: ${c.enabled !== false}, crop: { x: ${c.crop.x}, y: ${c.crop.y}, width: ${c.crop.width}, height: ${c.crop.height} }, zoom: ${c.zoom ?? 1.0}, mask: { enabled: ${c.mask.enabled}, blurPercent: ${c.mask.blurPercent} }, updatedAt: "${c.updatedAt}" },`
    )
    .join("\n");

  return `import { QuizConfig, QuizSettings } from "@/types";

let quizSettings: QuizSettings = {
  totalQuestions: ${settings.totalQuestions},
  jjondeukQuestions: ${settings.jjondeukQuestions},
  nongrutQuestions: ${settings.nongrutQuestions},
  quizMaxWidth: ${settings.quizMaxWidth ?? 480},
  quizMaxHeight: ${settings.quizMaxHeight ?? 220},
};

// crop coords are in NATURAL image pixels.
// x, y = top-left corner of the crop region
// width, height = size of the crop region
// All values need to be configured in the admin editor for each image.
let quizConfigs: QuizConfig[] = [
${configLines}
];

export function getQuizSettings(): QuizSettings {
  return { ...quizSettings };
}

export function saveQuizSettings(settings: QuizSettings): void {
  quizSettings = { ...settings };
}

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

export function setQuizConfigs(configs: QuizConfig[]): void {
  quizConfigs = configs;
}

export function setQuizSettingsData(settings: QuizSettings): void {
  quizSettings = settings;
}
`;
}
