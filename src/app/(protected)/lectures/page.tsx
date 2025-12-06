import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLectures, getUserLecturePermissions, hasAllAccess } from "@/lib/supabase/lectures";
import { LectureCard, LectureCardSkeleton } from "@/components/features/lectures";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Video, BookOpen } from "lucide-react";

const defaultOgImage = "/opengraph-image.png";

export const metadata: Metadata = {
  title: "온라인 강의 | 김다희 수학",
  description: "김다희 선생님의 온라인 수학 강의를 수강하세요.",
  openGraph: {
    title: "온라인 강의 | 김다희 수학",
    description: "김다희 선생님의 온라인 수학 강의를 수강하세요.",
    url: "/lectures",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "온라인 강의 | 김다희 수학",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "온라인 강의 | 김다희 수학",
    description: "김다희 선생님의 온라인 수학 강의를 수강하세요.",
    images: [defaultOgImage],
  },
  alternates: {
    canonical: "/lectures",
  },
};

export default async function LecturesPage() {
  const supabase = createClient();
  
  // 현재 사용자 정보
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null; // 레이아웃에서 리다이렉트 처리됨
  }

  // 강의 목록 조회
  const lectures = await getLectures();
  
  // 사용자의 권한 확인
  const allAccess = await hasAllAccess(user.id);
  const permissions = allAccess ? [] : await getUserLecturePermissions(user.id);

  // 접근 가능한 강의 ID Set
  const accessibleLectureIds = new Set(permissions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 md:pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 섹션 */}
        <MotionWrapper>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              온라인 강의
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                다희쌤
              </span>
              의 온라인 강의
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              개념부터 심화까지, 체계적인 수학 강의를 언제 어디서나 수강하세요.
              {!allAccess && (
                <span className="block mt-2 text-sm text-slate-500">
                  🔒 잠긴 강의는 관리자에게 권한을 요청하세요.
                </span>
              )}
            </p>
          </div>
        </MotionWrapper>

        {/* 강의 목록 */}
        {lectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lecture, index) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                hasAccess={allAccess || accessibleLectureIds.has(lecture.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* 강의가 없을 때 */
          <MotionWrapper delay={0.2}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                아직 등록된 강의가 없습니다
              </h3>
              <p className="text-slate-500">
                곧 새로운 강의가 업로드될 예정입니다.
              </p>
            </div>
          </MotionWrapper>
        )}

        {/* 하단 안내 */}
        {lectures.length > 0 && (
          <MotionWrapper delay={0.3}>
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">수강 권한이 필요하신가요?</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    관리자에게 문의하여 수강 권한을 받으세요.
                  </p>
                </div>
                <a
                  href="https://pf.kakao.com/_example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  카카오톡 문의하기
                </a>
              </div>
            </div>
          </MotionWrapper>
        )}
      </div>
    </div>
  );
}

