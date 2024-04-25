import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthContextType {
  user: User | null;
}

type User = {
    id: string;
    username: string;
    email: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
