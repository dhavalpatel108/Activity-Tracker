import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  username: string | null;
  setUsername: (name: string | null) => void;
  logout: () => void;
  isLoaded: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const savedName = localStorage.getItem('tracker_username');
    if (savedName) {
      setUsernameState(savedName);
    }
    setIsLoaded(true);
  }, []);

  const setUsername = (name: string | null) => {
    if (name) {
      localStorage.setItem('tracker_username', name);
    } else {
      localStorage.removeItem('tracker_username');
    }
    setUsernameState(name);
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ username, setUsername, logout, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
