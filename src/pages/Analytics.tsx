import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Filter, Target, CheckCircle2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

type FilterType = 'day' | 'week' | 'month';

export const Analytics: React.FC = () => {
  const { rituals, goals, history } = useData();
  const [filter, setFilter] = useState<FilterType>('week');
  
  // Calendar Strip State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = () => {
    const dates = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
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
  const selectedObj = new Date(selectedDate);

  // Dynamic colors
  const primaryColor = 'var(--color-primary)';
  const secondaryColor = 'var(--color-tertiary)';

  // Compute live today metrics (optimistic)
  const completedRitualsToday = rituals.filter(r => r.completed).length;
  const liveFocusToday = rituals.length > 0 ? Math.round((completedRitualsToday / rituals.length) * 100) : 0;
  const totalGoalProgress = goals.reduce((acc, g) => acc + (g.progress / g.target) * 100, 0);
  const liveEnergyToday = goals.length > 0 ? Math.round(totalGoalProgress / goals.length) : 0;

  // Compute Adherence for the specifically selected date
  const selectedDateHistory = history[selectedDate] || [];
  const isSelectedToday = selectedDate === todayStr;
  const completedCount = isSelectedToday ? completedRitualsToday : selectedDateHistory.length;
  const pendingCount = rituals.length - completedCount;

  const routineData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount }
  ];
  const routineColors = [primaryColor, 'var(--color-surface-variant)'];

  // Compute Energy and Focus Trends dynamically based on history and filter
  const getHistoricalData = () => {
    const dataPoints = [];

    if (filter === 'day') {
      // Mon-Sun of the selected week
      const day = selectedObj.getDay();
      const diff = selectedObj.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(new Date(selectedObj).setDate(diff));
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        const dayHistory = history[dStr] || [];
        const focus = rituals.length > 0 ? Math.round((dayHistory.length / rituals.length) * 100) : 0;
        const energy = Math.min(100, Math.round(focus * 0.8 + 20));
        
        dataPoints.push({
          name: d.toLocaleString('default', { weekday: 'short' }),
          energy: dStr === todayStr ? liveEnergyToday : energy,
          focus: dStr === todayStr ? liveFocusToday : focus
        });
      }
    } else if (filter === 'week') {
      // 4 weeks of selected month
      const currentMonth = selectedObj.getMonth();
      const currentYear = selectedObj.getFullYear();
      
      for (let weekIdx = 0; weekIdx < 4; weekIdx++) {
        let weeklyFocusSum = 0;
        let daysCounted = 0;
        
        const startDay = weekIdx * 7 + 1;
        const endDay = Math.min((weekIdx + 1) * 7, 31);
        
        for (let day = startDay; day <= endDay; day++) {
           const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
           const dayHistory = history[dStr] || [];
           const dFocus = rituals.length > 0 ? Math.round((dayHistory.length / rituals.length) * 100) : 0;
           weeklyFocusSum += (dStr === todayStr ? liveFocusToday : dFocus);
           daysCounted++;
        }
        
        const avgFocus = Math.round(weeklyFocusSum / daysCounted);
        const avgEnergy = Math.min(100, Math.round(avgFocus * 0.8 + 20));
        
        dataPoints.push({
          name: `Week ${weekIdx + 1}`,
          energy: avgEnergy,
          focus: avgFocus
        });
      }
    } else if (filter === 'month') {
      // 6 trailing months
      const endMonth = selectedObj.getMonth();
      const endYear = selectedObj.getFullYear();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(endYear, endMonth - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        
        let monthlyFocusSum = 0;
        let daysCounted = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
           const dStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
           const dayHistory = history[dStr] || [];
           const dFocus = rituals.length > 0 ? Math.round((dayHistory.length / rituals.length) * 100) : 0;
           monthlyFocusSum += (dStr === todayStr ? liveFocusToday : dFocus);
           daysCounted++;
        }
        
        const avgFocus = Math.round(monthlyFocusSum / daysCounted);
        const avgEnergy = Math.min(100, Math.round(avgFocus * 0.8 + 20));
        
        dataPoints.push({
          name: d.toLocaleString('default', { month: 'short' }),
          energy: avgEnergy,
          focus: avgFocus
        });
      }
    }
    return dataPoints;
  };
  const data = getHistoricalData();

  // Compute Routine Analysis dynamically based on filter and selectedDate
  const getRoutineAnalysisData = () => {
    const dataPoints = [];
    const currentMonth = selectedObj.getMonth();
    const currentYear = selectedObj.getFullYear();

    if (filter === 'day') {
      // Mon-Sun of selected week
      const day = selectedObj.getDay();
      const diff = selectedObj.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(new Date(selectedObj).setDate(diff));
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        
        const dayData: any = { name: d.toLocaleString('default', { weekday: 'short' }) };
        rituals.forEach(r => {
          if (dStr === todayStr) {
            dayData[r.title] = r.completed ? 1 : 0;
          } else {
            const dayHistory = history[dStr] || [];
            dayData[r.title] = dayHistory.includes(r.id.toString()) ? 1 : 0;
          }
        });
        dataPoints.push(dayData);
      }
    } else if (filter === 'week') {
      // 4 weeks of selected month
      for (let weekIdx = 0; weekIdx < 4; weekIdx++) {
        const weekData: any = { name: `Week ${weekIdx + 1}` };
        rituals.forEach((r) => {
          let daysCompletedThisWeek = 0;
          const startDay = weekIdx * 7 + 1;
          const endDay = Math.min((weekIdx + 1) * 7, 31);
          for (let day = startDay; day <= endDay; day++) {
            const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (dStr === todayStr) {
              if (r.completed) daysCompletedThisWeek++;
            } else {
              const dayHistory = history[dStr] || [];
              if (dayHistory.includes(r.id.toString())) daysCompletedThisWeek++;
            }
          }
          weekData[r.title] = daysCompletedThisWeek;
        });
        dataPoints.push(weekData);
      }
    } else if (filter === 'month') {
      // 6 trailing months
      const endMonth = selectedObj.getMonth();
      const endYear = selectedObj.getFullYear();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(endYear, endMonth - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        
        const monthData: any = { name: d.toLocaleString('default', { month: 'short' }) };
        rituals.forEach((r) => {
          let daysCompletedThisMonth = 0;
          for (let day = 1; day <= daysInMonth; day++) {
            const dStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (dStr === todayStr) {
              if (r.completed) daysCompletedThisMonth++;
            } else {
              const dayHistory = history[dStr] || [];
              if (dayHistory.includes(r.id.toString())) daysCompletedThisMonth++;
            }
          }
          monthData[r.title] = daysCompletedThisMonth;
        });
        dataPoints.push(monthData);
      }
    }
    return dataPoints;
  };
  const routineAnalysisData = getRoutineAnalysisData();

  const chartColors = ['var(--color-primary)', 'var(--color-tertiary)', '#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b'];

  const goalData = goals.slice(0, 4).map((g, index) => ({
    name: g.title.length > 10 ? g.title.slice(0,10)+'...' : g.title,
    progress: (g.progress / g.target) * 100,
    fill: index % 2 === 0 ? primaryColor : secondaryColor,
  })).reverse();

  return (
    <div className="space-y-8">
      {/* Calendar & Filters */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6">
        <div>
          <h2 className="font-headline-xl text-primary tracking-tight">Analytics Overview</h2>
          <p className="text-body-lg text-secondary">Review your performance across time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Calendar Strip */}
          <div className="flex flex-col gap-2 bg-surface-container-lowest p-3 rounded-2xl border border-secondary-fixed shadow-sm w-full sm:w-auto">
            <div className="flex items-center justify-between px-2">
              <span className="text-label-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                <CalendarIcon size={14}/> {selectedObj.toLocaleString('default', { month: 'short' })} {selectedObj.getFullYear()}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setWeekOffset(w => w - 1)} className="text-secondary hover:text-primary"><ChevronLeft size={16}/></button>
                <button onClick={() => {setWeekOffset(0); setSelectedDate(todayStr);}} className="text-label-sm font-bold text-primary hover:underline">Today</button>
                <button onClick={() => setWeekOffset(w => w + 1)} className="text-secondary hover:text-primary"><ChevronRight size={16}/></button>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
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

          <div className="flex bg-surface-container-high rounded-lg p-1 w-full sm:w-max">
            {(['day', 'week', 'month'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md font-label-sm capitalize transition-colors ${
                  filter === f ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-secondary-fixed shadow-sm space-y-6">
          <h3 className="font-headline-md text-on-background">Energy Trends</h3>
          <div style={{ width: '100%', height: 250 }} className="min-w-0">
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                />
                <Area type="monotone" dataKey="energy" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-secondary-fixed shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-on-background">Focus Consistency</h3>
            <button className="text-secondary hover:text-primary transition-colors">
              <Filter size={20} />
            </button>
          </div>
          <div style={{ width: '100%', height: 250 }} className="min-w-0">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'var(--color-surface-variant)', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                  itemStyle={{ color: 'var(--color-tertiary)' }}
                />
                <Bar dataKey="focus" fill={secondaryColor} radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Data: Routine Adherence */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-secondary-fixed shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-on-background flex items-center gap-2">
              <CheckCircle2 size={20} className="text-primary"/> 
              Routine Adherence {!isSelectedToday && <span className="text-label-sm bg-surface-variant px-2 py-0.5 rounded-full text-secondary ml-2">{selectedObj.toLocaleDateString()}</span>}
            </h3>
          </div>
          <div style={{ width: '100%', height: 250 }} className="min-w-0 flex items-center justify-center">
            {rituals.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={routineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {routineData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={routineColors[index % routineColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                    itemStyle={{ color: 'var(--color-primary)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-on-surface-variant font-label-md">No active routines.</p>
            )}
          </div>
        </div>

        {/* Live Data: Goal Progress */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-secondary-fixed shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-on-background flex items-center gap-2"><Target size={20} className="text-tertiary"/> Goal Progress (Live)</h3>
          </div>
          <div style={{ width: '100%', height: 250 }} className="min-w-0 flex items-center justify-center">
            {goals.length > 0 ? (
              <ResponsiveContainer>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={goalData}>
                  <RadialBar
                    background={{ fill: 'var(--color-surface-variant)' }}
                    dataKey="progress"
                    cornerRadius={10}
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                    itemStyle={{ color: 'var(--color-tertiary)' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-on-surface-variant font-label-md">No active goals.</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-3xl border border-secondary-fixed shadow-sm space-y-6 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-on-background flex items-center gap-2">
              Routine Adherence Analysis
            </h3>
            <span className="text-label-sm bg-surface-variant px-3 py-1 rounded-full text-secondary font-bold capitalize">
              {filter} View
            </span>
          </div>
          <div style={{ width: '100%', height: 300 }} className="min-w-0">
            {rituals.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={routineAnalysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 12}} domain={[0, filter === 'month' ? 31 : filter === 'week' ? 7 : 1]} />
                  <Tooltip 
                    cursor={{fill: 'var(--color-surface-variant)', opacity: 0.4}}
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                  {rituals.map((r, idx) => (
                    <Bar key={r.id} dataKey={r.title} name={r.title} fill={chartColors[idx % chartColors.length]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-on-surface-variant font-label-md">No active routines to analyze.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
