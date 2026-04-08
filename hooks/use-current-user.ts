import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import type { StoredAuthSession, UserProfile } from '@/types/auth';

export const AUTH_STORAGE_KEY = '@kabut/auth-session';

export async function clearCurrentUserSession() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCurrentUser = useCallback(async () => {
    setIsLoading(true);

    try {
      const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const parsedValue = storedValue ? (JSON.parse(storedValue) as StoredAuthSession) : null;
      setCurrentUser(parsedValue?.currentUser ?? null);
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutCurrentUser = useCallback(async () => {
    try {
      await clearCurrentUserSession();
    } finally {
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCurrentUser();
  }, [refreshCurrentUser]);

  useFocusEffect(
    useCallback(() => {
      void refreshCurrentUser();
    }, [refreshCurrentUser])
  );

  return { currentUser, isLoading, refreshCurrentUser, logoutCurrentUser };
}

