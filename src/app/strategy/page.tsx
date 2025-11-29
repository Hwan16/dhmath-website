import { getPosts } from '@/lib/sanity/fetch';
import { ArticleCard } from '@/components/features/articles';
import { Trophy } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: '입시 전략 | 다희쌤 수학',
  description: '수능, 내신, 모의고사 대비 입시 전략을 확인하세요.',
};

export default async function StrategyPage() {
  const strategies = await getPosts('strategy');

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* 배경 장식 */}
      <div className="fixed top-40 right-20 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 left-20 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600 font-medium">STRATEGY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">입시 전략</h1>
          <p className="text-slate-600">수능, 내신, 모의고사 완벽 대비</p>
        </div>

        {/* 전략 목록 */}
        {strategies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((post, index) => (
              <ArticleCard key={post._id} post={post} basePath="/strategy" index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-card">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">아직 작성된 글이 없습니다</h2>
            <p className="text-slate-500">곧 새로운 입시 전략이 업로드될 예정이에요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
