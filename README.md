# Apollo Server Integration for SvelteKit

[![npm version](https://badge.fury.io/js/apollo-server-integration-svelte.svg)](https://badge.fury.io/js/apollo-server-integration-svelte)

This package provides an integration for using [Apollo Server](https://www.apollographql.com/docs/apollo-server/) with [SvelteKit](https://kit.svelte.dev/). It allows you to easily set up a GraphQL server within your SvelteKit application.

## Installation

To install the package, run the following command:

```bash
npm install apollo-server-integration-svelte
```

## Usage

1. Create a new file named `+server.ts` inside the `src/routes/graphql` directory of your SvelteKit project.

2. Import the necessary modules and define your GraphQL schema and resolvers:

```typescript
import { startServerAndCreateSvelteKitHandler } from 'apollo-server-integration-svelte';
import { ApolloServer } from '@apollo/server';
import type { BaseContext } from '@apollo/server';
import { typeDefs } from '$lib/graphql/schema';
import { resolvers } from '$lib/graphql/resolvers';
import type { RequestHandler } from './$types';

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});

export const POST: RequestHandler = startServerAndCreateSvelteKitHandler(server);
export const GET: RequestHandler = startServerAndCreateSvelteKitHandler(server);
```

3. Create your GraphQL schema and resolvers in separate files, such as `src/lib/graphql/schema.ts` and `src/lib/graphql/resolvers.ts`.

4. Start your SvelteKit development server:

```bash
npm run dev
```

5. Access your GraphQL endpoint at `http://localhost:5173/graphql` (or the appropriate URL based on your SvelteKit configuration).

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
