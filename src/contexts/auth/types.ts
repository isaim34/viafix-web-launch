
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'mechanic' | 'admin' | undefined;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoggedIn: boolean;
  authChecked: boolean;
  currentUserRole?: string;
  currentUserName?: string;
  userEmail?: string;
  updateUserName: (name: string) => void;
  getFirstName: (name?: string) => string;
}
