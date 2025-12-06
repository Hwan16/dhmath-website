import { Metadata } from "next";
import { ScheduleCalendar } from "@/components/features/schedule";
import { MotionDiv } from "@/components/ui/motion";
import { Calendar } from "lucide-react";

const defaultOgImage = "/opengraph-image.png";

export const metadata: Metadata = {
  title: "다희쌤 시간표 | 김다희 수학",
  description: "김다희 선생님의 수업 일정을 확인하세요. 정규 수업, 특강, 상담 일정을 한눈에 볼 수 있습니다.",
  openGraph: {
    title: "다희쌤 시간표 | 김다희 수학",
    description: "김다희 선생님의 수업 일정을 확인하세요. 정규 수업, 특강, 상담 일정을 한눈에 볼 수 있습니다.",
    url: "/schedule",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "다희쌤 시간표 | 김다희 수학",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "다희쌤 시간표 | 김다희 수학",
    description: "김다희 선생님의 수업 일정을 확인하세요. 정규 수업, 특강, 상담 일정을 한눈에 볼 수 있습니다.",
    images: [defaultOgImage],
  },
  alternates: {
    canonical: "/schedule",
  },
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* 히어로 섹션 */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              다희쌤{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                시간표
              </span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              수업 일정을 확인하고 상담을 예약하세요.<br className="hidden md:block" />
              일정을 클릭하면 상세 내용을 볼 수 있어요.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* 캘린더 섹션 */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ScheduleCalendar />
          </MotionDiv>
        </div>
      </section>

      {/* 안내 섹션 */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-card p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">📌 안내사항</h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>수업 일정은 변경될 수 있으니, 최신 일정을 확인해 주세요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>상담 예약은 카카오톡 또는 전화로 문의해 주세요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>수업 관련 문의사항이 있으시면 언제든 연락 주세요.</span>
              </li>
            </ul>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
