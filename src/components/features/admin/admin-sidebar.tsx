'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  Shield, 
  Calendar,
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

// 사이드바 메뉴 항목
const menuItems = [
  { 
    label: '대시보드', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: '관리자 홈'
  },
  { 
    label: '학생 관리', 
    href: '/admin/students', 
    icon: Users,
    description: '학생 목록 및 정보 관리'
  },
  { 
    label: '영상 관리', 
    href: '/admin/lectures', 
    icon: Video,
    description: '강의 영상 추가/수정/삭제'
  },
  { 
    label: '권한 관리', 
    href: '/admin/permissions', 
    icon: Shield,
    description: '학생별 강의 권한 설정'
  },
  { 
    label: '일정 관리', 
    href: '/admin/schedules', 
    icon: Calendar,
    description: '시간표 일정 추가/수정/삭제'
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="관리자 메뉴"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-16 md:top-20 left-0 z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          w-64 bg-white border-r border-slate-200 shadow-sm
          transform transition-transform duration-300 md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          {/* 관리자 섹션 헤더 */}
          <div className="px-3 py-4 mb-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <h2 className="text-lg font-bold text-slate-900">관리자 패널</h2>
            <p className="text-sm text-slate-500">다희쌤 수학 관리</p>
          </div>

          {/* 메뉴 목록 */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    {!isActive && (
                      <p className="text-xs text-slate-400 truncate">{item.description}</p>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 하단 정보 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="px-4 py-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">
              💡 도움이 필요하시면 개발자에게 문의하세요
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

