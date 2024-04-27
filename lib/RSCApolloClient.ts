import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    credentials: "include",
    link: new HttpLink({
      uri: typeof window === 'undefined' ? process.env.BACKEND_URI : "",
    }),
    /*
    headers:{
      "Accept-Language": "lv-LV,lv;q=0.9,en-US;q=0.8,en;q=0.7"
    }
    */
  });
});