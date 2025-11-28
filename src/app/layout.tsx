import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "김다희 수학 | 고등 수학 전문",
  description: "고등 수학 전문 강사 김다희입니다. 개념부터 심화까지 체계적인 수학 수업을 제공합니다.",
  keywords: ["수학", "고등수학", "수학강사", "김다희", "수학과외", "입시수학"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 CDN */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-pretendard antialiased bg-orange-50 text-gray-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
