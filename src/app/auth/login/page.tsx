'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

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

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24 bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* 배경 장식 */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* 헤더 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">로그인</h1>
          <p className="text-slate-600">다시 만나서 반가워요!</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 border border-slate-100">
          {/* 에러 메시지 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* 이메일 */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="input-field"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
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
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl 
                     hover:shadow-lg transition-all duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                로그인
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* 비밀번호 찾기 */}
          <div className="mt-4 text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {/* 회원가입 링크 */}
          <p className="mt-6 text-center text-sm text-slate-600">
            아직 계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              회원가입
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
