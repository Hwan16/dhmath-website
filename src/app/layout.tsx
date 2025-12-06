import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dhmath-website.vercel.app";
const defaultTitle = "김다희 수학 | 고등 수학 전문";
const defaultDescription =
  "고등 수학 전문 강사 김다희입니다. 개념부터 심화까지 체계적인 수학 수업을 제공합니다.";
const defaultKeywords = ["수학", "고등수학", "수학강사", "김다희", "수학과외", "입시수학"];
const defaultOgImage = "/opengraph-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | 김다희 수학",
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "김다희 수학",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "김다희 수학",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
  alternates: {
    canonical: "/",
  },
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
