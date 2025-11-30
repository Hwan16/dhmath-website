import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/features/admin/admin-sidebar';

// 관리자 페이지 레이아웃 - admin 권한 필수
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  // 사용자 인증 확인
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (error || !user) {
    redirect('/auth/login');
  }

  // 관리자 권한 확인
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 디버깅 로그
  console.log('=== Admin Check ===');
  console.log('User ID:', user.id);
  console.log('Profile:', profile);
  console.log('Profile Error:', profileError);
  console.log('==================');

  // 관리자가 아닌 경우 홈으로 리다이렉트
  if (!profile || profile.role !== 'admin') {
    console.log('Redirecting to home: not admin');
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 md:pt-20">
      <div className="flex">
        {/* 사이드바 */}
        <AdminSidebar />
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-4 md:p-8 md:ml-64">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

