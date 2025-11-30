-- 강의 시스템 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요

-- =====================================================
-- 1. lectures 테이블 (강의 정보)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lectures_order ON public.lectures(order_index);
CREATE INDEX IF NOT EXISTS idx_lectures_active ON public.lectures(is_active);

-- RLS 활성화
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 로그인 사용자가 활성 강의 조회 가능
CREATE POLICY "Authenticated users can read active lectures"
  ON public.lectures FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 정책: 관리자는 모든 강의 조회 가능
CREATE POLICY "Admins can read all lectures"
  ON public.lectures FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 강의 추가 가능
CREATE POLICY "Admins can insert lectures"
  ON public.lectures FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 강의 수정 가능
CREATE POLICY "Admins can update lectures"
  ON public.lectures FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 강의 삭제 가능
CREATE POLICY "Admins can delete lectures"
  ON public.lectures FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 2. lecture_permissions 테이블 (강의 권한)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lecture_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, lecture_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_permissions_user ON public.lecture_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_lecture ON public.lecture_permissions(lecture_id);

-- RLS 활성화
ALTER TABLE public.lecture_permissions ENABLE ROW LEVEL SECURITY;

-- 정책: 본인 권한만 조회 가능
CREATE POLICY "Users can read own permissions"
  ON public.lecture_permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 정책: 관리자는 모든 권한 조회 가능
CREATE POLICY "Admins can read all permissions"
  ON public.lecture_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 권한 부여 가능
CREATE POLICY "Admins can insert permissions"
  ON public.lecture_permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 권한 삭제 가능
CREATE POLICY "Admins can delete permissions"
  ON public.lecture_permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 3. 트리거: updated_at 자동 업데이트
-- =====================================================
-- 함수 생성 (이미 존재하면 건너뜀)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- lectures 테이블 트리거
DROP TRIGGER IF EXISTS update_lectures_updated_at ON public.lectures;
CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. 테스트용 샘플 데이터 (선택사항)
-- =====================================================
-- 필요하면 아래 주석 해제하여 실행
/*
INSERT INTO public.lectures (title, description, youtube_url, thumbnail_url, order_index) VALUES
('수학1 - 지수함수와 로그함수', '지수함수와 로그함수의 기본 개념을 학습합니다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 1),
('수학1 - 삼각함수', '삼각함수의 정의와 그래프를 알아봅니다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 2),
('수학2 - 함수의 극한', '함수의 극한 개념과 계산 방법을 배웁니다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 3);
*/

