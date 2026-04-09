import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, StoredAccount } from '@/types/auth';
import defaultData from '@/constants/data.json';
import { router } from "expo-router";

const ACCOUNTS_KEY = 'accounts';
const CURRENT_USER_KEY = 'currentUser';

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function initializeAccounts(): Promise<StoredAccount[]> {
  const existingAccounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (existingAccounts) {
    return JSON.parse(existingAccounts);
  }

  const initialAccounts: StoredAccount[] = defaultData.utilisateurs.map((u) => ({
    id: String(u.id),
    email: u.email,
    username: u.name,
    password: u.mot_de_passe,
  }));

  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialAccounts));
  return initialAccounts;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAccounts().then(loadCurrentUser);
  }, []);

  async function loadCurrentUser() {
    try {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    let accountsJson = await AsyncStorage.getItem(ACCOUNTS_KEY);
    let accounts: StoredAccount[] = accountsJson ? JSON.parse(accountsJson) : [];
    
    if (accounts.length === 0) {
      accounts = await initializeAccounts();
    }

    const emailExists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!emailExists) {
      return { success: false, error: 'email' };
    }

    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!account) {
      return { success: false, error: 'password' };
    }

    const user: User = {
      id: account.id,
      email: account.email,
      username: account.username
    };

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
  }

  async function signup(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
    let accountsJson = await AsyncStorage.getItem(ACCOUNTS_KEY);
    let accounts: StoredAccount[] = accountsJson ? JSON.parse(accountsJson) : [];
    
    if (accounts.length === 0) {
      accounts = await initializeAccounts();
    }

    const existingAccount = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existingAccount) {
      return { success: false, error: 'emailExists' };
    }

    const newAccount: StoredAccount = {
      id: String(Date.now()),
      email,
      username,
      password,
    };

    accounts.push(newAccount);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

    const user: User = {
      id: newAccount.id,
      email: newAccount.email,
      username: newAccount.username,
    };

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
  }

  async function logout() {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
