export type UserRole = 'user' | 'admin';

export interface UserData {
  id: string;
  role: UserRole | string;
  name: string;
}

export interface UserProfile {
  name: string;
  email: string;
}
