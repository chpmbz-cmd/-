import { User } from 'lucide-react';
import { motion } from 'motion/react';
import BoardTabs from '../components/BoardTabs';

const reviews = [
  {
    id: 26,
    title: '우유빛깔 박상혁 ~^_^~',
    author: '양**',
    date: '2025.11.20',
  },
  {
    id: 25,
    title: '민족의 영웅, 어린이의 영웅 국어 강사 박상혁',
    author: '정**',
    date: '2025.11.06',
  },
  {
    id: 24,
    title: '세상에 단 한 명의 박상혁 수강생도 없다면, 나는 그제서야 이 세상에 없는 것이다.',
    author: '김**',
    date: '2025.10.29',
  },
  {
    id: 23,
    title: '갓상혁',
    author: '박**',
    date: '2025.10.27',
  },
  {
    id: 22,
    title: '그 누가 부정하리라, 그가 최고의 국어 강사임을',
    author: '심**',
    date: '2025.10.27',
  }
];

export default function Reviews() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">수강후기</h1>

        <BoardTabs />

        {/* Review List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-sm font-bold text-gray-400 w-6">{review.id}</div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{review.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={12} className="text-gray-400" />
                  </div>
                  <span>{review.author}</span>
                  <span>·</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
