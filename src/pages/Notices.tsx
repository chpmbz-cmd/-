import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Plus, X } from 'lucide-react';
import BoardTabs from '../components/BoardTabs';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Notices() {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: '학원소식', important: false });

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching notices:", error);
    else setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmitNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const { error } = await supabase
      .from('notices')
      .insert([newNotice]);

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
    } else {
      setIsAdding(false);
      setNewNotice({ title: '', content: '', category: '학원소식', important: false });
      fetchNotices();
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">공지사항</h1>
        
        <BoardTabs />

        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">학원의 새로운 소식과 공지사항을 확인하세요.</p>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors"
            >
              <Plus size={20} />
              공지 작성하기
            </button>
          )}
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-950">공지 작성하기</h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="제목" 
                    className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  />
                  <select 
                    className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({...newNotice, category: e.target.value})}
                  >
                    <option value="학원소식">학원소식</option>
                    <option value="이벤트">이벤트</option>
                    <option value="학습자료">학습자료</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <textarea 
                  rows={5} 
                  placeholder="공지 내용을 입력하세요." 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newNotice.important}
                    onChange={(e) => setNewNotice({...newNotice, important: e.target.checked})}
                    className="rounded border-gray-300 text-navy-900 focus:ring-navy-500"
                  />
                  <span className="text-sm text-gray-600">중요 공지로 표시</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleSubmitNotice}
                  className="flex-1 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-gray-400">불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center text-gray-400">등록된 공지사항이 없습니다.</div>
          ) : (
            notices.map((notice) => (
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
                  <div className="text-sm text-gray-400">{new Date(notice.created_at).toLocaleDateString()}</div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${notice.important ? 'text-navy-900' : 'text-gray-900'} group-hover:text-navy-600 transition-colors`}>
                    {notice.title}
                  </h3>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-navy-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
