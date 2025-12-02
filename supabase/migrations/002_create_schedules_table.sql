-- =============================================
-- 시간표 (일정) 테이블 생성
-- =============================================

-- schedules 테이블 생성
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                           -- 일정명
  description TEXT,                              -- 상세 설명
  location TEXT,                                 -- 장소
  start_time TIMESTAMPTZ NOT NULL,               -- 시작 시간
  end_time TIMESTAMPTZ,                          -- 종료 시간
  type TEXT DEFAULT 'class' CHECK (type IN ('class', 'special', 'consultation', 'other')),  -- 일정 유형
  color TEXT DEFAULT '#6366F1',                  -- 색상 (인디고 기본)
  is_recurring BOOLEAN DEFAULT FALSE,            -- 반복 일정 여부 (추후 확장용)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자 읽기 가능
CREATE POLICY "Anyone can read schedules"
  ON public.schedules FOR SELECT
  USING (true);

-- 정책: 관리자만 삽입 가능
CREATE POLICY "Only admins can insert schedules"
  ON public.schedules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 수정 가능
CREATE POLICY "Only admins can update schedules"
  ON public.schedules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책: 관리자만 삭제 가능
CREATE POLICY "Only admins can delete schedules"
  ON public.schedules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON public.schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_schedules_type ON public.schedules(type);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_schedules_updated_at();

-- =============================================
-- 샘플 데이터 (선택사항 - 테스트용)
-- =============================================
-- INSERT INTO public.schedules (title, description, location, start_time, end_time, type, color) VALUES
-- ('고1 정규반', '고1 정규 수업 - 이차함수', '학원 301호', '2024-12-02 16:00:00+09', '2024-12-02 18:00:00+09', 'class', '#6366F1'),
-- ('고2 심화반', '고2 심화 수업 - 미적분 기초', '학원 302호', '2024-12-03 19:00:00+09', '2024-12-03 21:00:00+09', 'special', '#EC4899'),
-- ('개인 상담', '학부모 상담', '상담실', '2024-12-04 14:00:00+09', '2024-12-04 15:00:00+09', 'consultation', '#10B981'),
-- ('고3 파이널', '고3 수능 대비 파이널 특강', '학원 대강당', '2024-12-05 09:00:00+09', '2024-12-05 12:00:00+09', 'special', '#F59E0B');
