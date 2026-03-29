import { motion } from 'motion/react';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative pt-64 pb-48 flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-radial from-navy-50/20 to-transparent blur-3xl" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-navy-900 select-none whitespace-nowrap"
        >
          CHEONHAPOMUN
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="block text-xl md:text-2xl text-navy-400 font-serif italic font-medium mb-1 tracking-[0.2em]"
            >
              천하에 학문을 베풀다
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl md:text-8xl font-black text-navy-950 leading-none tracking-tighter"
            >
              박상혁 국어
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
              className="h-px w-32 bg-navy-200 mt-12 mb-8"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
