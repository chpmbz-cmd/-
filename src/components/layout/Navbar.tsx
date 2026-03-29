import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, User, BookOpen, FileText, Bell, MessageSquare, Star } from 'lucide-react';

const navItems = [
  { name: '공지사항', href: '/notices', icon: Bell },
  { name: '강의실', href: '/lectures', icon: BookOpen },
  { name: '자료실', href: '/resources', icon: FileText },
  { name: '질의응답', href: '/qa', icon: MessageSquare },
  { name: '수강후기', href: '/reviews', icon: Star },
];

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-[#0a192f]">CHPM</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
            {isAdmin && (
              <a href="/admin" className="text-sm font-bold text-navy-600 hover:text-navy-800">
                관리자
              </a>
            )}
            <div className="flex items-center space-x-4 pl-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">{profile?.displayName || user.email?.split('@')[0]}님</span>
                  <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-navy-900 transition-colors">
                    로그아웃
                  </button>
                </div>
              ) : (
                <button onClick={handleLoginClick} className="flex items-center gap-2 text-sm font-semibold text-navy-900 hover:opacity-80 transition-opacity">
                  <LogIn size={18} />
                  로그인
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-navy-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} className="text-navy-600" />
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="/login"
                  className="flex items-center gap-3 px-3 py-4 text-base font-bold text-navy-900"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={20} />
                  로그인 / 회원가입
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
