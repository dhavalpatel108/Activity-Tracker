import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Goal {
  id: number;
  title: string;
  progress: number;
  target: number;
}

export interface Ritual {
  id: string | number;
  title: string;
  time: string;
  completed: boolean;
  duration?: string;
  icon: string;
}

export interface HistoryRecord {
  id: string; // YYYY-MM-DD
  completed: string[];
}

interface DataContextType {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  rituals: Ritual[];
  history: Record<string, string[]>;
  updateRitualStatus: (id: string | number, completed: boolean) => void;
  addRitual: (ritual: Omit<Ritual, 'id'>) => void;
  deleteRitual: (id: string | number) => void;
  incrementGoal: (id: number) => void;
  addGoal: (title: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_RITUALS: Ritual[] = [
  { id: 1, title: 'Hydration (500ml)', time: '06:45 AM', completed: true, icon: 'water_drop' },
  { id: 2, title: 'Mindful Meditation', time: '07:15 AM', duration: '10 mins', completed: false, icon: 'self_improvement' },
  { id: 3, title: 'Light Stretching', time: '07:30 AM', duration: '15 mins', completed: false, icon: 'fitness_center' },
  { id: 4, title: 'Deep Work Planning', time: '08:00 AM', duration: '5 mins', completed: false, icon: 'edit_note' },
];

const DEFAULT_GOALS: Goal[] = [
  { id: 1, title: 'Drink 2L Water', progress: 50, target: 100 },
  { id: 2, title: '10,000 Steps', progress: 78, target: 100 },
  { id: 3, title: 'Read 20 pages', progress: 0, target: 100 },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [history, setHistory] = useState<Record<string, string[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem('lifestyle_goals');
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      else setGoals(DEFAULT_GOALS);

      const storedRituals = localStorage.getItem('lifestyle_rituals');
      if (storedRituals) setRituals(JSON.parse(storedRituals));
      else setRituals(DEFAULT_RITUALS);

      const storedHistory = localStorage.getItem('lifestyle_history');
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      else setHistory({});

      setIsLoaded(true);
    } catch (e) {
      console.error("Failed to load from localStorage", e);
      setGoals(DEFAULT_GOALS);
      setRituals(DEFAULT_RITUALS);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) localStorage.setItem('lifestyle_goals', JSON.stringify(goals));
  }, [goals, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('lifestyle_rituals', JSON.stringify(rituals));
  }, [rituals, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('lifestyle_history', JSON.stringify(history));
  }, [history, isLoaded]);

  const updateRitualStatus = (id: string | number, completed: boolean) => {
    const ritual = rituals.find(r => r.id == id);
    if (!ritual) return;
    
    setRituals(rituals.map(r => r.id == id ? { ...r, completed } : r));

    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = history[today] ? [...history[today]] : [];
    
    if (completed && !todayCompleted.includes(id.toString())) {
      todayCompleted.push(id.toString());
    } else if (!completed) {
      const idx = todayCompleted.indexOf(id.toString());
      if (idx > -1) todayCompleted.splice(idx, 1);
    }
    
    setHistory({ ...history, [today]: todayCompleted });
  };

  const incrementGoal = (id: number) => {
    const goal = goals.find(g => g.id == id);
    if (!goal) return;
    
    const newProgress = Math.min(goal.progress + 10, goal.target);
    setGoals(goals.map(g => g.id == id ? { ...g, progress: newProgress } : g));
  };

  const addRitual = (ritual: Omit<Ritual, 'id'>) => {
    const newRitual = { ...ritual, id: Date.now() };
    setRituals([...rituals, newRitual]);
  };

  const deleteRitual = (id: string | number) => {
    setRituals(rituals.filter(r => r.id != id));
  };

  const addGoal = (title: string) => {
    const newGoalObj = {
      id: Date.now(),
      title,
      progress: 0,
      target: 100
    };
    setGoals([...goals, newGoalObj]);
  };

  return (
    <DataContext.Provider value={{ goals, setGoals, rituals, history, updateRitualStatus, addRitual, deleteRitual, incrementGoal, addGoal }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
