import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const LoginHistoryContext = createContext();

export function LoginHistoryProvider({ children }) {
  const [loginHistory, setLoginHistory] = useState([]);

  // Load from localStorage on init
  useEffect(() => {
    try {
      const saved = localStorage.getItem('login_history');
      if (saved) {
        setLoginHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('login_history', JSON.stringify(loginHistory));
  }, [loginHistory]);

  const recordLogin = useCallback((userType, userName, locationName = null) => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      userType, // 'visitor' or 'admin'
      userName,
      locationName, // Only for visitors
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    setLoginHistory((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const getLoginsByDate = useCallback((date) => {
    return loginHistory.filter((entry) => entry.date === date);
  }, [loginHistory]);

  const getLoginsByUserType = useCallback((userType) => {
    return loginHistory.filter((entry) => entry.userType === userType);
  }, [loginHistory]);

  const clearHistory = useCallback(() => {
    setLoginHistory([]);
  }, []);

  const value = useMemo(
    () => ({
      loginHistory,
      recordLogin,
      getLoginsByDate,
      getLoginsByUserType,
      clearHistory,
    }),
    [loginHistory, recordLogin, getLoginsByDate, getLoginsByUserType, clearHistory],
  );

  return <LoginHistoryContext.Provider value={value}>{children}</LoginHistoryContext.Provider>;
}

export function useLoginHistory() {
  const context = useContext(LoginHistoryContext);
  if (!context) {
    throw new Error('useLoginHistory must be used within LoginHistoryProvider');
  }
  return context;
}
