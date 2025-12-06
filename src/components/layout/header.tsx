'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 사용자 세션 확인
  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        setUserName(user.user_metadata?.name || '사용자');
      }
      setIsLoading(false);
    };

    getUser();

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
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white shadow-header' 
          : 'bg-white/80 backdrop-blur-md'
        }
      `}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-none bg-transparent"
            >
              <Image
                src="/logo.svg"
                alt="김다희 수학 로고"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              다희쌤 수학
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-slate-600 hover:text-primary-600 font-medium transition-all duration-300 rounded-lg hover:bg-slate-50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* 데스크톱 인증 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-10 bg-slate-100 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative profile-menu-container">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors rounded-xl hover:bg-slate-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="max-w-[100px] truncate">{userName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* 프로필 드롭다운 메뉴 */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-500">로그인됨</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-slate-700 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-600 hover:text-primary-600 font-medium transition-colors"
                >
                  로그인
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    회원가입
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 z-40 w-72 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 shadow-xl md:hidden"
          >
            <nav className="flex flex-col p-4">
              {/* 로그인 상태일 때 사용자 정보 표시 */}
              {user && (
                <div className="px-4 py-3 mb-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{userName}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[160px]">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <hr className="my-4 border-slate-200" />
              
              {user ? (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-slate-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  로그아웃
                </motion.button>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-slate-700 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors"
                    >
                      로그인
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block mt-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl text-center hover:shadow-lg transition-all"
                    >
                      회원가입
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
