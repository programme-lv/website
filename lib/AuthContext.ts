import { User } from '@/gql/graphql';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuthReducerAction } from './userAuthReducer';

export interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthDispatchContext = createContext<React.Dispatch<userAuthReducerAction> | undefined>(undefined);

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
};