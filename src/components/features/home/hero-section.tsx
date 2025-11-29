'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* 배경 장식 효과 */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 콘텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-100 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-slate-600 font-medium">개념부터 심화까지 체계적인 수학</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              수학의 재미를
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                다희쌤
              </span>
              과 함께
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              개념부터 심화까지, 체계적인 커리큘럼으로
              <br className="hidden md:block" />
              수학의 진짜 실력을 키워드립니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  무료 체험 신청하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
                >
                  시간표 확인하기
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* 프로필 이미지 영역 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* 메인 프로필 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center shadow-2xl"
              >
                <div className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-7xl md:text-8xl">👩‍🏫</span>
                </div>
              </motion.div>

              {/* 장식 요소들 */}
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-slate-100"
              >
                ✏️
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 -left-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center text-xl shadow-lg border border-slate-100"
              >
                📊
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-lg text-white font-bold shadow-lg"
              >
                ∑
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center"
        >
          <motion.div className="w-1.5 h-3 bg-slate-400 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
}
