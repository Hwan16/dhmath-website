'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils/youtube';
import type { Lecture } from '@/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  Eye, 
  EyeOff,
  GripVertical,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface LectureManagementClientProps {
  initialLectures: Lecture[];
}

export function LectureManagementClient({ initialLectures }: LectureManagementClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [lectures, setLectures] = useState<Lecture[]>(initialLectures);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    is_active: true,
  });

  // 모달 열기 (새 강의 or 수정)
  const openModal = (lecture?: Lecture) => {
    if (lecture) {
      setEditingLecture(lecture);
      setFormData({
        title: lecture.title,
        description: lecture.description || '',
        youtube_url: lecture.youtube_url,
        is_active: lecture.is_active,
      });
    } else {
      setEditingLecture(null);
      setFormData({
        title: '',
        description: '',
        youtube_url: '',
        is_active: true,
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLecture(null);
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      is_active: true,
    });
    setError('');
  };

  // 강의 저장 (추가 or 수정)
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('강의 제목을 입력해주세요.');
      return;
    }
    if (!formData.youtube_url.trim()) {
      setError('YouTube URL을 입력해주세요.');
      return;
    }

    const videoId = extractYouTubeId(formData.youtube_url);
    if (!videoId) {
      setError('올바른 YouTube URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const lectureData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        youtube_url: formData.youtube_url.trim(),
        thumbnail_url: getYouTubeThumbnail(videoId, 'high'),
        is_active: formData.is_active,
      };

      if (editingLecture) {
        // 수정
        const { error } = await supabase
          .from('lectures')
          .update(lectureData)
          .eq('id', editingLecture.id);

        if (error) throw error;
      } else {
        // 새 강의 추가
        const maxOrder = Math.max(...lectures.map(l => l.order_index), 0);
        const { error } = await supabase
          .from('lectures')
          .insert({ ...lectureData, order_index: maxOrder + 1 });

        if (error) throw error;
      }

      closeModal();
      router.refresh();
    } catch (err: any) {
      console.error('강의 저장 실패:', err);
      setError(err.message || '강의 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 강의 삭제
  const handleDelete = async (lecture: Lecture) => {
    if (!confirm(`"${lecture.title}" 강의를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', lecture.id);

      if (error) throw error;
      
      router.refresh();
    } catch (err: any) {
      console.error('강의 삭제 실패:', err);
      alert('강의 삭제에 실패했습니다: ' + err.message);
    }
  };

  // 활성/비활성 토글
  const handleToggleActive = async (lecture: Lecture) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .update({ is_active: !lecture.is_active })
        .eq('id', lecture.id);

      if (error) throw error;
      
      router.refresh();
    } catch (err: any) {
      console.error('상태 변경 실패:', err);
      alert('상태 변경에 실패했습니다: ' + err.message);
    }
  };

  return (
    <>
      {/* 추가 버튼 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal()}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        새 강의 추가
      </motion.button>

      {/* 강의 목록 */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {lectures.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {lectures.map((lecture, index) => {
              const videoId = extractYouTubeId(lecture.youtube_url);
              
              return (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 md:p-6 flex flex-col md:flex-row gap-4 ${
                    !lecture.is_active ? 'bg-slate-50 opacity-60' : ''
                  }`}
                >
                  {/* 썸네일 */}
                  <div className="relative w-full md:w-48 flex-shrink-0">
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={lecture.thumbnail_url || getYouTubeThumbnail(videoId, 'medium')}
                        alt={lecture.title}
                        className="w-full h-full object-cover"
                      />
                      {!lecture.is_active && (
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                          <span className="px-2 py-1 bg-slate-800 text-white text-xs rounded">
                            비활성
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                          {lecture.title}
                        </h3>
                        {lecture.description && (
                          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                            {lecture.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                          <span>순서: {lecture.order_index}</span>
                          <span>
                            {new Date(lecture.created_at).toLocaleDateString('ko-KR')} 등록
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={lecture.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        YouTube
                      </a>
                      <button
                        onClick={() => handleToggleActive(lecture)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${
                          lecture.is_active
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {lecture.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            비활성화
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            활성화
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openModal(lecture)}
                        className="px-3 py-1.5 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                      >
                        <Pencil className="w-4 h-4" />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(lecture)}
                        className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              등록된 강의가 없습니다
            </h3>
            <p className="text-slate-500 mb-4">
              첫 번째 강의를 추가해보세요.
            </p>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              강의 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 추가/수정 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* 모달 헤더 */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {editingLecture ? '강의 수정' : '새 강의 추가'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 모달 바디 */}
                <div className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* 제목 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      강의 제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 수학1 - 지수함수와 로그함수"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>

                  {/* YouTube URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      YouTube URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {formData.youtube_url && extractYouTubeId(formData.youtube_url) && (
                      <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={getYouTubeThumbnail(extractYouTubeId(formData.youtube_url), 'medium')}
                          alt="썸네일 미리보기"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* 설명 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      강의 설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="강의에 대한 간단한 설명을 입력하세요."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* 활성 상태 */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-900">강의 공개</p>
                      <p className="text-sm text-slate-500">비활성화하면 학생에게 보이지 않습니다.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.is_active ? 'bg-primary-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          formData.is_active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 모달 푸터 */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        저장
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

