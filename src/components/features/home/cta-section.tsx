'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-4xl text-center relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            무료 상담을 통해 맞춤형 학습 계획을 받아보세요.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="tel:010-0000-0000"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="w-5 h-5" />
            전화 상담
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="https://open.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-yellow-300 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            카카오톡 상담
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
