import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, LayoutDashboard, Sun, Target, LineChart, Plus, Settings, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/routines', icon: Sun, label: 'Daily Routines' },
  { path: '/goals', icon: Target, label: 'Goal Progress' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full p-4 gap-4 bg-surface-container-lowest w-64 border-r border-outline-variant z-50 transition-colors duration-500">
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="text-on-primary" size={24} />
        </div>
        <div>
          <h1 className="font-headline-md text-primary font-bold">Circadian</h1>
          <p className="text-label-sm text-secondary">Rise & Shine</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-8 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:translate-x-1 duration-300 font-label-md",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container font-semibold" 
                  : "text-on-surface-variant hover:bg-surface-variant"
              )
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant">
        <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Plus size={18} />
          New Routine
        </button>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md" href="#">
          <Settings size={20} />
          <span>Settings</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md" href="#">
          <HelpCircle size={20} />
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
};
