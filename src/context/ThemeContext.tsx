import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'morning' | 'evening-light' | 'night';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAuto: boolean;
  setIsAuto: (isAuto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('morning');
  const [isAuto, setIsAuto] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuto) return;

    const updateThemeBasedOnTime = () => {
      const hour = new Date().getHours();
      // Morning: 6 AM to 5 PM (17:00)
      if (hour >= 6 && hour < 17) {
        setTheme('morning');
      } 
      // Evening Light: 5 PM to 8 PM (20:00)
      else if (hour >= 17 && hour < 20) {
        setTheme('evening-light');
      } 
      // Night: 8 PM to 6 AM
      else {
        setTheme('night');
      }
    };

    updateThemeBasedOnTime();
    
    // Check every minute if the theme should update
    const interval = setInterval(updateThemeBasedOnTime, 60000);
    return () => clearInterval(interval);
  }, [isAuto]);

  useEffect(() => {
    // Remove old theme classes
    document.documentElement.classList.remove('theme-morning', 'theme-evening-light', 'theme-night');
    // Add new theme class
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Adjust base tailwind dark mode if needed
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isAuto, setIsAuto }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
