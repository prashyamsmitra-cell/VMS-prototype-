import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!authApi.isLoggedIn()) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const { admin } = await authApi.me();
        if (!isMounted) return;

        setUser({
          type: 'admin',
          id: admin.id,
          name: admin.username,
          loginTime: new Date(),
        });
        setIsLoggedIn(true);
      } catch (error) {
        authApi.logout();
        if (!isMounted) return;
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginAsVisitor = useCallback((locationId) => {
    setUser({
      type: 'visitor',
      locationId,
      loginTime: new Date(),
    });
    setIsLoggedIn(true);
  }, []);

  const loginAsAdmin = useCallback(async (username, password) => {
    const { admin } = await authApi.login({ username, password });
    setUser({
      type: 'admin',
      id: admin.id,
      name: admin.username,
      loginTime: new Date(),
    });
    setIsLoggedIn(true);
    return admin;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      isLoading,
      loginAsVisitor,
      loginAsAdmin,
      logout,
    }),
    [user, isLoggedIn, isLoading, loginAsVisitor, loginAsAdmin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
