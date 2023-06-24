import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { createContext, useContext } from 'react';
import useSWR from 'swr';

interface UserContextValue {
    data: any;
    error: any;
}

// Create a new context
const UserContext = createContext<UserContextValue|null>(null);

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3001/query', // replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

// Define your GraphQL query
const WHO_AM_I_QUERY = gql`
  {
    whoami {
      id
      name
      email
    }
  }
`;

// Create a fetcher function that uses Apollo Client to fetch data
const fetcher = async () => {
  const { data } = await client.query({
    query: WHO_AM_I_QUERY,
  });
  return data;
};

// This component uses SWR to fetch the data and provides it via context
export function UserProvider({ children }:any) {
  const { data, error } = useSWR('whoami', fetcher);

  return (
    <UserContext.Provider value={{ data, error }}>
      {children}
    </UserContext.Provider>
  );
}

// This is a custom hook that components can use to access the user data
export function useUser() {
  return useContext(UserContext);
}
