import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create an Apollo Client instance
const apolloClient = new ApolloClient({
  uri: '/api/query', // replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

export default apolloClient;