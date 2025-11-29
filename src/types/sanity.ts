// Sanity 이미지 타입
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

// 게시글 목록용 타입
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  thumbnail?: SanityImage;
  isPinned: boolean;
  publishedAt: string;
}

// 게시글 상세 타입
export interface PostDetail extends Post {
  category: 'article' | 'strategy';
  body: any[]; // Portable Text
  previousPost?: { title: string; slug: { current: string } };
  nextPost?: { title: string; slug: { current: string } };
}

