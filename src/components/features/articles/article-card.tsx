'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { urlFor } from '@/lib/sanity/client';
import type { Post } from '@/types/sanity';

interface ArticleCardProps {
  post: Post;
  basePath: '/articles' | '/strategy';
  index?: number;
}

export function ArticleCard({ post, basePath, index = 0 }: ArticleCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      <Link
        href={`${basePath}/${post.slug.current}`}
        className="group block bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 h-full"
      >
        {/* 썸네일 */}
        <div className="relative aspect-video overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={urlFor(post.thumbnail).width(400).height(225).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
              <BookOpen className="w-12 h-12 text-primary-300" />
            </div>
          )}
          
          {/* 고정 배지 */}
          {post.isPinned && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 px-2.5 py-1 rounded-full shadow-md">
                📌 고정
              </span>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-slate-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
          )}
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>
      </Link>
    </motion.div>
  );
}

// 스켈레톤 로딩 컴포넌트
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="aspect-video bg-slate-100 animate-pulse" />
      <div className="p-5">
        <div className="h-5 bg-slate-100 rounded animate-pulse mb-2" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}
