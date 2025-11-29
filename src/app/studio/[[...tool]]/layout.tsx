export const metadata = {
  title: '다희쌤 수학 - 콘텐츠 관리',
  description: 'Sanity Studio',
};

// Studio는 자체 레이아웃을 사용하므로 children만 반환
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

