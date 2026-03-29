import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-navy-400 text-xs">
            © 2026 천하포문 박상혁 국어. All rights reserved.
          </p>
          <div className="flex space-x-6 text-navy-400 text-xs">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
