import { useState, useEffect } from 'react';
import { Settings, Layout, Users, FileText, Bell, MessageSquare, Star, Save, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { supabase } from '../supabase';

const tabs = [
  { id: 'general', name: '일반 설정', icon: Settings },
  { id: 'users', name: '회원 승인', icon: Users },
  { id: 'lectures', name: '강의 관리', icon: Layout },
  { id: 'resources', name: '자료 관리', icon: FileText },
  { id: 'notices', name: '공지 관리', icon: Bell },
  { id: 'reviews', name: '후기 관리', icon: Star },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('general');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'users') {
      const fetchPendingUsers = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'pending');
        
        if (error) {
          console.error("Error fetching pending users:", error);
        } else {
          setPendingUsers(data || []);
        }
      };

      fetchPendingUsers();

      // Set up real-time subscription
      const subscription = supabase
        .channel('profiles_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          fetchPendingUsers();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeTab]);

  const handleUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

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
            <button className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 transition-colors">
              <Save size={18} />
              변경사항 저장
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy-950">승인 대기 회원</h3>
                <p className="text-sm text-gray-500">가입 신청 후 승인이 필요한 회원 목록입니다.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">대기 중인 회원이 없습니다.</div>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user.id} className="p-6 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-navy-950">{user.displayName}</div>
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

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-navy-950 mb-6">브랜딩 설정</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">포인트 컬러 (Primary)</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#102a43" className="h-10 w-20 rounded border border-gray-200" />
                      <input type="text" defaultValue="#102a43" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">폰트 설정</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none">
                      <option>Inter (기본)</option>
                      <option>Noto Sans KR</option>
                      <option>Pretendard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">총 4개의 항목이 있습니다.</span>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 text-navy-900 rounded-lg text-xs font-bold hover:bg-navy-100 transition-colors">
                  <Plus size={14} />
                  새 항목 추가
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                      <div>
                        <div className="text-sm font-bold text-navy-950">샘플 항목 제목 {i}</div>
                        <div className="text-xs text-gray-400">2026-03-29 | 박상혁</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-navy-600 transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
