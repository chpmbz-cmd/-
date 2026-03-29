import { useState, useEffect, ChangeEvent } from 'react';
import { MessageSquare, Search, Plus, Lock, Unlock, ChevronRight, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import BoardTabs from '../components/BoardTabs';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

export default function QA() {
  const { user, isAdmin } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', is_private: false, image_url: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching questions:", error);
    else setQuestions(data || []);
    setLoading(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newQuestion.title || !newQuestion.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    let imageUrl = '';
    if (selectedImage) {
      // In a real app, we would upload to Supabase Storage.
      // For this environment, we'll store the base64 string if it's small enough,
      // or just use the preview URL as a mock.
      imageUrl = previewUrl || '';
    }

    const { error } = await supabase
      .from('questions')
      .insert([
        { 
          title: newQuestion.title, 
          content: newQuestion.content, 
          is_private: newQuestion.is_private,
          author_id: user.id,
          status: '대기중',
          image_url: imageUrl
        }
      ]);

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
    } else {
      setIsAdding(false);
      setNewQuestion({ title: '', content: '', is_private: false, image_url: '' });
      setSelectedImage(null);
      setPreviewUrl(null);
      fetchQuestions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) alert('삭제 실패: ' + error.message);
    else fetchQuestions();
  };

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
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors"
            >
              <Plus size={20} />
              질문하기
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-950">질문하기</h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="제목" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                />
                <textarea 
                  rows={5} 
                  placeholder="궁금한 내용을 상세히 적어주세요." 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newQuestion.is_private}
                    onChange={(e) => setNewQuestion({...newQuestion, is_private: e.target.checked})}
                    className="rounded border-gray-300 text-navy-900 focus:ring-navy-500"
                  />
                  <span className="text-sm text-gray-600">비공개로 작성하기</span>
                </label>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">이미지 첨부</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium">
                      <ImageIcon size={18} />
                      파일 선택
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    {selectedImage && <span className="text-xs text-gray-500">{selectedImage.name}</span>}
                  </div>
                  {previewUrl && (
                    <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleSubmitQuestion}
                  className="flex-1 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        )}

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
          {loading ? (
            <div className="p-12 text-center text-gray-400">불러오는 중...</div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">등록된 질문이 없습니다.</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="flex items-center gap-6 py-6 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-4 cursor-pointer group">
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
                    {q.is_private ? (
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
                    <span className="text-xs text-gray-400">{q.profiles?.full_name} | {new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-navy-600 transition-colors">
                    {q.is_private && q.author_id !== user?.id && !isAdmin ? '비공개 질문입니다.' : q.title}
                  </h3>
                  {(!q.is_private || q.author_id === user?.id || isAdmin) && q.image_url && (
                    <div className="mt-3 max-w-sm rounded-lg overflow-hidden border border-gray-100">
                      <img src={q.image_url} alt="Question attachment" className="w-full h-auto" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
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
