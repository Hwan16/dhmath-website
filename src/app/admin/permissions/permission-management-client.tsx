'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils/youtube';
import { 
  Search, 
  Check, 
  X, 
  User,
  ChevronDown,
  Star,
  Video,
  CheckCircle,
  Circle,
  Loader2
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  school: string | null;
  all_access: boolean;
}

interface Lecture {
  id: string;
  title: string;
  thumbnail_url: string | null;
  youtube_url: string;
}

interface PermissionManagementClientProps {
  students: Student[];
  lectures: Lecture[];
  selectedUserId: string | null;
  selectedStudent: Student | null;
  initialPermissions: string[];
}

export function PermissionManagementClient({
  students,
  lectures,
  selectedUserId,
  selectedStudent,
  initialPermissions,
}: PermissionManagementClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions, setPermissions] = useState<Set<string>>(new Set(initialPermissions));
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // 선택된 사용자가 변경되면 권한 초기화
  useEffect(() => {
    setPermissions(new Set(initialPermissions));
  }, [initialPermissions]);

  // 학생 검색 필터
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.school?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 학생 선택
  const handleSelectStudent = (studentId: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    router.push(`/admin/permissions?user=${studentId}`);
  };

  // 개별 권한 토글
  const handleTogglePermission = async (lectureId: string) => {
    if (!selectedUserId || selectedStudent?.all_access) return;
    
    setIsUpdating(lectureId);
    const hasPermission = permissions.has(lectureId);

    try {
      if (hasPermission) {
        // 권한 삭제
        const { error } = await supabase
          .from('lecture_permissions')
          .delete()
          .eq('user_id', selectedUserId)
          .eq('lecture_id', lectureId);

        if (error) throw error;
        
        setPermissions(prev => {
          const next = new Set(prev);
          next.delete(lectureId);
          return next;
        });
      } else {
        // 권한 추가
        const { error } = await supabase
          .from('lecture_permissions')
          .insert({
            user_id: selectedUserId,
            lecture_id: lectureId,
          });

        if (error) throw error;
        
        setPermissions(prev => new Set([...prev, lectureId]));
      }
    } catch (err: any) {
      console.error('권한 변경 실패:', err);
      alert('권한 변경에 실패했습니다: ' + err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  // 전체 권한 부여
  const handleGrantAll = async () => {
    if (!selectedUserId || selectedStudent?.all_access) return;
    
    setIsBulkUpdating(true);

    try {
      // 기존 권한 모두 삭제
      await supabase
        .from('lecture_permissions')
        .delete()
        .eq('user_id', selectedUserId);

      // 모든 강의에 대한 권한 추가
      const newPermissions = lectures.map(lecture => ({
        user_id: selectedUserId,
        lecture_id: lecture.id,
      }));

      const { error } = await supabase
        .from('lecture_permissions')
        .insert(newPermissions);

      if (error) throw error;
      
      setPermissions(new Set(lectures.map(l => l.id)));
    } catch (err: any) {
      console.error('전체 권한 부여 실패:', err);
      alert('전체 권한 부여에 실패했습니다: ' + err.message);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // 전체 권한 해제
  const handleRevokeAll = async () => {
    if (!selectedUserId || selectedStudent?.all_access) return;
    
    if (!confirm('모든 강의 권한을 해제하시겠습니까?')) return;

    setIsBulkUpdating(true);

    try {
      const { error } = await supabase
        .from('lecture_permissions')
        .delete()
        .eq('user_id', selectedUserId);

      if (error) throw error;
      
      setPermissions(new Set());
    } catch (err: any) {
      console.error('전체 권한 해제 실패:', err);
      alert('전체 권한 해제에 실패했습니다: ' + err.message);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 학생 선택 패널 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-1"
      >
        <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
          <h2 className="font-semibold text-slate-900 mb-4">학생 선택</h2>
          
          {/* 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              {selectedStudent ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{selectedStudent.name}</p>
                    {selectedStudent.school && (
                      <p className="text-xs text-slate-500">{selectedStudent.school}</p>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-slate-500">학생을 선택하세요</span>
              )}
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 드롭다운 메뉴 */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {/* 검색 */}
                  <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="이름 또는 학교 검색..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* 학생 목록 */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleSelectStudent(student.id)}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${
                            student.id === selectedUserId ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            student.all_access
                              ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                              : 'bg-slate-200'
                          }`}>
                            <span className="text-sm font-bold text-white">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900 truncate">{student.name}</p>
                              {student.all_access && (
                                <Star className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            {student.school && (
                              <p className="text-xs text-slate-500 truncate">{student.school}</p>
                            )}
                          </div>
                          {student.id === selectedUserId && (
                            <Check className="w-5 h-5 text-primary-500" />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-center text-slate-500 text-sm">
                        검색 결과가 없습니다
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 선택된 학생 정보 */}
          {selectedStudent && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              {selectedStudent.all_access ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-slate-900">전체 접근 권한</p>
                  <p className="text-sm text-slate-500 mt-1">
                    모든 강의를 시청할 수 있습니다
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">부여된 권한</span>
                    <span className="font-bold text-primary-600">
                      {permissions.size} / {lectures.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGrantAll}
                      disabled={isBulkUpdating}
                      className="flex-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      전체 부여
                    </button>
                    <button
                      onClick={handleRevokeAll}
                      disabled={isBulkUpdating || permissions.size === 0}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      전체 해제
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 강의 목록 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {selectedStudent ? (
            lectures.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {lectures.map((lecture, index) => {
                  const videoId = extractYouTubeId(lecture.youtube_url);
                  const hasPermission = selectedStudent.all_access || permissions.has(lecture.id);
                  const isLoading = isUpdating === lecture.id;

                  return (
                    <motion.div
                      key={lecture.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 flex items-center gap-4"
                    >
                      {/* 체크박스 */}
                      <button
                        onClick={() => handleTogglePermission(lecture.id)}
                        disabled={selectedStudent.all_access || isLoading}
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedStudent.all_access
                            ? 'bg-primary-100 cursor-not-allowed'
                            : hasPermission
                              ? 'bg-primary-500 hover:bg-primary-600'
                              : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : hasPermission ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : null}
                      </button>

                      {/* 썸네일 */}
                      <div className="w-24 flex-shrink-0">
                        <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={lecture.thumbnail_url || getYouTubeThumbnail(videoId, 'medium')}
                            alt={lecture.title}
                            className={`w-full h-full object-cover ${!hasPermission && !selectedStudent.all_access ? 'opacity-50' : ''}`}
                          />
                        </div>
                      </div>

                      {/* 제목 */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium line-clamp-2 ${
                          hasPermission ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {lecture.title}
                        </h3>
                      </div>

                      {/* 상태 뱃지 */}
                      {hasPermission && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full flex-shrink-0">
                          수강 가능
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">등록된 강의가 없습니다</p>
              </div>
            )
          ) : (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                학생을 선택하세요
              </h3>
              <p className="text-slate-500">
                왼쪽에서 권한을 설정할 학생을 선택해주세요
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

