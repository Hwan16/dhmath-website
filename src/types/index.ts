// 사용자 프로필 타입
export interface Profile {
  id: string;
  name: string;
  phone?: string;
  school?: string;        // 학교명
  birth_date?: string;    // 생년월일
  role: 'student' | 'admin';
  all_access: boolean;
  created_at: string;
  updated_at: string;
}

// 강의 타입
export interface Lecture {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 강의 권한 타입
export interface LecturePermission {
  id: string;
  user_id: string;
  lecture_id: string;
  granted_at: string;
  granted_by?: string;
}

// 인증 폼 타입
export interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  school?: string;        // 학교명
  birth_date?: string;    // 생년월일
}

export interface LoginFormData {
  email: string;
  password: string;
}

