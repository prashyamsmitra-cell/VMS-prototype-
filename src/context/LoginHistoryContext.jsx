import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { loginHistoryApi } from '../services/api';

const LoginHistoryContext = createContext();

function normalizeHistoryEntry(entry) {
  return {
    id: entry.id,
    userType: entry.userType || entry.user_type,
    userName: entry.userName || entry.user_name,
    locationName: entry.locationName || entry.location_name,
    timestamp: entry.timestamp,
    date: entry.date,
    time: entry.time,
    timezone: entry.timezone,
  };
}

export function LoginHistoryProvider({ children }) {
  const { isLoggedIn, user } = useAuth();
  const [loginHistory, setLoginHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    const { history } = await loginHistoryApi.getAll();
    setLoginHistory(history.map(normalizeHistoryEntry));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      if (!isLoggedIn || user?.type !== 'admin') {
        if (isMounted) {
          setLoginHistory([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const { history } = await loginHistoryApi.getAll();
        if (!isMounted) return;
        setLoginHistory(history.map(normalizeHistoryEntry));
      } catch (error) {
        console.error('Error loading login history:', error);
        if (isMounted) setLoginHistory([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user?.type]);

  const recordLogin = useCallback(async (userType) => {
    if (userType !== 'admin') return null;

    await loginHistoryApi.recordAdminLogin(Intl.DateTimeFormat().resolvedOptions().timeZone);
    await refreshHistory();
    return null;
  }, [refreshHistory]);

  const getLoginsByDate = useCallback((date) => {
    return loginHistory.filter((entry) => entry.date === date);
  }, [loginHistory]);

  const getLoginsByUserType = useCallback((userType) => {
    return loginHistory.filter((entry) => entry.userType === userType);
  }, [loginHistory]);

  const clearHistory = useCallback(async () => {
    await loginHistoryApi.clearAll();
    setLoginHistory([]);
  }, []);

  const value = useMemo(
    () => ({
      loginHistory,
      isLoading,
      recordLogin,
      getLoginsByDate,
      getLoginsByUserType,
      clearHistory,
    }),
    [loginHistory, isLoading, recordLogin, getLoginsByDate, getLoginsByUserType, clearHistory],
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
