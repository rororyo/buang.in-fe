'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
  gender: string | null;
  birthday: string | null;
  phone_number: string | null;
  location: string | null;
  address: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/current-user');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch current user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser: fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
