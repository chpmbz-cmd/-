import { BookOpen, Play, Clock, User, Lock, AlertCircle, X, PlayCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const lectures = [
  {
    id: 1,
    title: '2026 수능 국어 입문: 지문 분석의 기초',
    instructor: '박상혁',
    duration: '15강 / 450분',
    category: '기초입문',
    image: 'https://picsum.photos/seed/lecture1/800/600',
    price: '무료',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube Embed URL
    isLocked: false,
  },
  {
    id: 2,
    title: '독서(비문학) 고난도 지문 정복 프로젝트',
    instructor: '박상혁',
    duration: '20강 / 600분',
    category: '심화학습',
    image: 'https://picsum.photos/seed/lecture2/800/600',
    price: '120,000원',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isLocked: true,
  },
  {
    id: 3,
    title: '문학 필수 작품 100선 총정리',
    instructor: '박상혁',
    duration: '25강 / 750분',
    category: '개념완성',
    image: 'https://picsum.photos/seed/lecture3/800/600',
    price: '150,000원',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isLocked: true,
  },
  {
    id: 4,
    title: '고전시가 10일 완성 특강',
    instructor: '박상혁',
    duration: '10강 / 300분',
    category: '테마특강',
    image: 'https://picsum.photos/seed/lecture4/800/600',
    price: '80,000원',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isLocked: false,
  },
];

export default function Lectures() {
  const { user, profile, loading, isAdmin } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="pt-48 pb-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-900 rounded-full animate-spin" />
      </div>
    );
  }

  const isApproved = isAdmin || profile?.status === 'approved';

  const handlePlay = (lecture: typeof lectures[0]) => {
    if (isAdmin || !lecture.isLocked) {
      setSelectedVideo(lecture.videoUrl);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-navy-950 mb-4">강의실</h1>
          <p className="text-gray-600">박상혁 강사의 명쾌한 강의를 온라인에서 만나보세요.</p>
        </div>

        {!user ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl shadow-navy-900/5 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-navy-900" />
            </div>
            <h2 className="text-2xl font-bold text-navy-950 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              강의실은 수강생 전용 공간입니다.<br />
              로그인 후 관리자의 승인을 받으면 모든 강의를 시청하실 수 있습니다.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
            >
              로그인하러 가기
            </Link>
          </div>
        ) : !isApproved ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl shadow-navy-900/5 max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lectures.map((lecture) => {
              const lectureLocked = !isAdmin && lecture.isLocked;
              return (
                <div 
                  key={lecture.id} 
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all group ${lectureLocked ? 'opacity-75' : 'hover:shadow-xl'}`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={lecture.image} 
                      alt={lecture.title} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${lectureLocked ? 'grayscale' : 'group-hover:scale-105'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      onClick={() => handlePlay(lecture)}
                      className={`absolute inset-0 transition-colors flex items-center justify-center cursor-pointer ${
                        lectureLocked 
                          ? 'bg-black/40' 
                          : 'bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {lectureLocked ? (
                        <div className="flex flex-col items-center gap-2 text-white">
                          <Lock size={32} />
                          <span className="text-xs font-bold">수강 권한 없음</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white text-navy-950 flex items-center justify-center shadow-lg">
                          <Play size={24} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                      {lecture.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-navy-950 mb-3 line-clamp-2">{lecture.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {lecture.instructor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {lecture.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-lg font-bold text-navy-900">{lecture.price}</div>
                      {lectureLocked ? (
                        <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">
                          수강 불가
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePlay(lecture)}
                          className="px-4 py-2 bg-navy-100 text-navy-900 rounded-lg text-sm font-bold hover:bg-navy-200 transition-colors flex items-center gap-2"
                        >
                          <PlayCircle size={16} />
                          강의 보기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          />
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <iframe
              src={selectedVideo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
