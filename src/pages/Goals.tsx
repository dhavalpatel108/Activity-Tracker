import React, { useState } from 'react';
import { Target, Plus, Check } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Goals: React.FC = () => {
  const { goals, incrementGoal, addGoal } = useData();
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
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-on-background">{goal.title}</span>
                  <span className="text-label-sm text-secondary">{goal.progress}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary-fixed rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => incrementGoal(goal.id)}
                    className="p-1.5 rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    <Check size={16} />
                  </button>
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
