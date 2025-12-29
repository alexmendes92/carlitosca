
import React from 'react';
import { ChevronLeft, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onBack, showBack, title, subtitle }) => {
  return (
    <header className="bg-white/90 backdrop-blur-xl h-14 px-4 md:px-6 flex items-center justify-between sticky top-0 z-[50] border-b border-slate-100 pt-safe transition-all">
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {showBack && (
          <button 
            onClick={onBack}
            className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors active:scale-95 flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        <div className={`flex flex-col justify-center transition-all duration-300 overflow-hidden ${showBack ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 hidden'}`}>
            {showBack && (
                <>
                    <h2 className="text-sm font-bold text-slate-900 leading-none truncate">{title}</h2>
                    {subtitle && <p className="text-[10px] text-primary font-bold truncate mt-0.5 uppercase tracking-wide">{subtitle}</p>}
                </>
            )}
        </div>
      </div>
      
      {!showBack && (
        <div className="flex items-center gap-3">
             <button className="w-9 h-9 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <Search className="w-5 h-5" />
            </button>
             <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative active:scale-95 transition-transform">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-red rounded-full border border-white"></span>
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;
