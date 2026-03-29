import { useState, useEffect } from 'react';
import { User, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';
import BoardTabs from '../components/BoardTabs';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({ title: '', content: '' });

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching reviews:", error);
    else setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newReview.title || !newReview.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert([
        { 
          title: newReview.title, 
          content: newReview.content, 
          author_id: user.id
        }
      ]);

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
    } else {
      setIsAdding(false);
      setNewReview({ title: '', content: '' });
      fetchReviews();
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">수강후기</h1>

        <BoardTabs />

        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">수강생들의 생생한 후기를 확인해보세요.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors"
          >
            <Plus size={20} />
            후기 작성하기
          </button>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-950">후기 작성하기</h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="제목" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                />
                <textarea 
                  rows={5} 
                  placeholder="강의에 대한 솔직한 후기를 남겨주세요." 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleSubmitReview}
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
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-gray-400">등록된 수강후기가 없습니다.</div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{review.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={12} className="text-gray-400" />
                    </div>
                    <span>{review.profiles?.full_name || '익명'}</span>
                    <span>·</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
