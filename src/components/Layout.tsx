import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { LayoutDashboard, Sun, Target, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC = () => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen transition-colors duration-500">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pb-24 lg:pb-0">
        <TopNav />
        <div className="pt-24 px-4 lg:px-container-margin pb-12 max-w-7xl mx-auto space-y-section-gap">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 pb-safe bg-surface-container-lowest/90 backdrop-blur-lg border-t border-outline-variant flex items-center justify-around z-50 px-2">
        <NavLink to="/" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive ? "text-primary bg-primary/10" : "text-secondary hover:bg-surface-variant")}>
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-label-sm">Home</span>
        </NavLink>
        <NavLink to="/routines" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive ? "text-primary bg-primary/10" : "text-secondary hover:bg-surface-variant")}>
          <Sun size={24} />
          <span className="text-[10px] font-label-sm">Routine</span>
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive ? "text-primary bg-primary/10" : "text-secondary hover:bg-surface-variant")}>
          <Target size={24} />
          <span className="text-[10px] font-label-sm">Goals</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive ? "text-primary bg-primary/10" : "text-secondary hover:bg-surface-variant")}>
          <User size={24} />
          <span className="text-[10px] font-label-sm">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
