import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MotionWrapper } from '@/components/ui/motion-wrapper';
import { LectureManagementClient } from './lecture-management-client';
import { Video } from 'lucide-react';

export const metadata: Metadata = {
  title: '영상 관리 | 관리자 | 김다희 수학',
  description: '강의 영상을 추가, 수정, 삭제합니다.',
};

export default async function AdminLecturesPage() {
  const supabase = createClient();

  // 모든 강의 조회 (비활성 포함)
  const { data: lectures, error } = await supabase
    .from('lectures')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('강의 목록 조회 실패:', error);
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <MotionWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                영상 관리
              </h1>
            </div>
            <p className="text-slate-600">
              강의 영상을 추가하고 관리하세요. 총 {lectures?.length || 0}개의 강의가 있습니다.
            </p>
          </div>
        </div>
      </MotionWrapper>

      {/* 강의 관리 클라이언트 컴포넌트 */}
      <LectureManagementClient initialLectures={lectures || []} />
    </div>
  );
}

