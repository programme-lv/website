import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3001/query",
  documents: ["app/**/*.ts", "app/**/*.tsx", "app/", "components/**/*.ts", "components/**/*.tsx", "components/", "graphql/**/*.ts", "graphql/**/*.tsx", "graphql/"],
  generates: {
    "./gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
