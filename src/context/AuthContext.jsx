import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginAsVisitor = useCallback((locationId) => {
    setUser({
      type: 'visitor',
      locationId,
      loginTime: new Date(),
    });
    setIsLoggedIn(true);
  }, []);

  const loginAsAdmin = useCallback((adminId, adminName) => {
    setUser({
      type: 'admin',
      id: adminId,
      name: adminName,
      loginTime: new Date(),
    });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      loginAsVisitor,
      loginAsAdmin,
      logout,
    }),
    [user, isLoggedIn, loginAsVisitor, loginAsAdmin, logout],
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
