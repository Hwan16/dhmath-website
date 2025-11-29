import { client } from './client';
import { postsQuery, recentPostsQuery, postDetailQuery } from './queries';
import type { Post, PostDetail } from '@/types/sanity';

// 카테고리별 게시글 목록 조회
export async function getPosts(category: 'article' | 'strategy'): Promise<Post[]> {
  return client.fetch(postsQuery, { category });
}

// 최신 게시글 조회 (홈페이지용)
export async function getRecentPosts(
  category: 'article' | 'strategy',
  limit: number = 3
): Promise<Post[]> {
  return client.fetch(recentPostsQuery, { category, limit });
}

// 게시글 상세 조회
export async function getPostDetail(slug: string): Promise<PostDetail | null> {
  return client.fetch(postDetailQuery, { slug });
}

// 모든 게시글 슬러그 조회 (정적 생성용)
export async function getAllPostSlugs(category: 'article' | 'strategy'): Promise<string[]> {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "post" && category == $category] { slug }`,
    { category }
  );
  return slugs.map((post) => post.slug.current);
}

