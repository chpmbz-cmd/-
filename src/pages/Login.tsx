import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setMessage({ type: 'success', text: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login failed:", error);
      setMessage({ type: 'error', text: 'Google 로그인에 실패했습니다.' });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold tracking-tighter text-navy-900">
            CHPM
          </Link>
        </div>
        
        <div className="bg-white py-10 px-6 shadow-2xl shadow-navy-900/5 sm:rounded-3xl sm:px-12 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-navy-950">
              {isLogin ? '다시 만나서 반가워요!' : '새로운 시작을 환영합니다!'}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isLogin ? '로그인하여 학습을 이어가세요.' : '회원가입 후 모든 서비스를 이용해보세요.'}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all outline-none"
                    placeholder="홍길동"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이메일 주소</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded" />
                  <label className="ml-2 block text-xs text-gray-500">로그인 유지</label>
                </div>
                <div className="text-xs">
                  <a href="#" className="font-bold text-navy-600 hover:text-navy-500">비밀번호 찾기</a>
                </div>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? '로그인' : '회원가입'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="px-4 bg-white text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Google로 계속하기
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? '아직 회원이 아니신가요?' : '이미 회원이신가요?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }}
              className="ml-2 font-bold text-navy-600 hover:text-navy-500"
            >
              {isLogin ? '지금 가입하기' : '로그인하기'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
