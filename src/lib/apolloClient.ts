import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create an Apollo Client instance
const apolloClient = new ApolloClient({
  uri: process.env['BACKEND_URI'] ?? '/api/query', // replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  }
});

export default apolloClient;
