import { createContext, useContext, useMemo, useState } from 'react';
import { demoUsers } from '../config/demoUsers.js';

const DemoAuthContext = createContext();

export function DemoAuthProvider ({ children }) {
  const [role, setRole] = useState('customer');

  const value = useMemo(() => {
    const user = demoUsers[role];
    return {
      role,
      user,
      setRole
    };
  }, [role]);

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth () {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider');
  }
  return context;
}
