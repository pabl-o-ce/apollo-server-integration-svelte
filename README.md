# Apollo Server Integration for SvelteKit

[![NPM Version](https://img.shields.io/npm/v/apollo-server-integration-svelte?logo=npm&logoColor=%23ffffff&color=%234ec820)
](https://badge.fury.io/js/apollo-server-integration-svelte)

This package provides an integration for using [Apollo Server](https://www.apollographql.com/docs/apollo-server/) with [SvelteKit](https://kit.svelte.dev/). It allows you to easily set up a GraphQL server within your SvelteKit application.

## Installation

To install the package, run the following command:

```bash
npm install apollo-server-integration-svelte
```

## Getting started

1. Create a new file named `+server.ts` inside the `src/routes/graphql` directory of your SvelteKit project.

2. Import the necessary modules and define your GraphQL schema and resolvers:

```typescript
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateSvelteKitHandler } from 'apollo-server-integration-svelte';
import { gql } from 'graphql-tag';
import type { RequestHandler } from './$types';

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export const GET: RequestHandler = startServerAndCreateSvelteKitHandler(server);
export const POST: RequestHandler = startServerAndCreateSvelteKitHandler(server);
```
You may also pass a context function to `startServerAndCreateSvelteKitHandler` as such:
```typescript
export const GET: RequestHandler = startServerAndCreateSvelteKitHandler(server, {
  context: async (event) => ({ event, user: await getLoggedInUser(event) }),
});

export const POST: RequestHandler = startServerAndCreateSvelteKitHandler(server, {
  context: async (event) => ({ event, user: await getLoggedInUser(event) }),
});
```
The SvelteKit `RequestEvent` object is passed along to the context function.

## Typescript

When using this integration with SvelteKit, you can specify the type of the context object using the generic type parameter:

```typescript
import type { RequestEvent } from '@sveltejs/kit';

// The context object will have the type { event: RequestEvent, user: User }
const handler = startServerAndCreateSvelteKitHandler<{ event: RequestEvent; user: User }>(server, {
  context: async (event) => ({ event, user: await getLoggedInUser(event) }),
});
```

This ensures that the context object has the correct type signature.
## API

### `startServerAndCreateSvelteKitHandler(server, options?)`

This function takes an instance of `ApolloServer` and optional `options` and returns a request handler that can be used as a SvelteKit server route handler.

- `server`: An instance of `ApolloServer` configured with your GraphQL schema and resolvers.
- `options` (optional): An object containing additional options for the handler.
  - `context` (optional): A function that returns a custom context object for each request.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/pabl-o-ce/apollo-server-integration-svelte).

## License

This package is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

This package is inspired by the official [apollo-server-integration-next](https://www.npmjs.com/package/apollo-server-integration-next) package and adapted for SvelteKit.

Special thanks to the Apollo Server and SvelteKit communities for their excellent work.
