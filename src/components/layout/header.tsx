'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// 네비게이션 메뉴 항목
const navItems = [
  { label: '아티클', href: '/articles' },
  { label: '온라인 강의', href: '/lectures' },
  { label: '입시 전략', href: '/strategy' },
  { label: '다희쌤 시간표', href: '/schedule' },
];

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 세션 확인
  useEffect(() => {
    const supabase = createClient();

    // 현재 세션 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // 사용자 메타데이터에서 이름 가져오기
        setUserName(user.user_metadata?.name || '사용자');
      }
      setIsLoading(false);
    };

    getUser();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setUserName(session.user.user_metadata?.name || '사용자');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 로고 */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-2xl md:text-3xl">📐</span>
            <span>다희쌤 수학</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 데스크톱 인증 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              // 로딩 중
              <div className="w-24 h-10 bg-gray-100 rounded-xl animate-pulse" />
            ) : user ? (
              // 로그인 상태
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors rounded-xl hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="max-w-[100px] truncate">{userName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 프로필 드롭다운 메뉴 */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">로그인됨</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 비로그인 상태
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-primary-300 text-white font-medium rounded-xl hover:bg-primary-400 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 z-30 bg-black/20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 모바일 메뉴 */}
      <div
        className={`
          fixed top-16 right-0 z-40 w-72 h-[calc(100vh-4rem)] bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <nav className="flex flex-col p-4">
          {/* 로그인 상태일 때 사용자 정보 표시 */}
          {user && (
            <div className="px-4 py-3 mb-2 bg-primary-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[160px]">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:text-primary-500 hover:bg-primary-50 font-medium rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <hr className="my-4 border-gray-200" />
          
          {user ? (
            // 로그인 상태 - 로그아웃 버튼
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          ) : (
            // 비로그인 상태 - 로그인/회원가입 버튼
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-primary-500 hover:bg-primary-50 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                로그인
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 px-4 py-3 bg-primary-300 text-white font-medium rounded-xl hover:bg-primary-400 transition-colors text-center"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
