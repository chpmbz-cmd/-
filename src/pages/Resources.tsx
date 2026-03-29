import { FileText, Download, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const resources = [
  { id: 1, title: '2026학년도 수능 국어 기출 분석집 (상)', type: 'PDF', size: '12.4MB', date: '2026-03-20' },
  { id: 2, title: '필수 문학 작품 100선 핵심 정리 노트', type: 'PDF', size: '8.2MB', date: '2026-03-15' },
  { id: 3, title: '독서 지문 구조화 연습 워크북', type: 'PDF', size: '15.1MB', date: '2026-03-10' },
  { id: 4, title: '3월 학력평가 대비 모의고사 및 해설지', type: 'PDF', size: '5.7MB', date: '2026-03-05' },
];

export default function Resources() {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="pt-48 pb-24 min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-900 rounded-full animate-spin" />
      </div>
    );
  }

  const isApproved = isAdmin || profile?.status === 'approved';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-navy-950 mb-4">자료실</h1>
          <p className="text-gray-600">학습에 필요한 다양한 보충 자료와 과제물을 다운로드하세요.</p>
        </div>

        {!user ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100 shadow-xl shadow-navy-900/5 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-navy-900" />
            </div>
            <h2 className="text-2xl font-bold text-navy-950 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              자료실은 수강생 전용 공간입니다.<br />
              로그인 후 관리자의 승인을 받으면 모든 자료를 다운로드하실 수 있습니다.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
            >
              로그인하러 가기
            </Link>
          </div>
        ) : !isApproved ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100 shadow-xl shadow-navy-900/5 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-950 mb-4">승인 대기 중입니다</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              회원가입이 완료되었으나, 아직 관리자의 승인이 이루어지지 않았습니다.<br />
              관리자가 확인 후 승인 처리를 도와드릴 예정입니다. 잠시만 기다려 주세요.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold">
              현재 상태: 승인 대기
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-navy-950">자료명</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy-950">유형</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy-950">용량</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy-950">등록일</th>
                  <th className="px-6 py-4 text-sm font-bold text-navy-950 text-right">다운로드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-navy-400" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-navy-600 transition-colors">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">{item.type}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{item.size}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors">
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
