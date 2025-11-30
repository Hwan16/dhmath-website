import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MotionWrapper } from '@/components/ui/motion-wrapper';
import { PermissionManagementClient } from './permission-management-client';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: '권한 관리 | 관리자 | 김다희 수학',
  description: '학생별 강의 권한을 관리합니다.',
};

interface Props {
  searchParams: { user?: string };
}

export default async function AdminPermissionsPage({ searchParams }: Props) {
  const supabase = createClient();
  const selectedUserId = searchParams.user;

  // 모든 학생 조회
  const { data: students } = await supabase
    .from('profiles')
    .select('id, name, school, all_access')
    .eq('role', 'student')
    .order('name', { ascending: true });

  // 모든 활성 강의 조회
  const { data: lectures } = await supabase
    .from('lectures')
    .select('id, title, thumbnail_url, youtube_url')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  // 선택된 사용자의 권한 조회
  let userPermissions: string[] = [];
  let selectedStudent = null;

  if (selectedUserId) {
    selectedStudent = students?.find(s => s.id === selectedUserId) || null;
    
    const { data: permissions } = await supabase
      .from('lecture_permissions')
      .select('lecture_id')
      .eq('user_id', selectedUserId);

    userPermissions = permissions?.map(p => p.lecture_id) || [];
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <MotionWrapper>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              권한 관리
            </h1>
          </div>
          <p className="text-slate-600">
            학생별로 강의 수강 권한을 부여하거나 해제할 수 있습니다.
          </p>
        </div>
      </MotionWrapper>

      {/* 권한 관리 클라이언트 */}
      <PermissionManagementClient
        students={students || []}
        lectures={lectures || []}
        selectedUserId={selectedUserId || null}
        selectedStudent={selectedStudent}
        initialPermissions={userPermissions}
      />
    </div>
  );
}

