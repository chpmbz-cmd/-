import { MessageSquare, Search, Plus, Lock, Unlock, ChevronRight } from 'lucide-react';
import BoardTabs from '../components/BoardTabs';

const questions = [
  { id: 1, title: '고전시가 해석이 너무 어려워요. 팁이 있을까요?', author: '학습자A', date: '2026-03-28', status: '답변완료', isPrivate: false },
  { id: 2, title: '비문학 지문 읽는 속도가 안 늘어요.', author: '열공중', date: '2026-03-27', status: '답변대기', isPrivate: true },
  { id: 3, title: '교재 배송은 언제쯤 되나요?', author: '수강생B', date: '2026-03-26', status: '답변완료', isPrivate: false },
  { id: 4, title: '3월 모의고사 해설 강의는 언제 올라오나요?', author: '국어만점', date: '2026-03-25', status: '답변완료', isPrivate: true },
];

export default function QA() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">질의응답</h1>

        <BoardTabs />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-gray-600">학습 내용이나 학원 생활에 대해 궁금한 점을 남겨주세요.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors">
              <Plus size={20} />
              질문하기
            </button>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-navy-600 focus:ring-navy-500" />
                <span>비공개로 작성</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
          <div className="flex-1 flex items-center gap-2 px-4">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="궁금한 내용을 검색해보세요" 
              className="bg-transparent border-none focus:ring-0 text-sm w-full py-2"
            />
          </div>
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-navy-900 hover:bg-gray-50 transition-colors">
            검색
          </button>
        </div>

        <div className="space-y-0 border-t border-gray-100">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center gap-6 py-6 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-4 cursor-pointer group">
              {/* Prominent Status on the Left */}
              <div className={`flex flex-col items-center justify-center w-24 h-16 rounded-xl border-2 transition-colors ${
                q.status === '답변완료' 
                  ? 'bg-navy-50 border-navy-100 text-navy-700' 
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span className="text-[11px] font-black tracking-tighter uppercase opacity-60 mb-0.5">STATUS</span>
                <span className="text-sm font-bold leading-none">{q.status}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  {q.isPrivate ? (
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Lock size={10} />
                      <span>비공개</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Unlock size={10} />
                      <span>공개</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400">{q.author} | {q.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-navy-600 transition-colors">
                  {q.title}
                </h3>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-navy-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
