import Hero from '../components/home/Hero';
import { motion } from 'motion/react';
import { PlayCircle, BookOpen, Bell, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      <Hero />
      
      {/* Enhanced Navigation Menu */}
      <section className="pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { title: 'NOTICES', desc: '공지사항', href: '/notices', icon: Bell },
              { title: 'LECTURES', desc: '온라인 강의실', href: '/lectures', icon: PlayCircle },
              { title: 'RESOURCES', desc: '학습 자료실', href: '/resources', icon: BookOpen },
              { title: 'Q&A', desc: '질의응답', href: '/qa', icon: MessageSquare },
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group relative p-8 rounded-3xl bg-gray-50 hover:bg-navy-950 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Subtle background icon */}
                <item.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-navy-900/5 group-hover:text-white/5 transition-colors duration-500" />
                
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 text-navy-900" />
                </div>
                
                <div className="text-[10px] font-bold tracking-[0.3em] text-navy-400 group-hover:text-navy-200 mb-2 transition-colors">
                  {item.title}
                </div>
                <h3 className="text-xl font-bold text-navy-950 group-hover:text-white transition-colors tracking-tight">
                  {item.desc}
                </h3>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
