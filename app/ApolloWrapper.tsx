"use client";
// ^ this file needs the "use client" pragma

import { ApolloLink, HttpLink, split } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from 'graphql-ws';

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri:  typeof window === 'undefined' ? process.env.BACKEND_URI : "/api/query",
    fetchOptions: { cache: "no-store" },
    headers:{
      "Accept-Language": "lv-LV,lv;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  });

  const wsLink = new GraphQLWsLink(createClient({
    url: '/api/query',
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );
  
  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({stripDefer: true,}),
            httpLink,
          ])
        : splitLink,
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}