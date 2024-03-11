import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    credentials: "include",
    link: new HttpLink({
      uri: typeof window === 'undefined' ? "http://localhost:3001/query" : "",
    }),
  });
});