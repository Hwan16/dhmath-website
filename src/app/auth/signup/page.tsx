'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    school: '',
    birthDate: '',
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

    if (!formData.email || !formData.password || !formData.name) {
      setError('이메일, 비밀번호, 이름은 필수 입력 항목입니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone || null,
            school: formData.school || null,
            birth_date: formData.birthDate || null,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('이미 가입된 이메일입니다.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 성공 화면
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 text-center border border-slate-100 relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            회원가입 완료!
          </h1>
          <p className="text-slate-600 mb-8">
            이메일 인증 후 로그인해주세요.
            <br />
            <span className="text-slate-500 text-sm">(스팸 메일함도 확인해주세요)</span>
          </p>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth/login"
              className="block w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              로그인하러 가기
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">회원가입</h1>
          <p className="text-slate-600">다희쌤 수학과 함께 시작해요!</p>
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
              이메일 <span className="text-red-500">*</span>
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="6자 이상 입력해주세요"
                className="input-field pr-12"
                required
                minLength={6}
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

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-slate-700 mb-2">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              className="input-field"
              required
            />
          </div>

          {/* 이름 */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="input-field"
              required
            />
          </div>

          {/* 전화번호 */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="input-field"
            />
          </div>

          {/* 학교명 */}
          <div className="mb-4">
            <label htmlFor="school" className="block text-sm font-medium text-slate-700 mb-2">
              학교명
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="ex) OO고등학교"
              className="input-field"
            />
          </div>

          {/* 생년월일 */}
          <div className="mb-6">
            <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
              생년월일
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="input-field"
            />
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
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </motion.button>

          {/* 로그인 링크 */}
          <p className="mt-6 text-center text-sm text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              로그인
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
