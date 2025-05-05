
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'mechanic' | null;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // Update return types to match Supabase's actual return types
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  currentUserRole?: string;
  currentUserName?: string;
  isLoggedIn: boolean;
  authChecked: boolean;
  updateUserName: (name: string) => void;
  userEmail?: string;
  getFirstName: (fullName: string) => string;
}
