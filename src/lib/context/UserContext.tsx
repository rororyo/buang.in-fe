"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCurrentUser = async () => {
    // Only access localStorage after component has mounted (client-side)
    if (mounted) {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          setLoading(false); // show UI immediately with cached data
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
    }

    try {
      // Attempt fresh fetch in background
      const res = await api.get("/auth/current-user");
      if (res.status === 200) {
        setUser(res.data);
        if (mounted) {
          localStorage.setItem("user", JSON.stringify(res.data)); // update cache
        }
      } else {
        setUser(null);
        if (mounted) {
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      setUser(null);
      if (mounted) {
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchCurrentUser();
    }
  }, [mounted]);

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, refreshUser: fetchCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};