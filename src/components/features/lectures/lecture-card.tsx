'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Lock, Calendar } from 'lucide-react';

// 날짜 포맷 함수 (2025. 11. 30 형식)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}. ${month}. ${day}`;
}
import type { Lecture } from '@/types';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils/youtube';

interface LectureCardProps {
  lecture: Lecture;
  hasAccess: boolean;
  index?: number;
}

export function LectureCard({ lecture, hasAccess, index = 0 }: LectureCardProps) {
  const videoId = extractYouTubeId(lecture.youtube_url);
  const thumbnailUrl = lecture.thumbnail_url || getYouTubeThumbnail(videoId, 'high');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {hasAccess ? (
        <Link href={`/lectures/${lecture.id}`}>
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 group"
          >
            {/* 썸네일 */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={thumbnailUrl}
                alt={lecture.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* 재생 버튼 오버레이 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  <Play className="w-7 h-7 text-primary-600 ml-1" fill="currentColor" />
                </motion.div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {lecture.title}
              </h3>
              {lecture.description && (
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {lecture.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(lecture.created_at)}</span>
              </div>
            </div>
          </motion.article>
        </Link>
      ) : (
        <motion.article
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 cursor-not-allowed"
        >
          {/* 썸네일 (잠금) */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={lecture.title}
              fill
              className="object-cover blur-sm grayscale"
            />
            {/* 자물쇠 오버레이 */}
            <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 text-sm font-medium">수강 권한이 필요합니다</p>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-400 line-clamp-2">
              {lecture.title}
            </h3>
            {lecture.description && (
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                {lecture.description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(lecture.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>권한 필요</span>
              </div>
            </div>
          </div>
        </motion.article>
      )}
    </motion.div>
  );
}

// 스켈레톤 UI
export function LectureCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-200" />
      <div className="p-5">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="mt-3 h-4 bg-slate-200 rounded w-full" />
        <div className="mt-2 h-4 bg-slate-200 rounded w-2/3" />
      </div>
    </div>
  );
}

