import { groq } from 'next-sanity';

// 카테고리별 게시글 목록 (고정글 먼저, 그 다음 최신순)
export const postsQuery = groq`
  *[_type == "post" && category == $category] | order(isPinned desc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    thumbnail,
    isPinned,
    publishedAt
  }
`;

// 최신 게시글 (홈페이지용)
export const recentPostsQuery = groq`
  *[_type == "post" && category == $category] | order(isPinned desc, publishedAt desc)[0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    thumbnail,
    isPinned,
    publishedAt
  }
`;

// 단일 게시글 상세
export const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    category,
    thumbnail,
    body,
    publishedAt,
    "previousPost": *[_type == "post" && category == ^.category && publishedAt < ^.publishedAt] | order(publishedAt desc)[0] {
      title,
      slug
    },
    "nextPost": *[_type == "post" && category == ^.category && publishedAt > ^.publishedAt] | order(publishedAt asc)[0] {
      title,
      slug
    }
  }
`;

