import { useState, useEffect } from 'react';
import { Settings, Layout, Users, FileText, Bell, MessageSquare, Star, Save, Plus, Trash2, Edit, Check, X, LogOut } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'general', name: '일반 설정', icon: Settings },
  { id: 'users', name: '회원 승인', icon: Users },
  { id: 'lectures', name: '강의 관리', icon: Layout },
  { id: 'resources', name: '자료 관리', icon: FileText },
  { id: 'notices', name: '공지 관리', icon: Bell },
  { id: 'reviews', name: '후기 관리', icon: Star },
];

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', content: '', category: '', description: '', video_url: '', file_url: '', file_type: '', file_size: '' });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchPendingUsers();
    } else if (['lectures', 'resources', 'notices', 'reviews'].includes(activeTab)) {
      fetchItems();
    }
  }, [activeTab]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending');
    
    if (error) console.error("Error fetching pending users:", error);
    else setPendingUsers(data || []);
    setLoading(false);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(activeTab)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(`Error fetching ${activeTab}:`, error);
    else setItems(data || []);
    setLoading(false);
  };

  const handleUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
      fetchPendingUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase
        .from(activeTab)
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItem = async () => {
    let table = '';
    let payload: any = { title: newItem.title };

    switch (activeTab) {
      case 'notices':
        table = 'notices';
        payload = { ...payload, content: newItem.content, category: newItem.category || '일반', important: false };
        break;
      case 'lectures':
        table = 'lectures';
        payload = { ...payload, description: newItem.description, video_url: newItem.video_url, is_locked: true };
        break;
      case 'resources':
        table = 'resources';
        payload = { ...payload, description: newItem.description, file_url: newItem.file_url, file_type: newItem.file_type || 'PDF', file_size: newItem.file_size || '0MB' };
        break;
      case 'reviews':
        table = 'reviews';
        payload = { ...payload, content: newItem.content };
        break;
    }

    if (!table) return;

    const { error } = await supabase.from(table).insert([payload]);
    if (error) {
      alert('Error adding item: ' + error.message);
    } else {
      setIsAdding(false);
      setNewItem({ title: '', content: '', category: '', description: '', video_url: '', file_url: '', file_type: '', file_size: '' });
      fetchItems();
    }
  };

  if (authLoading) return null;
  if (!isAdmin) return null;

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Admin Dashboard</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-navy-950">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <div className="flex gap-2">
              {['lectures', 'resources', 'notices', 'reviews'].includes(activeTab) && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 transition-colors"
                >
                  <Plus size={18} />
                  새 항목 추가
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-navy-900 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                <Save size={18} />
                변경사항 저장
              </button>
            </div>
          </div>

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy-950">승인 대기 회원</h3>
                <p className="text-sm text-gray-500">가입 신청 후 승인이 필요한 회원 목록입니다.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center text-gray-400">불러오는 중...</div>
                ) : pendingUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">대기 중인 회원이 없습니다.</div>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user.id} className="p-6 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-navy-950">{user.full_name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUserStatus(user.id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                        >
                          <Check size={14} />
                          승인
                        </button>
                        <button 
                          onClick={() => handleUserStatus(user.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          <X size={14} />
                          거절
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-navy-950 mb-6">사이트 기본 정보</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">사이트 이름</label>
                    <input type="text" defaultValue="박상혁 국어" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">사이트 설명</label>
                    <textarea rows={3} defaultValue="국어 교육 전문가 박상혁의 프리미엄 온라인 강의 및 학습 지원 플랫폼" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-navy-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {['lectures', 'resources', 'notices', 'reviews'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">총 {items.length}개의 항목이 있습니다.</span>
              </div>

              {isAdding && (
                <div className="p-6 bg-gray-50 border-b border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="제목" 
                      className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    />
                    {activeTab === 'notices' && (
                      <input 
                        type="text" 
                        placeholder="카테고리 (학원소식, 이벤트 등)" 
                        className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      />
                    )}
                    {activeTab === 'lectures' && (
                      <input 
                        type="text" 
                        placeholder="비디오 URL (YouTube Embed)" 
                        className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                        value={newItem.video_url}
                        onChange={(e) => setNewItem({...newItem, video_url: e.target.value})}
                      />
                    )}
                    {activeTab === 'resources' && (
                      <>
                        <input 
                          type="text" 
                          placeholder="파일 유형 (PDF, ZIP 등)" 
                          className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                          value={newItem.file_type}
                          onChange={(e) => setNewItem({...newItem, file_type: e.target.value})}
                        />
                        <input 
                          type="text" 
                          placeholder="파일 용량 (예: 2.4MB)" 
                          className="px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                          value={newItem.file_size}
                          onChange={(e) => setNewItem({...newItem, file_size: e.target.value})}
                        />
                      </>
                    )}
                  </div>
                  <textarea 
                    rows={3} 
                    placeholder={activeTab === 'lectures' || activeTab === 'resources' ? '설명' : '내용'} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-500"
                    value={activeTab === 'lectures' || activeTab === 'resources' ? newItem.description : newItem.content}
                    onChange={(e) => {
                      if (activeTab === 'lectures' || activeTab === 'resources') {
                        setNewItem({...newItem, description: e.target.value});
                      } else {
                        setNewItem({...newItem, content: e.target.value});
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                    >
                      취소
                    </button>
                    <button 
                      onClick={handleAddItem}
                      className="px-6 py-2 bg-navy-900 text-white text-sm font-bold rounded-lg hover:bg-navy-800"
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center text-gray-400">불러오는 중...</div>
                ) : items.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">등록된 항목이 없습니다.</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {activeTab === 'notices' && <Bell size={20} className="text-gray-400" />}
                          {activeTab === 'lectures' && <Layout size={20} className="text-gray-400" />}
                          {activeTab === 'resources' && <FileText size={20} className="text-gray-400" />}
                          {activeTab === 'reviews' && <Star size={20} className="text-gray-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-navy-950">{item.title}</div>
                          <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-navy-600 transition-colors"><Edit size={18} /></button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
