import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MotionWrapper } from '@/components/ui/motion-wrapper';
import { StudentListClient } from './student-list-client';
import { Users, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: '학생 관리 | 관리자 | 김다희 수학',
  description: '등록된 학생들을 관리합니다.',
};

export default async function AdminStudentsPage() {
  const supabase = createClient();

  // 모든 학생 프로필 조회
  const { data: students, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('학생 목록 조회 실패:', error);
  }

  // 각 학생의 권한 개수 조회
  const studentsWithPermissions = await Promise.all(
    (students || []).map(async (student) => {
      const { count } = await supabase
        .from('lecture_permissions')
        .select('id', { count: 'exact' })
        .eq('user_id', student.id);

      return {
        ...student,
        permissionCount: count || 0,
      };
    })
  );

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <MotionWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                학생 관리
              </h1>
            </div>
            <p className="text-slate-600">
              등록된 학생 {students?.length || 0}명을 관리하세요.
            </p>
          </div>
        </div>
      </MotionWrapper>

      {/* 학생 목록 클라이언트 컴포넌트 */}
      <StudentListClient initialStudents={studentsWithPermissions} />
    </div>
  );
}

