import { createClient } from './server';
import type { Lecture, LecturePermission } from '@/types';

// 모든 활성 강의 조회
export async function getLectures(): Promise<Lecture[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('강의 목록 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 모든 강의 조회 (관리자용 - 비활성 포함)
export async function getAllLectures(): Promise<Lecture[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('전체 강의 목록 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 단일 강의 조회
export async function getLecture(id: string): Promise<Lecture | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('강의 조회 실패:', error);
    return null;
  }

  return data;
}

// 사용자의 강의 권한 조회
export async function getUserLecturePermissions(userId: string): Promise<string[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lecture_permissions')
    .select('lecture_id')
    .eq('user_id', userId);

  if (error) {
    console.error('강의 권한 조회 실패:', error);
    return [];
  }

  return data?.map(p => p.lecture_id) || [];
}

// 사용자의 전체 접근 권한 확인
export async function hasAllAccess(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('all_access, role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('접근 권한 조회 실패:', error);
    return false;
  }

  // 관리자이거나 전체 접근 권한이 있으면 true
  return data?.role === 'admin' || data?.all_access === true;
}

// 특정 강의에 대한 접근 권한 확인
export async function hasLectureAccess(userId: string, lectureId: string): Promise<boolean> {
  // 전체 접근 권한 확인
  const allAccess = await hasAllAccess(userId);
  if (allAccess) return true;

  // 개별 강의 권한 확인
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lecture_permissions')
    .select('id')
    .eq('user_id', userId)
    .eq('lecture_id', lectureId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 결과 없음
    console.error('강의 권한 확인 실패:', error);
  }

  return !!data;
}

// YouTube 유틸리티는 '@/lib/utils/youtube'에서 import하세요
// (클라이언트 컴포넌트에서도 사용 가능)

