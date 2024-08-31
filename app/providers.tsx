"use client";

import { NextUIProvider } from "@nextui-org/system";
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

import { getUserInfoFromJWT } from "@/lib/jwt";
import { User } from "@/types/proglv";

type AuthContextType = {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  refresh: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  refresh: () => {},
});

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  function retrieveUserInfoFromJwt(): User | null {
    const userInfo = getUserInfoFromJWT();

    if (!userInfo) return null;
    if (userInfo.expired) return null;

    return {
      uuid: userInfo.uuid,
      username: userInfo.username,
      email: userInfo.email,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
    };
  }

  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setUser(retrieveUserInfoFromJwt());
    }
  }, [typeof document === "undefined"]);

  // refresh user info every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: show some kind of warning if the user is logged out
      setUser((prev) => {
        if (!prev) return prev;
        const res = retrieveUserInfoFromJwt();
        if (!res) sessionStorage.clear();
        return res;
      })
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          refresh: () => setUser(retrieveUserInfoFromJwt()),
        }}
      >
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
