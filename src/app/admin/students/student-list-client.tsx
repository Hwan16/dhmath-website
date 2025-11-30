'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';
import { 
  Search, 
  Shield, 
  Check, 
  X, 
  User,
  School,
  Calendar,
  Phone,
  Mail,
  Star,
  MoreVertical
} from 'lucide-react';

interface StudentWithPermissions extends Profile {
  permissionCount: number;
}

interface StudentListClientProps {
  initialStudents: StudentWithPermissions[];
}

export function StudentListClient({ initialStudents }: StudentListClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [students, setStudents] = useState<StudentWithPermissions[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // 검색 필터링
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.school?.toLowerCase().includes(query) ||
      student.phone?.includes(query)
    );
  }, [students, searchQuery]);

  // 전체 접근 권한 토글
  const handleToggleAllAccess = async (student: StudentWithPermissions) => {
    setIsUpdating(student.id);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ all_access: !student.all_access })
        .eq('id', student.id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { ...s, all_access: !s.all_access }
            : s
        )
      );
    } catch (err: any) {
      console.error('권한 변경 실패:', err);
      alert('권한 변경에 실패했습니다: ' + err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <>
      {/* 검색 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름, 학교, 전화번호로 검색..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </motion.div>

      {/* 학생 목록 */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* 프로필 */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      student.all_access 
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                        : 'bg-gradient-to-br from-slate-200 to-slate-300'
                    }`}>
                      <span className="text-lg font-bold text-white">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{student.name}</h3>
                        {student.all_access && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            전체 접근
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        {student.school && (
                          <span className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5" />
                            {student.school}
                          </span>
                        )}
                        {student.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {student.phone}
                          </span>
                        )}
                        {student.birth_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {student.birth_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 권한 정보 & 액션 */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* 권한 개수 */}
                    <div className="text-center px-3 py-1.5 bg-slate-50 rounded-lg">
                      <p className="text-lg font-bold text-slate-900">
                        {student.all_access ? '전체' : student.permissionCount}
                      </p>
                      <p className="text-xs text-slate-500">강의 권한</p>
                    </div>

                    {/* 전체 접근 토글 */}
                    <button
                      onClick={() => handleToggleAllAccess(student)}
                      disabled={isUpdating === student.id}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        student.all_access
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      } disabled:opacity-50`}
                    >
                      {isUpdating === student.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : student.all_access ? (
                        <>
                          <X className="w-4 h-4" />
                          전체 해제
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          전체 부여
                        </>
                      )}
                    </button>

                    {/* 개별 권한 설정 */}
                    <Link
                      href={`/admin/permissions?user=${student.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                    >
                      <Shield className="w-4 h-4" />
                      권한 설정
                    </Link>
                  </div>
                </div>

                {/* 가입일 */}
                <div className="mt-3 text-xs text-slate-400">
                  {new Date(student.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })} 가입
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-slate-500">
                  "{searchQuery}"에 해당하는 학생이 없습니다.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  등록된 학생이 없습니다
                </h3>
                <p className="text-slate-500">
                  학생이 회원가입하면 여기에 표시됩니다.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

