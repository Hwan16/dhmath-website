'use client';

import { GraduationCap, Trophy, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const credentials = [
  { icon: GraduationCap, text: '서울대학교 수리과학부 졸업', color: 'from-blue-500 to-cyan-500' },
  { icon: Trophy, text: '대치동 주요 학원 출강 경력 10년', color: 'from-amber-500 to-orange-500' },
  { icon: Users, text: '누적 수강생 2,000명+', color: 'from-green-500 to-emerald-500' },
  { icon: Star, text: '수능 만점자 다수 배출', color: 'from-purple-500 to-pink-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function CredentialsSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {credentials.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100"
              >
                <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm md:text-base text-slate-700 font-medium">
                  {item.text}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
