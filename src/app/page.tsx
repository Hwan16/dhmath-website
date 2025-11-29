import Link from 'next/link';
import { ChevronRight, BookOpen, Trophy } from 'lucide-react';
import { getRecentPosts } from '@/lib/sanity/fetch';
import { ArticleCard } from '@/components/features/articles';
import { HeroSection } from '@/components/features/home/hero-section';
import { CredentialsSection } from '@/components/features/home/credentials-section';
import { CTASection } from '@/components/features/home/cta-section';
import { ArticlesSection } from '@/components/features/home/articles-section';
import { StrategiesSection } from '@/components/features/home/strategies-section';

// 페이지 재검증 (60초마다 새로운 데이터 확인)
export const revalidate = 60;

export default async function Home() {
  // Sanity에서 최신 글 가져오기
  const [recentArticles, recentStrategies] = await Promise.all([
    getRecentPosts('article', 3),
    getRecentPosts('strategy', 3),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 약력 섹션 */}
      <CredentialsSection />

      {/* 최신 아티클 섹션 */}
      <ArticlesSection articles={recentArticles} />

      {/* 최신 입시 전략 섹션 */}
      <StrategiesSection strategies={recentStrategies} />

      {/* CTA 섹션 */}
      <CTASection />
    </div>
  );
}
