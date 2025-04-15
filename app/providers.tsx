"use client";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

import { User } from "@/types/proglv";
import { whoami } from "@/lib/auth";

type AuthContextType = {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null | undefined>(undefined);

  const refreshUser = async () => {
    const res = await whoami();
    if (res.status === "success") {
      setUser(res.data);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      refreshUser();
    }
  }, [typeof document === "undefined"]);

  // refresh user info every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => refreshUser, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{user,setUser}}
      >
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
