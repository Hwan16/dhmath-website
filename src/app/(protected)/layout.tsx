import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// 보호된 페이지 레이아웃 - 로그인 필수
export default async function ProtectedLayout({
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

  return <>{children}</>;
}

