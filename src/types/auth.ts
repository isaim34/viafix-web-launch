
export type UserType = 'customer' | 'mechanic';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType?: UserType;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
