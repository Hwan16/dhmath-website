'use client';

import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* 메인 푸터 콘텐츠 */}
      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 브랜드 정보 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                다희쌤 수학
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              고등 수학 전문 강사 김다희입니다.
              <br />
              개념부터 심화까지 체계적인 수업으로
              <br />
              수학의 재미를 알려드립니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">바로가기</h3>
            <ul className="space-y-2">
              {[
                { label: '아티클', href: '/articles' },
                { label: '온라인 강의', href: '/lectures' },
                { label: '입시 전략', href: '/strategy' },
                { label: '다희쌤 시간표', href: '/schedule' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary-400 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">상담 문의</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:010-0000-0000"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>010-0000-0000</span>
                </a>
              </li>
              <li>
                <a
                  href="https://open.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors">
                    <MessageCircle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span>카카오톡 상담</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://blog.naver.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <ExternalLink className="w-4 h-4 text-green-400" />
                  </div>
                  <span>네이버 블로그</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 위치 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">위치</h3>
            <div className="flex items-start gap-3 text-slate-400 mb-4">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm">
                서울특별시 강남구 테헤란로 123
                <br />
                다희수학 학원 3층
              </span>
            </div>
            {/* 네이버 지도 임베드 */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.3370795654397!2d127.0276368!3d37.4979517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15aee9ab0ad%3A0x39b9eb1a64a8893c!2z6rCV64Ko7Jet!5e0!3m2!1sko!2skr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="다희쌤 수학 위치"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 저작권 */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2024 다희쌤 수학. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
