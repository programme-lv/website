"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { User } from "@/types/proglv";
import whoami from "@/lib/user/whoami";

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
  propsUser: User | null;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps, propsUser }: ProvidersProps) {
  const [user, setUserState] = useState<User | null>(propsUser);
  const revision = useRef(0);
  const setUser = useCallback<Dispatch<SetStateAction<User | null>>>((next) => {
    revision.current += 1;
    setUserState(next);
  }, []);

  const refreshUser = useCallback(async () => {
    const startedAt = revision.current;
    const res = await whoami();
    if (res.status === "success" && revision.current === startedAt) {
      revision.current += 1;
      setUserState(res.data);
    }
  }, []);

  useEffect(() => {
    const isServer = typeof document === "undefined";
    if (!isServer) {
      refreshUser();
    }
  }, [refreshUser]);

  // refresh user info every 10 seconds
  useEffect(() => {
    const interval = setInterval(refreshUser, 10000);

    return () => clearInterval(interval);
  }, [refreshUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{user,setUser}}
      >
        <NextThemesProvider {...themeProps}>
          {children}
        </NextThemesProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
