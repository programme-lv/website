import { User } from '@/gql/graphql';
import { createContext, useContext } from 'react';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  logout: () => void;
  login: (user:User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};