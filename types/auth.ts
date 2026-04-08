export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type StoredAuthSession = {
  currentUser: UserProfile | null;
};

