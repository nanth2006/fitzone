import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gym_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('gym_token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('gym_role') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('gym_token', token);
      // Also keep backwards compatibility if legacy code reads "token"
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('gym_token');
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('gym_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gym_user');
    }
  }, [user]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('gym_role', role);
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('gym_role');
      localStorage.removeItem('role');
    }
  }, [role]);

  const login = (newToken, newUser, newRole) => {
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setRole('');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
