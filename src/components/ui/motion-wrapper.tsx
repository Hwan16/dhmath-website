'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// 섹션 애니메이션 래퍼
export function SectionWrapper({ children, className = '', delay = 0 }: WrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 스태거 컨테이너 래퍼
export function StaggerWrapper({ children, className = '' }: WrapperProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 스태거 아이템 래퍼
export function StaggerItem({ children, className = '' }: WrapperProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 페이드인 업 래퍼
export function FadeInUp({ children, className = '', delay = 0 }: WrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 호버 카드 래퍼
export function HoverCard({ children, className = '' }: WrapperProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

