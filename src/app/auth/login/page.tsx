'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 메일함을 확인해주세요.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      // 로그인 성공 - 홈으로 이동
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">로그인</h1>
          <p className="text-gray-600">다시 만나서 반가워요!</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* 이메일 */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-300 text-white font-medium rounded-xl hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>

          {/* 비밀번호 찾기 */}
          <div className="mt-4 text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-gray-500 hover:text-primary-500 transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {/* 회원가입 링크 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-primary-500 hover:text-primary-600 font-medium">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

