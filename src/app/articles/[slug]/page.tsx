import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { getPostDetail, getAllPostSlugs } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/client";
import { PostBody } from "@/components/features/articles";

const defaultOgImage = "/opengraph-image.png";

interface ArticleDetailPageProps {
  params: { slug: string };
}

// 정적 경로 생성
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs('article');
  return slugs.map((slug) => ({ slug }));
}

// 동적 메타데이터
export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const post = await getPostDetail(params.slug);
  
  if (!post) {
    return { title: "아티클을 찾을 수 없습니다" };
  }

  const ogImage = post.thumbnail
    ? urlFor(post.thumbnail).width(1200).height(630).url()
    : defaultOgImage;

  return {
    title: `${post.title} | 다희쌤 수학`,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `/articles/${params.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${post.title} | 다희쌤 수학`,
      description: post.excerpt || post.title,
      publishedTime: post.publishedAt,
      url: `/articles/${params.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | 다희쌤 수학`,
      description: post.excerpt || post.title,
      images: [ogImage],
    },
  };
}

// 페이지 재검증
export const revalidate = 60;

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const post = await getPostDetail(params.slug);

  if (!post || post.category !== 'article') {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="container mx-auto px-4 max-w-3xl py-12">
      {/* 뒤로가기 */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-500 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        아티클 목록으로
      </Link>

      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <time>{formattedDate}</time>
        </div>
      </header>

      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10">
          <Image
            src={urlFor(post.thumbnail).width(800).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 본문 */}
      <div className="mb-16">
        <PostBody body={post.body || []} />
      </div>

      {/* 이전/다음 글 네비게이션 */}
      <nav className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {post.previousPost ? (
            <Link
              href={`/articles/${post.previousPost.slug.current}`}
              className="group p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors"
            >
              <span className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                <ChevronLeft className="w-4 h-4" />
                이전 글
              </span>
              <span className="font-medium text-gray-800 group-hover:text-primary-500 transition-colors line-clamp-1">
                {post.previousPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {post.nextPost && (
            <Link
              href={`/articles/${post.nextPost.slug.current}`}
              className="group p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors text-right"
            >
              <span className="text-sm text-gray-500 flex items-center justify-end gap-1 mb-1">
                다음 글
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="font-medium text-gray-800 group-hover:text-primary-500 transition-colors line-clamp-1">
                {post.nextPost.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

