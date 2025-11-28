import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* 메인 푸터 콘텐츠 */}
      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 브랜드 정보 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-300 mb-4">
              <span className="text-2xl">📐</span>
              <span>다희쌤 수학</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              고등 수학 전문 강사 김다희입니다.
              <br />
              개념부터 심화까지 체계적인 수업으로
              <br />
              수학의 재미를 알려드립니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-primary-300 transition-colors">
                  아티클
                </Link>
              </li>
              <li>
                <Link href="/lectures" className="text-gray-400 hover:text-primary-300 transition-colors">
                  온라인 강의
                </Link>
              </li>
              <li>
                <Link href="/strategy" className="text-gray-400 hover:text-primary-300 transition-colors">
                  입시 전략
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-400 hover:text-primary-300 transition-colors">
                  다희쌤 시간표
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">상담 문의</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:010-0000-0000"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>010-0000-0000</span>
                </a>
              </li>
              <li>
                <a
                  href="https://open.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>카카오톡 상담</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://blog.naver.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>네이버 블로그</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 위치 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">위치</h3>
            <div className="flex items-start gap-2 text-gray-400 mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                서울특별시 강남구 테헤란로 123
                <br />
                다희수학 학원 3층
              </span>
            </div>
            {/* 네이버 지도 임베드 (추후 실제 주소로 변경) */}
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-700">
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
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 다희쌤 수학. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

