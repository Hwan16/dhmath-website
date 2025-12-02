'use client';

import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DayCellContentArg } from '@fullcalendar/core';
import { ChevronLeft, ChevronRight, X, Clock, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getSchedules, scheduleToCalendarEvent } from '@/lib/supabase/schedules';

// 일정 타입 정의
export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    description?: string;
    location?: string;
    type?: 'class' | 'consultation' | 'other';
  };
}

// 더미 일정 데이터 (Supabase 연결 전 또는 데이터 없을 때 사용)
const dummyEvents: ScheduleEvent[] = [
  {
    id: 'demo-1',
    title: '고1 정규반',
    start: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0] + 'T16:00:00',
    end: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0] + 'T18:00:00',
    backgroundColor: '#6366F1',
    borderColor: '#4F46E5',
    textColor: '#FFFFFF',
    extendedProps: {
      description: '고1 정규 수업 - 이차함수 (데모 데이터)',
      location: '학원 301호',
      type: 'class',
    },
  },
  {
    id: 'demo-2',
    title: '고2 심화반',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + 'T19:00:00',
    end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + 'T21:00:00',
    backgroundColor: '#EC4899',
    borderColor: '#DB2777',
    textColor: '#FFFFFF',
    extendedProps: {
      description: '고2 심화 수업 - 미적분 기초 (데모 데이터)',
      location: '학원 302호',
      type: 'class',
    },
  },
  {
    id: 'demo-3',
    title: '개인 상담',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] + 'T14:00:00',
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] + 'T15:00:00',
    backgroundColor: '#10B981',
    borderColor: '#059669',
    textColor: '#FFFFFF',
    extendedProps: {
      description: '학부모 상담 (데모 데이터)',
      location: '상담실',
      type: 'consultation',
    },
  },
];

export function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>(dummyEvents);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Supabase에서 일정 데이터 로드
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await getSchedules(supabase);
        if (schedules.length > 0) {
          // Supabase 데이터가 있으면 사용
          const calendarEvents = schedules.map(scheduleToCalendarEvent);
          setEvents(calendarEvents);
        }
        // 데이터가 없으면 더미 데이터 유지
      } catch (error) {
        console.error('일정 로드 실패:', error);
        // 에러 시 더미 데이터 유지
      }
      setLoading(false);
    };

    loadSchedules();
  }, []);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 캘린더 제목 업데이트
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title);
    }
  }, [loading]);

  // 이전 달 이동
  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  // 다음 달 이동
  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  // 오늘로 이동
  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  // 일정 클릭 핸들러
  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr || undefined,
      backgroundColor: event.backgroundColor || undefined,
      extendedProps: event.extendedProps as ScheduleEvent['extendedProps'],
    });
    setIsModalOpen(true);
  };

  // 날짜 셀 커스터마이징 - 숫자만 표시
  const renderDayCellContent = (arg: DayCellContentArg) => {
    return <span>{arg.dayNumberText.replace('일', '')}</span>;
  };

  // 시간 포맷팅
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="w-full">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-slate-900">
          {currentTitle}
        </h2>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handleToday}
            className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-300"
          >
            오늘
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 md:p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 md:p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
            aria-label="다음 달"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="bg-white rounded-2xl shadow-card p-2 md:p-6 overflow-hidden calendar-container">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={false}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          dayMaxEvents={isMobile ? 2 : 3}
          moreLinkText={(n) => `+${n}`}
          dayCellContent={renderDayCellContent}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          datesSet={(dateInfo) => {
            setCurrentTitle(dateInfo.view.title);
          }}
          eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
        />
        )}
      </div>

      {/* 범례 */}
      <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary-500" />
          <span className="text-xs md:text-sm text-slate-600">정규 수업</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent-500" />
          <span className="text-xs md:text-sm text-slate-600">보충수업</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500" />
          <span className="text-xs md:text-sm text-slate-600">클리닉</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500" />
          <span className="text-xs md:text-sm text-slate-600">설명회</span>
        </div>
      </div>

      {/* 일정 상세 모달 */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                {/* 모달 헤더 */}
                <div 
                  className="px-5 md:px-6 py-4 text-white"
                  style={{ backgroundColor: selectedEvent.backgroundColor || '#6366F1' }}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg md:text-xl font-bold">{selectedEvent.title}</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="닫기"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 모달 내용 */}
                <div className="p-5 md:p-6 space-y-4">
                  {/* 날짜 */}
                  <div className="text-slate-900 font-medium text-sm md:text-base">
                    {formatDate(selectedEvent.start)}
                  </div>

                  {/* 시간 */}
                  <div className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    <span>
                      {formatTime(selectedEvent.start)}
                      {selectedEvent.end && ` - ${formatTime(selectedEvent.end)}`}
                    </span>
                  </div>

                  {/* 장소 */}
                  {selectedEvent.extendedProps?.location && (
                    <div className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                      <span>{selectedEvent.extendedProps.location}</span>
                    </div>
                  )}

                  {/* 설명 */}
                  {selectedEvent.extendedProps?.description && (
                    <div className="flex items-start gap-3 text-slate-600 text-sm md:text-base">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mt-0.5" />
                      <span>{selectedEvent.extendedProps.description}</span>
                    </div>
                  )}
                </div>

                {/* 모달 푸터 */}
                <div className="px-5 md:px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors duration-300 text-sm md:text-base"
                  >
                    확인
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
