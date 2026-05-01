import React, { useState } from 'react';
import { Target, Plus, Check, Minus, Plus as PlusIcon, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Goals: React.FC = () => {
  const { goals, incrementGoal, decrementGoal, deleteGoal, addGoal } = useData();
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      addGoal(newGoal.trim());
      setNewGoal('');
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline-xl text-primary tracking-tight">Your Goals</h2>
        <p className="text-body-lg text-secondary">Set and track your daily wellness targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-secondary-fixed shadow-sm space-y-6">
          <h3 className="font-headline-md text-on-background flex items-center gap-2">
            <Target size={24} className="text-primary" /> Active Targets
          </h3>
          <div className="space-y-6">
            {goals.map(goal => (
              <div key={goal.id} className="space-y-3 bg-surface-container-low/30 p-4 rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors group">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-on-surface font-bold">{goal.title}</span>
                    <span className="text-label-sm text-secondary">Target: {goal.target}%</span>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 rounded-xl text-secondary hover:bg-error/10 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Goal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-surface-variant rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-primary transition-all duration-700 ease-out relative" 
                        style={{ width: `${goal.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      </div>
                    </div>
                    <span className="text-label-md font-bold text-primary w-12 text-right">{goal.progress}%</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => decrementGoal(goal.id)}
                        className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95"
                        title="Decrease Progress"
                      >
                        <Minus size={18} />
                      </button>
                      <button 
                        onClick={() => incrementGoal(goal.id)}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                        title="Increase Progress"
                      >
                        <PlusIcon size={18} />
                      </button>
                    </div>
                    
                    {goal.progress >= goal.target && (
                      <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full animate-bounce">
                        <Check size={14} strokeWidth={3} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-headline-md flex items-center gap-2">
            <Plus size={24} /> Create New Goal
          </h3>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="block text-label-sm mb-2 opacity-80 text-on-background font-semibold">Goal Title</label>
              <input 
                type="text" 
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="e.g. Meditate for 10 min" 
                className="w-full bg-surface-container-lowest/50 border border-transparent focus:border-primary text-slate-900 font-bold px-4 py-3 rounded-xl outline-none transition-all placeholder:text-slate-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-primary/90 transition-colors"
            >
              Add Target
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
