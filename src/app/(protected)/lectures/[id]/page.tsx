import { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLecture, getLectures, hasLectureAccess } from "@/lib/supabase/lectures";
import { extractYouTubeId } from "@/lib/utils/youtube";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { LectureCard } from "@/components/features/lectures";
import { ArrowLeft, Play, ChevronRight, Lock } from "lucide-react";

const defaultOgImage = "/opengraph-image.png";

interface Props {
  params: { id: string };
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lecture = await getLecture(params.id);
  
  if (!lecture) {
    return {
      title: "강의를 찾을 수 없습니다 | 김다희 수학",
    };
  }

  const videoId = extractYouTubeId(lecture.youtube_url);
  const ogImage =
    lecture.thumbnail_url ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : defaultOgImage);

  return {
    title: `${lecture.title} | 김다희 수학`,
    description: lecture.description || "김다희 선생님의 온라인 수학 강의",
    alternates: {
      canonical: `/lectures/${params.id}`,
    },
    openGraph: {
      type: "video.other",
      title: `${lecture.title} | 김다희 수학`,
      description: lecture.description || "김다희 선생님의 온라인 수학 강의",
      url: `/lectures/${params.id}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: lecture.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lecture.title} | 김다희 수학`,
      description: lecture.description || "김다희 선생님의 온라인 수학 강의",
      images: [ogImage],
    },
  };
}

export default async function LectureDetailPage({ params }: Props) {
  const supabase = createClient();
  
  // 현재 사용자 정보
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login?message=로그인이 필요한 서비스입니다.');
  }

  // 강의 정보 조회
  const lecture = await getLecture(params.id);
  
  if (!lecture) {
    notFound();
  }

  // 권한 확인
  const hasAccess = await hasLectureAccess(user.id, lecture.id);
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <MotionWrapper>
            {/* 뒤로가기 */}
            <Link
              href="/lectures"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              강의 목록으로
            </Link>

            {/* 권한 없음 안내 */}
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-slate-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                수강 권한이 필요합니다
              </h1>
              <p className="text-slate-600 mb-2">{lecture.title}</p>
              <p className="text-slate-500 mb-8">
                이 강의를 시청하려면 관리자에게 권한을 요청하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/lectures"
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  다른 강의 보기
                </Link>
                <a
                  href="https://pf.kakao.com/_example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  권한 요청하기
                </a>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    );
  }

  // YouTube Video ID 추출
  const videoId = extractYouTubeId(lecture.youtube_url);

  // 다른 강의 목록 (현재 강의 제외, 최대 3개)
  const allLectures = await getLectures();
  const otherLectures = allLectures
    .filter(l => l.id !== lecture.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 md:pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 뒤로가기 */}
        <MotionWrapper>
          <Link
            href="/lectures"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            강의 목록으로
          </Link>
        </MotionWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            <MotionWrapper>
              {/* YouTube 플레이어 */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lecture.title}
                  />
                </div>
              </div>

              {/* 강의 정보 */}
              <div className="mt-6 bg-white rounded-2xl shadow-card p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {lecture.title}
                </h1>
                {lecture.description && (
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {lecture.description}
                  </p>
                )}
              </div>
            </MotionWrapper>
          </div>

          {/* 사이드바 - 다른 강의 */}
          <div className="lg:col-span-1">
            <MotionWrapper delay={0.2}>
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">다른 강의</h2>
                  <Link
                    href="/lectures"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    전체보기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                {otherLectures.length > 0 ? (
                  <div className="space-y-4">
                    {otherLectures.map((otherLecture) => (
                      <Link
                        key={otherLecture.id}
                        href={`/lectures/${otherLecture.id}`}
                        className="flex gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="relative w-28 flex-shrink-0">
                          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                            <img
                              src={otherLecture.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(otherLecture.youtube_url)}/mqdefault.jpg`}
                              alt={otherLecture.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                              <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {otherLecture.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    다른 강의가 없습니다
                  </p>
                )}
              </div>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

