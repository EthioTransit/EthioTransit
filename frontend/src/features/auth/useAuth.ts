import { useState, useEffect } from 'react';
import { authStore } from './authStore';
import { User } from '../../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [token, setToken] = useState<string | null>(authStore.getToken());

  useEffect(() => {
    return authStore.subscribe(() => {
      setUser(authStore.getUser());
      setToken(authStore.getToken());
    });
  }, []);

  return {
    user,
    token,
    isAuthenticated: authStore.isAuthenticated(),
    guestLockId: authStore.getGuestLockId(),
    login: authStore.setAuth,
    logout: authStore.logout,
  };
}
