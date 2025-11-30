import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MotionWrapper } from '@/components/ui/motion-wrapper';
import { Users, Video, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 김다희 수학',
  description: '김다희 수학 관리자 대시보드',
};

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // 통계 데이터 조회
  const [studentsResult, lecturesResult, permissionsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
    supabase.from('lectures').select('id', { count: 'exact' }),
    supabase.from('lecture_permissions').select('id', { count: 'exact' }),
  ]);

  const studentCount = studentsResult.count || 0;
  const lectureCount = lecturesResult.count || 0;
  const permissionCount = permissionsResult.count || 0;

  // 최근 가입 학생 5명
  const { data: recentStudents } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      label: '전체 학생',
      value: studentCount,
      icon: Users,
      href: '/admin/students',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: '등록된 강의',
      value: lectureCount,
      icon: Video,
      href: '/admin/lectures',
      color: 'from-primary-500 to-accent-500',
    },
    {
      label: '부여된 권한',
      value: permissionCount,
      icon: Shield,
      href: '/admin/permissions',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <MotionWrapper>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            관리자 대시보드
          </h1>
          <p className="mt-2 text-slate-600">
            다희쌤 수학 사이트 현황을 한눈에 확인하세요.
          </p>
        </div>
      </MotionWrapper>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <MotionWrapper key={stat.label} delay={index * 0.1}>
            <Link href={stat.href}>
              <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-primary-600 group-hover:text-primary-700">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </MotionWrapper>
        ))}
      </div>

      {/* 최근 가입 학생 */}
      <MotionWrapper delay={0.3}>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">최근 가입 학생</h2>
            <Link
              href="/admin/students"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentStudents && recentStudents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {student.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(student.created_at).toLocaleDateString('ko-KR')} 가입
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/permissions?user=${student.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    권한 설정
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              아직 가입한 학생이 없습니다.
            </p>
          )}
        </div>
      </MotionWrapper>

      {/* 빠른 작업 */}
      <MotionWrapper delay={0.4}>
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/lectures"
              className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              <Video className="w-5 h-5" />
              <span>새 강의 추가</span>
            </Link>
            <Link
              href="/admin/students"
              className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>학생 관리</span>
            </Link>
            <Link
              href="/admin/permissions"
              className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>권한 설정</span>
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
}

