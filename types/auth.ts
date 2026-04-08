<<<<<<< HEAD
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
=======
export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type StoredAuthSession = {
  currentUser: UserProfile | null;
};

>>>>>>> d69122f (feat: implement user authentication and profile management)
