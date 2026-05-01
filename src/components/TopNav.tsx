import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Palette, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

export const TopNav: React.FC = () => {
  const { theme, setTheme, isAuto, setIsAuto } = useTheme();
  const { logout, username } = useUser();
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    if (isAuto) {
      setIsAuto(false);
      setTheme('morning');
    } else {
      if (theme === 'morning') setTheme('evening-light');
      else if (theme === 'evening-light') setTheme('night');
      else setIsAuto(true);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 flex justify-between items-center px-4 lg:px-8 z-40 bg-surface-container-lowest/60 backdrop-blur-md border-b border-outline-variant transition-colors duration-500">
      <div className="flex items-center gap-2">
        <div className="lg:hidden w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-surface border border-outline-variant shadow-sm">
          <img src={logo} alt="Circadian Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-headline-md font-bold tracking-tight text-primary">Circadian</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex bg-surface-container-high px-4 py-1.5 rounded-full items-center gap-2">
          <Search size={16} className="text-on-surface-variant" />
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface placeholder-on-surface-variant w-48" 
            placeholder="Search data..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 ${showSettings ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
          >
            <Settings size={20} />
          </button>
          
          {showSettings && (
            <div className="absolute top-12 right-0 w-64 bg-surface-container-high rounded-2xl shadow-xl border border-secondary-fixed overflow-hidden flex flex-col py-2 z-50">
              <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-label-lg text-on-surface">{username || "User"}</p>
                  <p className="text-label-sm text-secondary">Active Session</p>
                </div>
              </div>
              
              <div className="px-2 py-2 flex flex-col gap-1">
                <button 
                  onClick={handleThemeToggle}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-label-md text-on-surface hover:bg-surface-variant rounded-xl transition-colors"
                >
                  <Palette size={18} className="text-primary" />
                  <span className="flex-1">Toggle Theme</span>
                  <span className="text-label-sm text-secondary uppercase text-[10px] bg-surface-container-highest px-2 py-0.5 rounded-full">
                    {isAuto ? 'Auto' : theme.replace('-light', '')}
                  </span>
                </button>
                
                <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-label-md text-on-surface hover:bg-surface-variant rounded-xl transition-colors">
                  <Bell size={18} className="text-secondary" />
                  <span className="flex-1">Notifications</span>
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                </button>
              </div>

              <div className="border-t border-outline-variant px-2 py-2">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-label-md text-error hover:bg-error-container hover:text-on-error-container rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
