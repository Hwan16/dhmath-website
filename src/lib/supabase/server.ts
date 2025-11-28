import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 서버 컴포넌트에서 사용하는 Supabase 클라이언트
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 서버 컴포넌트에서 쿠키 설정 시 에러 무시
            // 미들웨어나 Server Action에서만 설정 가능
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // 서버 컴포넌트에서 쿠키 삭제 시 에러 무시
          }
        },
      },
    }
  );
}

