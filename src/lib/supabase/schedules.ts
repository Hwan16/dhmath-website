import { SupabaseClient } from '@supabase/supabase-js';

// 일정 타입 정의
export interface Schedule {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  type: 'class' | 'special' | 'consultation' | 'other';
  color: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

// 일정 유형별 색상
export const scheduleTypeColors: Record<string, { color: string; label: string }> = {
  class: { color: '#6366F1', label: '정규 수업' },
  special: { color: '#EC4899', label: '보충수업' },
  consultation: { color: '#10B981', label: '클리닉' },
  other: { color: '#F59E0B', label: '설명회' },
};

// 모든 일정 조회
export async function getSchedules(supabase: SupabaseClient): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('start_time', { ascending: true });

  if (error) {
    console.error('일정 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 특정 월의 일정 조회
export async function getSchedulesByMonth(
  supabase: SupabaseClient,
  year: number,
  month: number
): Promise<Schedule[]> {
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .gte('start_time', startOfMonth)
    .lte('start_time', endOfMonth)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('월별 일정 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 일정 추가
export async function createSchedule(
  supabase: SupabaseClient,
  schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>
): Promise<Schedule | null> {
  const { data, error } = await supabase
    .from('schedules')
    .insert([schedule])
    .select()
    .single();

  if (error) {
    console.error('일정 추가 실패:', error);
    return null;
  }

  return data;
}

// 일정 수정
export async function updateSchedule(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Omit<Schedule, 'id' | 'created_at' | 'updated_at'>>
): Promise<Schedule | null> {
  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('일정 수정 실패:', error);
    return null;
  }

  return data;
}

// 일정 삭제
export async function deleteSchedule(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('일정 삭제 실패:', error);
    return false;
  }

  return true;
}

// Schedule을 FullCalendar 이벤트 형식으로 변환
export function scheduleToCalendarEvent(schedule: Schedule) {
  return {
    id: schedule.id,
    title: schedule.title,
    start: schedule.start_time,
    end: schedule.end_time || undefined,
    backgroundColor: schedule.color,
    borderColor: schedule.color,
    textColor: '#FFFFFF',
    extendedProps: {
      description: schedule.description,
      location: schedule.location,
      type: schedule.type,
    },
  };
}
