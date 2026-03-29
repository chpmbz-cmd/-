import { Bell, ChevronRight } from 'lucide-react';
import BoardTabs from '../components/BoardTabs';

const notices = [
  { id: 1, title: '2026학년도 수능 대비 정규반 개강 안내', date: '2026-03-25', category: '학원소식', important: true },
  { id: 2, title: '3월 학력평가 분석 및 향후 학습 전략 설명회', date: '2026-03-22', category: '설명회', important: true },
  { id: 3, title: '봄맞이 수강료 할인 이벤트 안내', date: '2026-03-18', category: '이벤트', important: false },
  { id: 4, title: '학원 시설 점검 및 휴원 안내 (4월 1일)', date: '2026-03-15', category: '안내', important: false },
  { id: 5, title: '신규 교재 입고 안내: 독서의 원리', date: '2026-03-10', category: '교재', important: false },
];

export default function Notices() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">공지사항</h1>
        
        <BoardTabs />

        <div className="space-y-4">
          {notices.map((notice) => (
            <div 
              key={notice.id} 
              className={`bg-white p-6 rounded-2xl shadow-sm border ${notice.important ? 'border-navy-200 bg-navy-50/30' : 'border-gray-100'} hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {notice.important && (
                    <div className="px-2 py-1 bg-navy-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                      Important
                    </div>
                  )}
                  <div className="text-xs font-bold text-navy-400 uppercase tracking-widest">
                    {notice.category}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{notice.date}</div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <h3 className={`text-lg font-bold ${notice.important ? 'text-navy-900' : 'text-gray-900'} group-hover:text-navy-600 transition-colors`}>
                  {notice.title}
                </h3>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-navy-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">1</button>
            <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">2</button>
            <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">3</button>
          </nav>
        </div>
      </div>
    </div>
  );
}
