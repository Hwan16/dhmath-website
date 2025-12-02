'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Schedule, 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  scheduleTypeColors 
} from '@/lib/supabase/schedules';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScheduleManagementClient() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    type: 'class' as Schedule['type'],
    color: '#6366F1',
  });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  // 일정 목록 로드
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    const data = await getSchedules(supabase);
    setSchedules(data);
    setLoading(false);
  };

  // 모달 열기 (추가/수정)
  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      const { date: startDate, time: startTime } = splitDateTime(schedule.start_time);
      const { date: endDate, time: endTime } = schedule.end_time 
        ? splitDateTime(schedule.end_time) 
        : { date: '', time: '' };
      setFormData({
        title: schedule.title,
        description: schedule.description || '',
        location: schedule.location || '',
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
        type: schedule.type,
        color: schedule.color,
      });
    } else {
      setEditingSchedule(null);
      // 기본값: 오늘 날짜
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        location: '',
        start_date: today,
        start_time: '',
        end_date: today,
        end_time: '',
        type: 'class',
        color: '#6366F1',
      });
    }
    setIsModalOpen(true);
  };

  // 날짜/시간 분리 (DB → form)
  const splitDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5), // HH:MM
    };
  };

  // 날짜/시간 합치기 (form → DB)
  const combineDateTime = (date: string, time: string) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00`).toISOString();
  };

  // 날짜 표시 포맷
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 타입 변경 시 색상 자동 설정
  const handleTypeChange = (type: Schedule['type']) => {
    setFormData({
      ...formData,
      type,
      color: scheduleTypeColors[type].color,
    });
  };

  // 저장
  const handleSave = async () => {
    if (!formData.title || !formData.start_date || !formData.start_time) {
      alert('제목, 날짜, 시작 시간은 필수입니다.');
      return;
    }

    const startDateTime = combineDateTime(formData.start_date, formData.start_time);
    const endDateTime = formData.end_time 
      ? combineDateTime(formData.end_date || formData.start_date, formData.end_time) 
      : null;

    if (!startDateTime) {
      alert('시작 시간 형식이 올바르지 않습니다.');
      return;
    }

    setSaving(true);

    try {
      if (editingSchedule) {
        // 수정
        const updated = await updateSchedule(supabase, editingSchedule.id, {
          title: formData.title,
          description: formData.description || null,
          location: formData.location || null,
          start_time: startDateTime,
          end_time: endDateTime,
          type: formData.type,
          color: formData.color,
          is_recurring: false,
        });

        if (updated) {
          setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
          setIsModalOpen(false);
        } else {
          alert('일정 수정에 실패했습니다.');
        }
      } else {
        // 추가
        const created = await createSchedule(supabase, {
          title: formData.title,
          description: formData.description || null,
          location: formData.location || null,
          start_time: startDateTime,
          end_time: endDateTime,
          type: formData.type,
          color: formData.color,
          is_recurring: false,
        });

        if (created) {
          setSchedules([...schedules, created]);
          setIsModalOpen(false);
        } else {
          alert('일정 추가에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }

    setSaving(false);
  };

  // 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const success = await deleteSchedule(supabase, id);
    if (success) {
      setSchedules(schedules.filter(s => s.id !== id));
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">일정 관리</h1>
          <p className="text-slate-600 mt-1">시간표에 표시될 일정을 관리합니다.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          일정 추가
        </button>
      </div>

      {/* 일정 목록 */}
      {schedules.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">등록된 일정이 없습니다.</p>
          <button
            onClick={() => openModal()}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            첫 일정 추가하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">일정명</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">유형</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">시작 시간</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">종료 시간</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">장소</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: schedule.color }}
                        />
                        <span className="font-medium text-slate-900">{schedule.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: schedule.color }}
                      >
                        {scheduleTypeColors[schedule.type]?.label || schedule.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDateTime(schedule.start_time)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {schedule.end_time ? formatDateTime(schedule.end_time) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {schedule.location || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(schedule)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 일정 추가/수정 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingSchedule ? '일정 수정' : '새 일정 추가'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 모달 내용 */}
                <div className="p-6 space-y-4">
                  {/* 제목 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      일정명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 고1 정규반"
                      className="input-field"
                    />
                  </div>

                  {/* 유형 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      유형
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(scheduleTypeColors).map(([key, { color, label }]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTypeChange(key as Schedule['type'])}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                            formData.type === key 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 날짜 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      날짜 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          start_date: e.target.value,
                          end_date: e.target.value // 종료일도 같은 날짜로 설정
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {/* 시작/종료 시간 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        시작 시간 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          placeholder="14:00"
                          maxLength={5}
                          className="input-field pl-10 font-mono"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">HH:MM (예: 14:00)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        종료 시간
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          placeholder="16:00"
                          maxLength={5}
                          className="input-field pl-10 font-mono"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">HH:MM (예: 16:00)</p>
                    </div>
                  </div>

                  {/* 장소 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      장소
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="예: 학원 301호"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {/* 설명 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      상세 설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="수업 내용이나 참고사항을 입력하세요"
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>

                {/* 모달 푸터 */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {saving ? '저장 중...' : (editingSchedule ? '수정' : '추가')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
