import Link from 'next/link';
import { ChevronRight, BookOpen, GraduationCap, Star, Trophy, Users } from 'lucide-react';

// 임시 더미 데이터 (추후 Sanity에서 가져올 예정)
const recentArticles = [
  {
    id: '1',
    title: '수학 공부, 개념이 먼저입니다',
    excerpt: '많은 학생들이 문제 풀이에만 집중하지만, 진정한 실력은 개념 이해에서 시작됩니다.',
    date: '2024.11.25',
    isPinned: true,
  },
  {
    id: '2',
    title: '고1 수학, 이것만은 꼭!',
    excerpt: '고등학교 수학의 기초가 되는 핵심 개념들을 정리했습니다.',
    date: '2024.11.20',
    isPinned: false,
  },
  {
    id: '3',
    title: '오답노트 제대로 쓰는 법',
    excerpt: '단순히 틀린 문제를 베끼는 것이 아닌, 진짜 오답노트 작성법을 알려드립니다.',
    date: '2024.11.15',
    isPinned: false,
  },
];

const recentStrategies = [
  {
    id: '1',
    title: '2025 수능 수학 출제 경향 분석',
    excerpt: '올해 수능 수학의 출제 경향과 내년 대비 전략을 분석합니다.',
    date: '2024.11.22',
    isPinned: true,
  },
  {
    id: '2',
    title: '내신과 수능, 두 마리 토끼 잡기',
    excerpt: '내신과 수능을 동시에 준비하는 효율적인 학습 전략을 소개합니다.',
    date: '2024.11.18',
    isPinned: false,
  },
  {
    id: '3',
    title: '수학 등급별 맞춤 학습법',
    excerpt: '현재 등급에 따른 맞춤형 학습 전략과 목표 설정 방법입니다.',
    date: '2024.11.10',
    isPinned: false,
  },
];

// 강사 약력
const credentials = [
  { icon: GraduationCap, text: '서울대학교 수리과학부 졸업' },
  { icon: Trophy, text: '대치동 주요 학원 출강 경력 10년' },
  { icon: Users, text: '누적 수강생 2,000명+' },
  { icon: Star, text: '수능 만점자 다수 배출' },
];

export default function Home() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-peach-50 py-16 md:py-24 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-peach-200/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 콘텐츠 */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                수학의 재미를
                <br />
                <span className="text-primary-500">다희쌤</span>과 함께
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                개념부터 심화까지, 체계적인 커리큘럼으로
                <br className="hidden md:block" />
                수학의 진짜 실력을 키워드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-primary-300 text-white font-semibold rounded-xl hover:bg-primary-400 transition-all hover:-translate-y-0.5 hover:shadow-lg text-center"
                >
                  무료 체험 신청하기
                </Link>
                <Link
                  href="/schedule"
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-500 transition-all text-center"
                >
                  시간표 확인하기
                </Link>
              </div>
            </div>

            {/* 프로필 이미지 영역 */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary-200 to-peach-200 rounded-full flex items-center justify-center">
                  <span className="text-8xl md:text-9xl">👩‍🏫</span>
                </div>
                {/* 장식 요소 */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-peach-200 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  ✏️
                </div>
                <div className="absolute -bottom-2 -left-4 w-14 h-14 bg-primary-200 rounded-full flex items-center justify-center text-xl shadow-lg">
                  📊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 약력 섹션 */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {credentials.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4"
              >
                <item.icon className="w-8 h-8 text-primary-400 mb-2" />
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최신 아티클 섹션 */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                최신 아티클
              </h2>
            </div>
            <Link
              href="/articles"
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              더보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                {article.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded-full mb-3">
                    📌 고정
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="text-xs text-gray-400">{article.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 최신 입시 전략 섹션 */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-peach-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-peach-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                입시 전략
              </h2>
            </div>
            <Link
              href="/strategy"
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              더보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentStrategies.map((strategy) => (
              <Link
                key={strategy.id}
                href={`/strategy/${strategy.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                {strategy.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-peach-500 bg-peach-50 px-2 py-1 rounded-full mb-3">
                    📌 고정
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-500 transition-colors">
                  {strategy.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {strategy.excerpt}
                </p>
                <span className="text-xs text-gray-400">{strategy.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-400 to-primary-500">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-white/90 mb-8">
            무료 상담을 통해 맞춤형 학습 계획을 받아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:010-0000-0000"
              className="px-8 py-4 bg-white text-primary-500 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              📞 전화 상담
            </a>
            <a
              href="https://open.kakao.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-yellow-400 text-gray-800 font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
            >
              💬 카카오톡 상담
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
