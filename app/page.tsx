import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-10">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            얼굴 구분 퀴즈
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">
              쫀득
            </span>
            <span className="text-muted mx-3">vs</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              농루트
            </span>
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto leading-relaxed">
            눈, 코, 입 일부만 보고 누가 누구인지 맞혀보세요.
            <br />
            당신은 진정한 팬인가요?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            퀴즈 시작하기
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-card border border-border text-foreground hover:bg-card-hover hover:border-primary/30 transition-all duration-300"
          >
            <svg
              className="mr-2 w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            관리자 설정
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-muted/50">
          눈, 코, 입, 부분 가림 등 다양한 유형의 문제가 출제됩니다
        </p>
      </div>
    </main>
  );
}
