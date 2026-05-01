import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import { Check, Flame, Footprints, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { username } = useUser();
  const { rituals, updateRitualStatus, goals, history } = useData();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
    
    // Find monday of this base week
    const day = baseDate.getDay();
    const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(baseDate.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const weekDates = getWeekDates();
  const isHistoryMode = selectedDate !== todayStr;
  const historyCompletedIds = history[selectedDate] || [];

  // Compute live energy based on goals
  const totalGoalProgress = goals.reduce((acc, g) => acc + (g.progress / g.target) * 100, 0);
  const liveEnergy = goals.length > 0 ? Math.round(totalGoalProgress / goals.length) : 0;
  const dashOffset = 552.92 - (552.92 * (liveEnergy / 100));
  
  // Compute focus score based on rituals
  const completedRituals = rituals.filter(r => r.completed).length;
  const focusScore = rituals.length > 0 ? ((completedRituals / rituals.length) * 10).toFixed(1) : "0.0";
  
  const getGreeting = () => {
    if (theme === 'morning') return "Rise & Shine";
    if (theme === 'evening-light') return "Good Evening";
    return "Time to Wind Down";
  };



  return (
    <>
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-gutter">
        <div className="space-y-2">
          <h2 className="font-headline-xl text-primary tracking-tight">{getGreeting()}, {username}.</h2>
          <p className="text-body-lg text-secondary">
            {theme === 'morning' 
              ? "You're 65% through your morning window. Keep the momentum!" 
              : "Reflect on your day and prepare for a restful night."}
          </p>
        </div>
        
        {/* Calendar Strip */}
        <div className="flex flex-col gap-2 mt-6 md:mt-0 bg-surface-container-lowest p-3 rounded-2xl border border-secondary-fixed shadow-sm">
          <div className="flex items-center justify-between px-2">
            <span className="text-label-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon size={14}/> {new Date(selectedDate).toLocaleString('default', { month: 'short' })} {new Date(selectedDate).getFullYear()}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} className="text-secondary hover:text-primary"><ChevronLeft size={16}/></button>
              <button onClick={() => setWeekOffset(0)} className="text-label-sm font-bold text-primary hover:underline">Today</button>
              <button onClick={() => setWeekOffset(w => w + 1)} className="text-secondary hover:text-primary"><ChevronRight size={16}/></button>
            </div>
          </div>
          <div className="flex gap-2">
            {weekDates.map(date => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl transition-all ${
                    isSelected ? 'bg-primary text-on-primary shadow-md scale-105' : 
                    isToday ? 'bg-primary-container text-on-primary-container border-2 border-primary' : 
                    'bg-surface-bright text-secondary hover:bg-surface-variant'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-80">{date.toLocaleString('default', { weekday: 'short' }).charAt(0)}</span>
                  <span className="font-label-md">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Routines */}
        <section className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-on-background flex items-center gap-2">
              {theme === 'morning' ? 'Morning Rituals' : 'Evening Routine'}
              {isHistoryMode && <span className="text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded-full ml-2">History Mode</span>}
            </h3>
            <Link to="/routines" className="text-label-md text-primary font-semibold cursor-pointer hover:underline">Edit List</Link>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl border border-secondary-fixed p-card-padding shadow-sm space-y-2">
            
            {rituals.map((ritual) => {
              const isCompleted = isHistoryMode ? historyCompletedIds.includes(ritual.id.toString()) : ritual.completed;

              return (
                <div 
                  key={ritual.id} 
                  className={`flex items-center gap-4 py-4 px-2 rounded-xl transition-colors group ${isHistoryMode ? 'opacity-80' : 'cursor-pointer'} ${isCompleted ? 'border-b border-secondary-fixed hover:bg-surface-bright' : 'hover:bg-surface-bright'}`}
                  onClick={() => !isHistoryMode && updateRitualStatus(ritual.id, !ritual.completed)}
                >
                  <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors ${isCompleted ? 'border-primary bg-primary' : 'border-primary-fixed-dim bg-transparent group-hover:bg-primary/10'}`}>
                    {isCompleted && <Check size={16} className="text-on-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-on-background">{ritual.title}</p>
                    <p className="text-label-sm text-secondary">
                      {ritual.time} • {isCompleted ? 'Completed' : ritual.duration}
                    </p>
                  </div>
                  <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden ${isCompleted ? 'bg-surface-container text-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                    <span className="material-symbols-outlined text-xl">{ritual.icon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Energy & Goals */}
        <section className="md:col-span-5 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-3xl border border-secondary-fixed p-card-padding shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="font-headline-md text-on-background mb-8 w-full text-left">Daily Energy</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-secondary-fixed-dim opacity-30" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-primary-container transition-all duration-1000 ease-out" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-xl text-primary">{liveEnergy}%</span>
                <span className="text-label-sm text-secondary font-bold uppercase tracking-widest">Optimized</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-surface-bright rounded-2xl">
                <p className="text-label-sm text-secondary">Peak Hour</p>
                <p className="font-label-md text-on-background">10:30 AM</p>
              </div>
              <div className="p-3 bg-surface-bright rounded-2xl">
                <p className="text-label-sm text-secondary">Focus Score</p>
                <p className="font-label-md text-on-background">{focusScore}/10</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goals.slice(0, 2).map((goal, index) => (
              <div key={goal.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-secondary-fixed shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-primary' : 'bg-on-tertiary-container'}`}>
                    {index === 0 ? <Footprints className="text-on-primary" size={16} /> : <Flame className="text-on-primary" size={16} />}
                  </div>
                  <span className={`text-label-sm font-bold ${index === 0 ? 'text-primary' : 'text-on-tertiary-container'}`}>{goal.progress}%</span>
                </div>
                <p className="text-label-sm text-secondary">{goal.title}</p>
                <p className="font-label-md text-on-background">{goal.progress} / {goal.target}</p>
                <div className="mt-2 w-full h-1.5 bg-secondary-fixed rounded-full overflow-hidden">
                  <div className={`h-full w-[${goal.progress}%] ${index === 0 ? 'bg-primary' : 'bg-on-tertiary-container'}`} style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>


    </>
  );
};
