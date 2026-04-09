export type AuthState = {
  currentUser: User | null;
};

export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
};

export type StoredAccount = {
  id: string;
  email: string;
  username: string;
  password: string;
  avatarUrl?: string;
};
