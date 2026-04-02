import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "쫀득 vs 농루트 퀴즈",
  description: "쫀득과 농루트의 얼굴을 구분할 수 있나요? 지금 도전해보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
