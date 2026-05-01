import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Clock, Activity } from 'lucide-react';

export const Routines: React.FC = () => {
  const { rituals, addRitual, deleteRitual } = useData();
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newIcon, setNewIcon] = useState('self_improvement'); // default icon

  const ICONS = [
    'self_improvement', 'fitness_center', 'pool', 'directions_run',
    'menu_book', 'local_cafe', 'water_drop', 'bedtime',
    'restaurant', 'work', 'spa', 'headphones'
  ];

  const handleAddRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newTime.trim()) {
      addRitual({
        title: newTitle.trim(),
        time: newTime.trim(),
        duration: newDuration.trim() || '5 mins',
        completed: false,
        icon: newIcon
      });
      setNewTitle('');
      setNewTime('');
      setNewDuration('');
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h2 className="font-headline-xl text-primary tracking-tight">Manage Routines</h2>
        <p className="text-body-lg text-secondary">Customize your daily rituals to perfectly align with your circadian rhythm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Active Routines List */}
        <section className="md:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-secondary-fixed shadow-sm space-y-4">
          <h3 className="font-headline-md text-on-background border-b border-secondary-fixed pb-4">Current Rituals</h3>
          <div className="space-y-2 pt-2">
            {rituals.map(ritual => (
              <div key={ritual.id} className="flex items-center gap-4 py-4 px-2 rounded-xl border border-transparent hover:bg-surface-bright transition-all group">
                <div className="w-10 h-10 flex-shrink-0 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container overflow-hidden">
                  <span className="material-symbols-outlined text-xl">{ritual.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-on-background">{ritual.title}</p>
                  <div className="flex items-center gap-2 text-label-sm text-secondary">
                    <Clock size={12} /> {ritual.time} • {ritual.duration}
                  </div>
                </div>
                <button 
                  onClick={() => deleteRitual(ritual.id)}
                  className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  title="Delete Routine"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {rituals.length === 0 && (
              <div className="text-center py-8 text-secondary font-body-md">
                No active routines. Add one below!
              </div>
            )}
          </div>
        </section>

        {/* Add Routine Form */}
        <section className="md:col-span-5 bg-primary-container text-on-primary-container rounded-3xl p-6 shadow-sm self-start">
          <h3 className="font-headline-md flex items-center gap-2 mb-6">
            <Plus size={24} /> New Ritual
          </h3>
          <form onSubmit={handleAddRitual} className="space-y-5">
            <div>
              <label className="block text-label-sm mb-2 opacity-80 text-on-background font-semibold">Ritual Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Deep Reading" 
                className="w-full bg-surface-container-lowest/50 border border-transparent focus:border-primary text-slate-900 font-bold px-4 py-3 rounded-xl outline-none transition-all placeholder:text-slate-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm mb-2 opacity-80 text-on-background font-semibold">Time</label>
                <input 
                  type="text" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 08:30 AM" 
                  className="w-full bg-surface-container-lowest/50 border border-transparent focus:border-primary text-slate-900 font-bold px-4 py-3 rounded-xl outline-none transition-all placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-label-sm mb-2 opacity-80 text-on-background font-semibold">Duration</label>
                <input 
                  type="text" 
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="e.g. 20 mins" 
                  className="w-full bg-surface-container-lowest/50 border border-transparent focus:border-primary text-slate-900 font-bold px-4 py-3 rounded-xl outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-label-sm mb-3 opacity-80 text-on-background font-semibold">
                <Activity size={14} /> Select Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewIcon(icon)}
                    className={`h-12 rounded-xl flex items-center justify-center transition-all ${
                      newIcon === icon 
                        ? 'bg-primary text-on-primary ring-2 ring-primary ring-offset-2 ring-offset-primary-container' 
                        : 'bg-surface-container-lowest/50 text-slate-700 hover:bg-surface-container-lowest hover:text-primary border border-transparent'
                    }`}
                    title={icon.replace('_', ' ')}
                  >
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-primary/90 transition-colors mt-4"
            >
              Add to Daily Rhythm
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};
