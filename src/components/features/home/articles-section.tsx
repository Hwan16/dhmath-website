'use client';

import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArticleCard } from '@/components/features/articles';
import type { Post } from '@/types/sanity';

interface ArticlesSectionProps {
  articles: Post[];
}

export function ArticlesSection({ articles }: ArticlesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                최신 아티클
              </h2>
            </div>
            <Link
              href="/articles"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors group"
            >
              더보기
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post, index) => (
              <ArticleCard key={post._id} post={post} basePath="/articles" index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-2xl shadow-card"
          >
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">아직 작성된 아티클이 없습니다</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

