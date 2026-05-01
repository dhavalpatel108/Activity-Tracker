import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const { setUsername } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUsername(name.trim());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 rounded-[40px] shadow-xl border border-secondary-fixed text-center space-y-8">
        
        <div className="mx-auto w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-primary/30 flex items-center justify-center bg-surface border border-outline-variant">
          <img src={logo} alt="Circadian Logo" className="w-full h-full object-cover scale-110" />
        </div>

        <div className="space-y-3">
          <h1 className="font-headline-xl text-primary tracking-tight">Welcome to Circadian</h1>
          <p className="text-body-lg text-secondary">Your dynamic lifestyle tracker.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-label-sm uppercase tracking-widest text-on-background font-bold mb-2 opacity-80">What should we call you?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary">
                <User size={20} />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena" 
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-[#00e5ff] font-bold pl-12 pr-4 py-4 rounded-2xl outline-none transition-all placeholder:text-slate-500 font-body-lg selection:bg-primary selection:text-on-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                autoFocus
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-label-md hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};
