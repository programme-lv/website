import apolloClient from '@/lib/apolloClient';
import { gql } from '@apollo/client';
import { createContext, useContext } from 'react';
import useSWR from 'swr';

interface UserData {
  id: string;
  username: string;
}

interface UserContextValue {
  userData: UserData;
  loginError: any;
  refreshUser: () => void;
}

// Create a new context
const UserContext = createContext<UserContextValue>({} as UserContextValue);

// Define your GraphQL query
const WHO_AM_I_QUERY = gql`
query Whoami {
  whoami {
      id
      username
  }
}
`;

// Create a fetcher function that uses Apollo Client to fetch data
const fetcher = async () => {
  const { data } = await apolloClient.query({
    query: WHO_AM_I_QUERY,
  });
  return data;
};

// This component uses SWR to fetch the data and provides it via context
export function UserProvider({ children }: any) {
  const { data, error, mutate } = useSWR('whoami', fetcher);

  /*
  const { data, error } = useSWR()
  if(error) return <div>failed to load</div>
  if(!data) return <div>loading...</div>
  */

  return (
    <UserContext.Provider value={{ userData: data?.whoami, loginError: error, refreshUser: mutate}}>
      {children}
    </UserContext.Provider>
  );
}

// This is a custom hook that components can use to access the user data
export function useUser() {
  return useContext(UserContext);
}
